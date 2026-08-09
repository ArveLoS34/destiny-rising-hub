# RC-5 Technical Plan: Better Auth Migration

**Status:** ✅ APPROVED — Phase 1 in progress  
**Branch:** `feature/rc3-performance`  
**RC-4 Status:** PASS (17/17)

---

## Guiding Principles (Agreed)

1. **Phase separation** — Schema changes and Better Auth activation in separate commits
2. **OAuth deferred** — Not required for RC-5 PASS; can be added later when credentials are ready
3. **Don't reinvent** — Use Better Auth's built-in features (CSRF, session rotation, cookies, persistence)
4. **Mock auth preserved** — Mark as deprecated, remove only after RC-5 PASS
5. **Redis fallback** — Health check + logging + controlled fallback if Redis unavailable
6. **Per-phase validation** — Docker verification after each phase
7. **Split PASS criteria** — Mandatory vs optional

---

## Phase 1: Prisma Schema Alignment

**Goal:** Make Prisma schema fully compatible with Better Auth  
**Commit boundary:** Schema changes only, no auth code changes  
**Validation:** Docker + migration test

### Changes Required

Better Auth expects these models:
- **User** — id, name, email, emailVerified, image, createdAt, updatedAt
- **Session** — id, expiresAt, token, ipAddress, userAgent, userId
- **Account** — id, accountId, providerId, userId, accessToken, refreshToken, etc.
- **Verification** — id, identifier, value, expiresAt, createdAt, updatedAt

### Current Schema vs Better Auth Requirements

| Model | Current State | Action Needed |
|-------|--------------|---------------|
| **User** | Has username, displayName, avatar (not name/image) | Add field mappings in Better Auth config |
| **Session** | ✅ Compatible (token, userId, expiresAt, ipAddress, userAgent) | No changes needed |
| **Account** | Uses snake_case (refresh_token, access_token, expires_at) | Rename to camelCase, change expires_at type Int→DateTime |
| **Verification** | ❌ Does not exist | Add new model |

### Detailed Changes

```prisma
// Account model — rename fields to camelCase
model Account {
  id                   String    @id @default(cuid())
  accountId            String    // was: providerAccountId
  providerId           String    // was: provider
  userId               String
  accessToken          String?   @db.Text  // was: access_token
  refreshToken         String?   @db.Text  // was: refresh_token
  idToken              String?   @db.Text  // was: id_token
  accessTokenExpiresAt DateTime? // NEW
  refreshTokenExpiresAt DateTime? // NEW
  scope                String?
  password             String?   // NEW (for credential accounts)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([providerId, accountId])
  @@index([userId])
}

// Verification model — NEW
model Verification {
  id         String   @id @default(cuid())
  identifier String   // email or other identifier
  value      String   @db.Text  // verification token
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@index([expiresAt])
}
```

### Deliverables
- [ ] Prisma schema updated
- [ ] Migration generated (`npx prisma migrate dev`)
- [ ] Migration tested in Docker
- [ ] Schema documentation updated
- [ ] Phase 1 PASS confirmed

---

## Phase 2: Better Auth Activation

**Goal:** Activate Better Auth alongside mock auth (mock auth as fallback)  
**Commit boundary:** Better Auth config + route update, mock auth preserved  
**Validation:** Docker smoke test

### Approach
- Uncomment and update Better Auth config in `src/lib/auth/index.ts`
- Create separate Better Auth route handler
- Keep mock auth route as fallback (feature flag or env-based switch)
- Use Better Auth's built-in CSRF, session management, cookies

### Key Config
```typescript
export const auth = betterAuth({
  database: { provider: "pg", client: prisma },
  emailAndPassword: { enabled: true },
  rateLimit: { enabled: true, storage: "redis", redis },
  // Session rotation, CSRF, cookies — all built-in
  // DO NOT reimplement these
});
```

### Deliverables
- [ ] Better Auth activated
- [ ] API route handler updated
- [ ] Mock auth preserved as fallback
- [ ] Phase 2 PASS confirmed

---

## Phase 3: Client Migration

**Goal:** Update client components to use Better Auth hooks  
**Commit boundary:** Client-side changes only  
**Validation:** Docker smoke test + manual login test

### Deliverables
- [ ] AuthContext uses Better Auth hooks
- [ ] Login page uses signIn.email()
- [ ] Profile page uses useSession()
- [ ] Phase 3 PASS confirmed

---

## Phase 4: Redis Rate Limiting + Fallback

**Goal:** Redis-backed rate limiting with graceful fallback  
**Commit boundary:** Rate limiting config only  
**Validation:** Docker + rate limit test

### Fallback Strategy
- Redis health check on startup
- If Redis unavailable → log warning + fallback to in-memory
- Rate limiting still works, just not distributed

### Deliverables
- [ ] Redis rate limiting configured
- [ ] Fallback mechanism implemented
- [ ] Health check added
- [ ] Phase 4 PASS confirmed

---

## PASS Criteria

### RC-5 Mandatory (PASS requirement)

| # | Criterion | Validation |
|---|-----------|-----------|
| 1 | Better Auth activated | API route responds |
| 2 | PostgreSQL session storage | Session record in DB after login |
| 3 | Redis rate limiting | Rate limit headers in response |
| 4 | Email/Password auth | Sign-up + sign-in works |
| 5 | Docker smoke test | Node.js test passes |
| 6 | Migration | prisma migrate deploy succeeds |

### RC-5 Optional (does not block PASS)

| # | Criterion | Target |
|---|-----------|--------|
| 1 | OAuth providers | When credentials ready |
| 2 | Load test (1000 users) | RC-6 |
| 3 | 80%+ test coverage | RC-6 |
| 4 | Session revocation API | RC-6 |

---

## Commit History (Planned)

```
Phase 1: schema(auth): align Prisma schema with Better Auth requirements
Phase 2: feat(auth): activate Better Auth alongside mock auth
Phase 3: refactor(auth): migrate client components to Better Auth hooks
Phase 4: feat(auth): add Redis rate limiting with fallback
Phase 5: cleanup(auth): remove deprecated mock auth
```

---

## Current Focus: Phase 1

**Status:** In progress  
**Task:** Update Prisma schema for Better Auth compatibility  
**Validation:** Docker + migration test
