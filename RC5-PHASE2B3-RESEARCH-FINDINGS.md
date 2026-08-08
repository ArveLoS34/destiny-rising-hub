# RC-5 Phase 2B-3 — Research Findings

**Date:** 2026-08-09  
**Status:** Research complete — awaiting plan approval  
**Scope:** Security hardening research only, NO code changes

---

## Finding 1: `@better-auth/redis-storage` Package

### Package Details

| Property | Value |
|----------|-------|
| Latest stable | `1.6.22` |
| Peer dependency | `ioredis` |
| Dependencies | 0 (zero) |
| License | MIT |
| Better Auth compatibility | `1.6.x` series (our: `1.6.25`) |

### API — What It Provides

```typescript
import { Redis } from "ioredis";
import { redisStorage } from "@better-auth/redis-storage";

const redis = new Redis(process.env.REDIS_URL);

secondaryStorage: redisStorage({
  client: redis,
  keyPrefix: "better-auth:",  // optional
})
```

### Methods Implemented

| Method | Atomic? | Notes |
|--------|---------|-------|
| `get(key)` | ✅ | Simple `redis.get()` |
| `set(key, value, ttl)` | ✅ | `redis.setex()` with TTL |
| `delete(key)` | ✅ | `redis.del()` |
| `increment(key, ttl)` | ✅ **Lua script** | `INCR` + conditional `EXPIRE` (TTL set only on first creation) |
| `getAndDelete(key)` | ✅ **Lua/GETDEL** | Atomic read-and-delete, fallback for Redis < 6.2 |
| `listKeys()` | ✅ | Pattern-based key listing |
| `clear()` | ✅ | Bulk delete all prefixed keys |

### Critical: `increment` Lua Script

```lua
local value = redis.call("INCR", KEYS[1])
if value == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return value
```

**Why this matters:**
- Window TTL is set **once** when the counter is first created (`value == 1`)
- Continued traffic does **NOT** extend the window
- This fixes the "window extension" bug present in manual implementations
- Provides **strict atomic enforcement** for rate limiting

### Comparison: Our Current Implementation vs `@better-auth/redis-storage`

| Capability | Our current `redisStorage` | `@better-auth/redis-storage` |
|------------|---------------------------|------------------------------|
| `get` | ✅ Manual ioredis | ✅ Built-in |
| `set` | ✅ Manual ioredis | ✅ Built-in |
| `delete` | ✅ Manual ioredis | ✅ Built-in |
| `increment` | ❌ **MISSING** | ✅ **Lua atomic** |
| `getAndDelete` | ❌ **MISSING** | ✅ **Lua/GETDEL** |
| Window TTL fix | ❌ Not fixed | ✅ Fixed in 1.6.17 |
| Key prefix | ❌ None | ✅ `"better-auth:"` |
| Error handling | Manual try/catch | Built-in |
| Redis < 6.2 fallback | N/A | ✅ Lua fallback for GETDEL |

### Impact of Missing `increment`

Better Auth changelog (v1.6.17):
> "Secondary-storage-only deployments remain best-effort for these counters."

Without `increment`:
- Concurrent requests CAN bypass rate limits
- Window TTL may be extended by continued traffic
- Rate limiting is advisory, not strict

With `increment`:
- Atomic counter updates
- Fixed window TTL
- Strict enforcement under concurrent load

---

## Finding 2: `ioredis` Dependency Status

### Current State

- `ioredis` is **NOT** in `package.json`
- Our code uses **dynamic import**: `await import("ioredis")`
- This works at runtime if `ioredis` is available in `node_modules`

### Docker Environment Check Required

```bash
# In Docker container:
ls node_modules/ioredis/package.json
node -e "require('ioredis')"
```

If `ioredis` is not installed, it needs to be added as a dependency.

### Dependency Options

| Option | Action | Risk |
|--------|--------|------|
| A | Add `ioredis` to `package.json` | Minimal — needed regardless |
| B | Add `@better-auth/redis-storage` + `ioredis` | Low — official package |
| C | Keep dynamic import, add `increment` manually | Medium — custom implementation |

---

## Finding 3: Secret Rotation

### Better Auth Secret Rotation Support

Better Auth supports **non-destructive secret rotation** via versioned secrets.

### Configuration

```typescript
// Option 1: Config object
export const auth = betterAuth({
  secrets: [
    { version: 2, value: "new-secret-key" },
    { version: 1, value: "old-secret-key" },
  ],
});

// Option 2: Environment variable
// BETTER_AUTH_SECRETS=2:new-secret-base64,1:old-secret-base64
```

### How It Works

| Aspect | Behavior |
|--------|----------|
| **Encryption** | Always uses the **latest** key (first in array) |
| **Decryption** | Tries **all** configured keys |
| **Existing sessions** | Remain valid — decrypted with old key |
| **New data** | Encrypted with new key |
| **Re-encryption** | Lazy — on next write |
| **Downtime** | None |
| **Migration** | None required |

### Impact on Current Setup

Our current config:
```typescript
secret: process.env.BETTER_AUTH_SECRET,  // No fallback
```

If we change `BETTER_AUTH_SECRET`:
- ❌ All existing sessions are **invalidated**
- ❌ All users must re-authenticate
- ❌ Potential service disruption

With rotation (`BETTER_AUTH_SECRETS`):
- ✅ Existing sessions remain valid
- ✅ New data encrypted with new key
- ✅ Zero downtime
- ✅ Gradual rollout possible

### Production Recommendation

```bash
# Phase 1: Add new secret alongside old
BETTER_AUTH_SECRETS=2:new-production-secret,1:old-poc-secret

# Phase 2: After all sessions naturally expire, remove old
BETTER_AUTH_SECRETS=2:new-production-secret
```

---

## Finding 4: Better Auth 1.7 Upgrade Path

### Upcoming Breaking Changes (1.7)

From the 1.7 upgrade guide:

| Change | Current (1.6.x) | Required (1.7) |
|--------|-----------------|-----------------|
| `SecondaryStorage.increment` | Optional | **Required** |
| `SecondaryStorage.getAndDelete` | Optional | **Required** |
| Rate-limit storage | `get`/`set` accepted | **`consume` required** |
| Database adapters | `incrementOne` optional | **Required** |

### Implication

If we upgrade to Better Auth 1.7 in the future:
- Our manual `redisStorage` will **break** (missing `increment`, `getAndDelete`)
- Using `@better-auth/redis-storage` now = future-proof
- Custom implementation = must add methods later

---

## Summary

| Topic | Finding | Recommendation |
|-------|---------|----------------|
| `@better-auth/redis-storage` | Official package, atomic increment, 0 deps | ✅ **Use it** |
| `ioredis` | Not in `package.json`, dynamic import | Add as dependency |
| Secret rotation | Non-destructive via `BETTER_AUTH_SECRETS` | Use for production |
| Better Auth 1.7 | Breaking changes for custom storage | Using official package = safe |

---

## Next Steps (Pending Approval)

1. Add `ioredis` + `@better-auth/redis-storage` to `package.json`
2. Replace manual `redisStorage` in `src/lib/auth/index.ts` with `redisStorage({ client: redis })`
3. Configure `BETTER_AUTH_SECRETS` for production
4. Docker test to verify atomic rate limiting
5. No schema changes, no migration changes

---

**Research complete. Awaiting plan approval before any code changes.**
