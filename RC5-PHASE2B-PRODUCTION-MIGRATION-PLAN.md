# RC-5 Phase 2B — Production Auth Migration Plan

**Status:** 📋 PLANNING (awaiting approval)  
**Date:** 2026-08-08  
**Branch:** `feature/rc3-performance`  
**Phase 2A:** ✅ COMPLETE  
**Schema:** FROZEN (no changes unless explicitly noted)  
**Docker:** User-managed (developer does NOT run Docker)

---

## 1. CURRENT ARCHITECTURE

### Auth Stack Overview

```
┌──────────────────────────────────────────────────────────────┐
│  Client Components                                           │
│  ├─ login/page.tsx      → useAuth() → signIn, demoLogin      │
│  └─ profile/page.tsx    → useAuth() → user, signOut, demo    │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│  Auth Context (auth-context.tsx)                              │
│  ├─ useAuth() hook                                            │
│  ├─ authFetch() → fetch("/api/auth")                         │
│  ├─ CSRF: csrf_token cookie + X-CSRF-Token header            │
│  └─ Credentials: include (cookies auto-sent)                 │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│  Production Route: /api/auth/[[...all]]/route.ts              │
│  ├─ Action-based routing ({ action: "sign-in" })             │
│  ├─ Mock auth handler (authService)                          │
│  ├─ CSRF: double-submit cookie pattern                       │
│  └─ Session: in-memory Map (NOT persistent)                  │
└──────────────────────┬───────────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────────┐
│  Mock Auth Service (auth-service.ts)                          │
│  ├─ In-memory users Map                                       │
│  ├─ In-memory sessions Map                                    │
│  ├─ bcrypt password hashing                                  │
│  ├─ CSRF token generation/validation                         │
│  └─ Rate limiting (in-memory)                                │
└──────────────────────────────────────────────────────────────┘
```

### Relevant Files

| File | Role | Current State |
|------|------|---------------|
| `src/lib/auth/index.ts` | Auth config entry | Mock auth export, Better Auth commented out |
| `src/lib/auth/auth-context.tsx` | Client auth context | Fetch-based, `/api/auth` action routing |
| `src/lib/auth/client.ts` | Better Auth client | **Exists but unused** |
| `src/app/api/auth/[[...all]]/route.ts` | Production route | Mock auth handler, Better Auth commented out |
| `src/features/user/services/auth-service.ts` | Mock auth service | In-memory, to be removed |
| `src/app/(auth)/login/page.tsx` | Login UI | Uses `useAuth()` |
| `src/app/profile/page.tsx` | Profile UI | Uses `useAuth()` |
| `src/providers/index.tsx` | Provider wrapper | Contains `AuthProvider` |
| `src/features/security/services/security-service.ts` | Security service | Uses `passwordHash` |

---

## 2. PRODUCTION ROUTE MIGRATION

### Current State

`src/app/api/auth/[[...all]]/route.ts`:
- Action-based routing (`{ action: "sign-in" }`)
- Mock auth handler (284 lines)
- Better Auth handler commented out at bottom
- Custom CSRF implementation
- Custom cookie management

### Target State

```typescript
// src/app/api/auth/[[...all]]/route.ts (production)
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

~5 lines instead of 284.

### Changes Required

| Step | File | Action |
|------|------|--------|
| 1 | `src/lib/auth/index.ts` | Uncomment Better Auth config, remove mock export |
| 2 | `src/lib/auth/index.ts` | Add PrismaPg adapter (from POC) |
| 3 | `src/lib/auth/index.ts` | Add `basePath` config (remove for `/api/auth`) |
| 4 | `src/lib/auth/index.ts` | Add `user.fields` mapping |
| 5 | `src/lib/auth/index.ts` | Add `trustedOrigins` |
| 6 | `src/app/api/auth/[[...all]]/route.ts` | Replace entire file with Better Auth handler |
| 7 | `src/features/user/services/auth-service.ts` | Mark as deprecated (remove later in P3) |

### Schema Effect

**None.** Better Auth uses existing frozen schema.

### Migration Required

**None** for route migration itself. (Existing user migration is separate — see Section 3.)

### Risk

**Medium.** Action-based API contract changes to Better Auth endpoint-based API. Client code (`auth-context.tsx`) must be updated simultaneously.

### Rollback

Revert `src/app/api/auth/[[...all]]/route.ts` and `src/lib/auth/index.ts` to previous commit.

---

## 3. EXISTING USER MIGRATION

### Current State

Mock auth stores passwords in `User.passwordHash`:
```
User.passwordHash = bcrypt hash
```

Better Auth stores passwords in `Account.password`:
```
Account.password = bcrypt hash
Account.providerId = "credential"
Account.accountId = User.id
```

### Problem

Existing users created by mock auth have `User.passwordHash` but no `Account` record with `providerId = "credential"`. These users cannot sign in with Better Auth.

### Migration Strategy

**Option A: Script-based migration (recommended)**

```sql
-- Migration script (run once, before cutover)
INSERT INTO "Account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
SELECT
  gen_random_uuid()::text,
  u.id,
  'credential',
  u.id,
  u."passwordHash",
  NOW(),
  NOW()
FROM "User" u
WHERE u."passwordHash" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Account" a
    WHERE a."userId" = u.id AND a."providerId" = 'credential'
  );
```

**Effect:** Copies `User.passwordHash` → `Account.password` for all existing users. Creates credential Account records.

**Schema Effect:** **None.** Uses existing `Account.password` column.

**Data Loss Risk:** **None.** Read-only copy. Original `User.passwordHash` preserved.

**Rollback:** Delete inserted Account records:
```sql
DELETE FROM "Account"
WHERE "providerId" = 'credential'
  AND "userId" IN (SELECT id FROM "User" WHERE "passwordHash" IS NOT NULL);
```

**Option B: Lazy migration (alternative)**

Create Account record on first successful sign-in. Requires custom Better Auth plugin or middleware.

**Not recommended** — adds complexity, Option A is simpler and safer.

### Demo User Migration

Demo user (`guardian@destinyrisinghub.com`) has `passwordHash` from mock auth. Same migration script applies.

### New Sign-ups After Cutover

Better Auth creates both `User` and `Account` records automatically. No migration needed for new users.

---

## 4. AUTH CONTEXT / CLIENT MIGRATION

### Current State

`src/lib/auth/auth-context.tsx`:
- Custom `useAuth()` hook
- `authFetch()` → `fetch("/api/auth", { body: { action: "sign-in" } })`
- Custom CSRF token handling
- Custom cookie management

### Target State

Two options:

**Option A: Use existing Better Auth client (`auth-client.ts`)**

```typescript
// src/lib/auth/client.ts (already exists, currently unused)
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
```

Replace `auth-context.tsx` with Better Auth client:

```typescript
// src/lib/auth/auth-context.tsx (simplified)
"use client";
import { useSession } from "@/lib/auth/client";

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      isLoading: isPending,
      isAuthenticated: !!session,
      signIn: authClient.signIn.email,
      signUp: authClient.signUp.email,
      signOut: authClient.signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Option B: Keep `auth-context.tsx`, change internal implementation**

Keep `useAuth()` interface, change `authFetch()` to use Better Auth client internally.

### Caller Impact

| Component | Current | After Migration |
|-----------|---------|-----------------|
| `login/page.tsx` | `useAuth().signIn(email, password)` | Same interface ✅ |
| `login/page.tsx` | `useAuth().demoLogin()` | **Must change** — Better Auth has no demo login |
| `profile/page.tsx` | `useAuth().user` | Same interface ✅ |
| `profile/page.tsx` | `useAuth().signOut()` | Same interface ✅ |
| `profile/page.tsx` | `useAuth().demoLogin()` | **Must change** — auto-login as demo |

### Demo Login Strategy

Better Auth has no built-in demo login. Options:

1. **Remove demo login** — Clean break, users must register
2. **Keep mock auth fallback** — Demo login bypasses Better Auth
3. **Pre-seed demo user** — Create demo user in DB, sign-in via Better Auth

**Recommended:** Option 3 — Pre-seed demo user, use Better Auth sign-in.

### Schema Effect

**None.** Client-side change only.

### Risk

**Medium.** `login/page.tsx` and `profile/page.tsx` must be updated. Demo login behavior changes.

### Rollback

Revert `auth-context.tsx`, `login/page.tsx`, `profile/page.tsx`.

---

## 5. SECURITY HARDENING

### `BETTER_AUTH_SECRET`

**Current:** `process.env.BETTER_AUTH_SECRET || "poc-secret-not-for-production"`

**Production requirement:**
- Minimum 32 characters
- High entropy (random string)
- Stored in environment variable, NOT in code

**Action:**
- Generate production secret: `openssl rand -base64 48`
- Add to `.env.production` (not committed)
- Remove fallback default from code

### `trustedOrigins`

**Current:** `["http://localhost:3000"]`

**Production:**
```typescript
trustedOrigins: [
  process.env.NEXT_PUBLIC_APP_URL,  // e.g., "https://destinyrisinghub.com"
  // Add any additional trusted domains
]
```

### SameSite Policy

**POC result:** `SameSite=Lax` (Better Auth default)  
**Mock auth:** `SameSite=Strict`

**Assessment:** `Lax` is acceptable for most applications. `Strict` provides stronger CSRF protection but may break legitimate cross-site navigation.

**Recommendation:** Keep `Lax` unless specific security policy requires `Strict`.

### Cookie Security

**Production requirements:**
- `Secure: true` (HTTPS only)
- `HttpOnly: true` (session token)
- `SameSite: Lax` (or `Strict`)
- `Path: /`

**Better Auth handles these automatically based on `NODE_ENV`.**

### Risk

**Low.** Security improvements, no breaking changes.

### Rollback

Revert environment variables.

---

## 6. REDIS RATE LIMITING

### Current State

POC uses `storage: "memory"` for rate limiting. Redis is available in Docker but not connected.

### Target State

```typescript
// src/lib/auth/index.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export const auth = betterAuth({
  // ...
  secondaryStorage: {
    get: async (key) => redis.get(key),
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, "EX", ttl);
      else await redis.set(key, value);
    },
    delete: async (key) => redis.del(key),
  },
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 900, max: 5 },
      "/sign-up/email": { window: 3600, max: 3 },
    },
  },
});
```

### Dependency

**`ioredis`** must be added to `package.json`. Currently not installed.

**Schema Effect:** **None.**

### Risk

**Low.** Additive change. If Redis unavailable, rate limiting falls back to memory.

### Rollback

Remove `secondaryStorage` and `rateLimit.storage` config.

---

## 7. OAUTH PROVIDERS

### Current State

Disabled in POC. Credentials not available.

### Target State

```typescript
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  },
}
```

### Prerequisites

1. Create OAuth apps in Google Cloud Console, GitHub, Discord
2. Set callback URLs: `https://destinyrisinghub.com/api/auth/callback/{provider}`
3. Add credentials to environment variables

### Schema Effect

**None.** Better Auth creates Account records automatically for OAuth users.

### Risk

**Low.** Additive change. No impact on email/password auth.

### Rollback

Remove `socialProviders` config.

---

## 8. COOKIE POLICY

### Current State

| Cookie | Mock Auth | Better Auth POC |
|--------|-----------|-----------------|
| `session_token` | ✅ | ✅ |
| `csrf_token` | ✅ | ❌ (Better Auth uses different CSRF) |
| `better-auth.session_data` | ❌ | ✅ (cookie cache) |
| `better-auth.dont_remember` | ❌ | ✅ (remember me) |

### Changes

- `csrf_token` cookie removed (Better Auth uses Origin validation instead)
- `better-auth.*` cookies added automatically

### Client Impact

`auth-context.tsx` CSRF helper (`getCsrfTokenFromCookie`) will be removed. Better Auth handles CSRF internally.

### Risk

**Low.** Cookie changes are transparent to users.

### Rollback

Revert auth config.

---

## 9. POC CLEANUP

### Files to Remove (after production migration verified)

| File | Reason |
|------|--------|
| `src/lib/auth/better-auth-poc.ts` | POC-only instance |
| `src/app/api/auth-test/[[...all]]/route.ts` | POC test route |
| `scripts/test-better-auth-poc.js` | POC test script |
| `src/features/user/services/auth-service.ts` | Mock auth service (deprecated) |
| `src/lib/auth/client.ts` | Replace with production client config |

### Files to Modify

| File | Action |
|------|--------|
| `src/lib/auth/index.ts` | Remove mock export, keep production config |
| `src/app/api/auth/[[...all]]/route.ts` | Replace with Better Auth handler |
| `src/lib/auth/auth-context.tsx` | Simplify to use Better Auth client |

### Timing

**POC cleanup happens AFTER production migration is verified in Docker.**

### Risk

**Low.** POC files are isolated, no production dependencies.

### Rollback

Git revert.

---

## 10. SCHEMA FREEZE IMPACT

### Summary

| Change | Schema Effect | Migration Required |
|--------|--------------|-------------------|
| Route migration | **None** | **None** |
| Existing user migration | **None** | Data migration (not schema) |
| Auth context migration | **None** | **None** |
| Security hardening | **None** | **None** |
| Redis rate limiting | **None** | **None** |
| OAuth providers | **None** | **None** |
| Cookie policy | **None** | **None** |
| POC cleanup | **None** | **None** |

### Schema Freeze Status

```
✅ User:         FROZEN
✅ Session:      FROZEN
✅ Account:      FROZEN
✅ Verification: FROZEN

❌ @@map():      NOT NEEDED (proven in Phase 2A)
❌ Migration:    NOT NEEDED (proven in Phase 2A)
❌ Constraint:   NOT NEEDED (proven in Phase 2A)
```

**Schema freeze is fully preserved.** All Phase 2B changes are code-level only.

---

## 11. MIGRATION / ROLLBACK PLAN

### Implementation Order

```
Step 1: Existing user data migration (SQL script)
           ↓
Step 2: Production auth config (src/lib/auth/index.ts)
           ↓
Step 3: Production route (src/app/api/auth/[[...all]]/route.ts)
           ↓
Step 4: Auth context migration (auth-context.tsx)
           ↓
Step 5: Client component updates (login, profile)
           ↓
Step 6: Docker test (user-managed)
           ↓
Step 7: Security hardening (secret, trustedOrigins, Redis)
           ↓
Step 8: OAuth providers (when credentials available)
           ↓
Step 9: POC cleanup
```

### Rollback Points

| After Step | Rollback Method |
|------------|-----------------|
| Step 1 | SQL: DELETE inserted Account records |
| Step 2 | Git revert `src/lib/auth/index.ts` |
| Step 3 | Git revert `src/app/api/auth/[[...all]]/route.ts` |
| Step 4-5 | Git revert auth-context + client components |
| Step 6 | Docker: `docker compose down -v && docker compose up --build -d` |
| Step 7-9 | Git revert |

### Zero-Downtime Strategy

**Not required.** This is a development/sandbox environment. Downtime during cutover is acceptable.

---

## 12. TEST PLAN

### Pre-Migration Tests

- [ ] Existing user data migration script tested in Docker
- [ ] Account records created correctly
- [ ] Password hashes copied correctly

### Post-Migration Tests

- [ ] Sign-up (new user) → 200
- [ ] Sign-in (existing user) → 200
- [ ] Get-session (authenticated) → 200 + user
- [ ] Sign-out → 200
- [ ] Get-session (after sign-out) → null
- [ ] Wrong password → 401
- [ ] Duplicate sign-up → 422
- [ ] Origin validation → 403 without Origin, 200 with Origin
- [ ] Session persistence in PostgreSQL
- [ ] Cookie contract (`session_token`, HttpOnly, SameSite)

### Regression Tests

- [ ] RC-4 smoke test adapted for Better Auth
- [ ] Login page UI works
- [ ] Profile page UI works
- [ ] Session persistence across page refresh
- [ ] Redirect after login

### Performance Tests

- [ ] Sign-in response time < 500ms
- [ ] Get-session response time < 200ms
- [ ] Redis rate limiting functional

---

## 13. RISKS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Existing user migration fails | Low | High | Test migration script before cutover |
| Better Auth config error | Medium | Medium | POC proven in Phase 2A |
| Client component breakage | Medium | Medium | Keep `useAuth()` interface |
| Cookie contract mismatch | Low | Medium | POC proven `session_token` works |
| CSRF behavior change | Low | Low | Better Auth Origin validation proven |
| Redis connection failure | Low | Low | Fallback to memory rate limiting |
| Demo login removed | Medium | Low | Pre-seed demo user option |
| OAuth credentials missing | High | Low | OAuth is optional, not blocking |

---

## 14. RECOMMENDED IMPLEMENTATION ORDER

### Phase 2B-1: Data Migration (Low Risk)

1. Write existing user migration SQL script
2. Test in Docker
3. Verify Account records created
4. **Commit:** `data(rc5): add existing user migration script`

### Phase 2B-2: Production Auth Config (Medium Risk)

1. Update `src/lib/auth/index.ts` with production Better Auth config
2. Add PrismaPg adapter, field mapping, trustedOrigins
3. **Do NOT change route yet**
4. **Commit:** `feat(rc5): configure production Better Auth instance`

### Phase 2B-3: Production Route (Medium Risk)

1. Replace `src/app/api/auth/[[...all]]/route.ts` with Better Auth handler
2. Simultaneously update `auth-context.tsx` to use Better Auth client
3. Update `login/page.tsx` and `profile/page.tsx`
4. Docker test
5. **Commit:** `feat(rc5): migrate production auth route to Better Auth`

### Phase 2B-4: Security Hardening (Low Risk)

1. Generate production `BETTER_AUTH_SECRET`
2. Add Redis rate limiting
3. Configure `trustedOrigins` for production domain
4. **Commit:** `security(rc5): harden production auth security`

### Phase 2B-5: OAuth (Low Risk, Optional)

1. Add OAuth provider configs (when credentials available)
2. Update login UI with social login buttons
3. **Commit:** `feat(rc5): add OAuth provider configuration`

### Phase 2B-6: POC Cleanup (Low Risk)

1. Remove POC files
2. Remove mock auth service
3. **Commit:** `cleanup(rc5): remove POC and mock auth files`

---

## Approval Required

**This plan requires explicit approval before any code changes.**

Specifically:

1. ✅ Existing user migration strategy (Option A: SQL script)
2. ✅ Auth context migration strategy (Option A: Better Auth client)
3. ✅ Demo login strategy (Option 3: Pre-seed demo user)
4. ✅ Implementation order (Phase 2B-1 through 2B-6)
5. ✅ Schema freeze preservation confirmed

---

**Next step:** Awaiting approval to begin Phase 2B-1 (existing user migration script).

**No code changes will be made until approval is received.**
