# RC-5 Phase 2B-4 — POC Cleanup Pre-Implementation Review

**Date:** 2026-08-09  
**Status:** Review complete — awaiting approval  
**Scope:** POC file cleanup, production hardening  
**Constraints:** Schema freeze, no Prisma migration

---

## Analysis Summary

All POC files analyzed for production dependencies. **No production code imports or references POC files.** All POC files can be safely removed.

---

## File-by-File Analysis

### 1. `src/lib/auth/better-auth-poc.ts`

**Status:** ✅ CAN BE REMOVED

**References:**
```
src/app/api/auth-test/[[...all]]/route.ts:9
  import { auth } from "@/lib/auth/better-auth-poc"
```

**Production dependency:** NONE  
**Only referenced by:** POC test route (also being removed)  
**Risk:** NONE  
**Rollback:** Git revert  
**Test plan:** Production auth lifecycle test (already passed in Phase 2B-3)

---

### 2. `src/app/api/auth-test/[[...all]]/route.ts`

**Status:** ✅ CAN BE REMOVED

**References:** NONE in production code  
**Production dependency:** NONE  
**Only referenced by:** Nothing (standalone POC route)  
**Risk:** NONE  
**Rollback:** Git revert  
**Test plan:** Production auth lifecycle test (already passed in Phase 2B-3)

---

### 3. `src/features/user/services/auth-service.ts` (Mock Auth)

**Status:** ✅ CAN BE REMOVED

**References:**
```
src/app/api/auth/[[...all]]/route.ts:17
  *   src/features/user/services/auth-service.ts (deprecated)
```

**Production dependency:** NONE (only in comment)  
**Imported by:** NO ONE (production route uses Better Auth)  
**Risk:** NONE  
**Rollback:** Git revert  
**Test plan:** Production auth lifecycle test (already passed in Phase 2B-3)

**Note:** This file contains the old mock auth implementation. Production route (`src/app/api/auth/[[...all]]/route.ts`) now uses Better Auth via `src/lib/auth/index.ts`. Mock auth is no longer used.

---

### 4. `scripts/test-better-auth-poc.js`

**Status:** ✅ CAN BE REMOVED

**References:** Only in documentation (RC5-*.md reports)  
**Production dependency:** NONE  
**Runtime dependency:** NONE  
**Risk:** NONE  
**Rollback:** Git revert  
**Test plan:** N/A (test script, not production code)

---

### 5. `scripts/phase2b3-runtime-test.ps1`

**Status:** ✅ CAN BE REMOVED

**References:** NONE  
**Production dependency:** NONE  
**Runtime dependency:** NONE  
**Risk:** NONE  
**Rollback:** Git revert  
**Test plan:** N/A (test script, not production code)

---

### 6. `scripts/data-migrations/existing-user-migration/`

**Status:** ⚠️ DISCUSS (keep or remove)

**Contents:**
```
scripts/data-migrations/existing-user-migration/
├── migrate.sql      (idempotent migration script)
├── rollback.sql     (batch-safe rollback)
└── README.md        (documentation)
```

**Production dependency:** NONE  
**Runtime dependency:** NONE  
**Status:** NO-OP (no migration candidates in current DB)  
**Risk if removed:** Lose future migration tool  
**Risk if kept:** Dead code in repository  

**Recommendation:** 
- **Option A:** Remove (current DB has no migration candidates, Better Auth creates Account records automatically for new users)
- **Option B:** Keep as reference implementation for future data migrations

**Rollback:** Git revert (if removed)  
**Test plan:** N/A (data migration script, not runtime code)

---

### 7. RC5-*.md Documentation Files (12 files)

**Status:** ✅ KEEP (documentation)

**Files:**
```
RC5-DATA-PRESERVATION-TEST.md
RC5-P3005-FIX.md
RC5-PHASE1-COMPLETION-REPORT.md
RC5-PHASE1-DOCKER-VALIDATION.md
RC5-PHASE1-FINAL-VERIFICATION.md
RC5-PHASE1-SCHEMA-COMPARISON.md
RC5-PHASE2-AUTH-AUDIT.md
RC5-PHASE2A-COMPATIBILITY-REPORT.md
RC5-PHASE2A-POC-RCA-REPORT.md
RC5-PHASE2B-PRODUCTION-MIGRATION-PLAN.md
RC5-PHASE2B3-RESEARCH-FINDINGS.md
RC5-TECHNICAL-PLAN.md
```

**Production dependency:** NONE  
**Purpose:** Historical documentation, audit trail  
**Risk if removed:** Lose audit trail  
**Recommendation:** KEEP (documentation has value for future reference)

---

## Production Route After Cleanup

After POC cleanup, production auth flow will be:

```
Client request
    ↓
/api/auth/* (Next.js route)
    ↓
src/app/api/auth/[[...all]]/route.ts
    ↓
import { auth } from "@/lib/auth"
    ↓
src/lib/auth/index.ts (Better Auth config)
    ↓
Better Auth instance
    ↓
PostgreSQL (via Prisma adapter)
Redis (via @better-auth/redis-storage)
```

**Files remaining after cleanup:**
- `src/lib/auth/index.ts` — Production Better Auth config ✅
- `src/lib/auth/client.ts` — Better Auth React client ✅
- `src/lib/auth/auth-context.tsx` — useAuth() hook ✅
- `src/app/api/auth/[[...all]]/route.ts` — Production route ✅

**Files removed:**
- `src/lib/auth/better-auth-poc.ts` — POC config ❌
- `src/app/api/auth-test/[[...all]]/route.ts` — POC route ❌
- `src/features/user/services/auth-service.ts` — Mock auth ❌
- `scripts/test-better-auth-poc.js` — POC test script ❌
- `scripts/phase2b3-runtime-test.ps1` — Runtime test script ❌

---

## Rollback Plan

If cleanup causes issues:

```bash
git revert <commit-hash>
```

All POC files can be restored from Git history. No production code is affected.

---

## Test Plan

After cleanup, verify:

1. **Build:** `npm run build` — should succeed
2. **Type check:** No TypeScript errors
3. **Auth lifecycle:** Sign-up → Sign-in → Get-session → Sign-out (already passed in Phase 2B-3)
4. **Redis rate limiting:** Already validated in Phase 2B-3
5. **PostgreSQL persistence:** Already validated in Phase 2B-3
6. **Cookie contract:** Already validated in Phase 2B-3

**No new tests needed** — Phase 2B-3 runtime tests already validated production behavior.

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Production code references POC | 0% | N/A | Verified — no references |
| Build fails after cleanup | 0% | N/A | POC files not imported by production |
| Auth breaks after cleanup | 0% | N/A | Production route uses Better Auth, not POC |
| Need POC for debugging | Low | Low | Git revert available |

**Overall risk:** NONE

---

## Recommendation

### Files to Remove (5 files):

```bash
# POC code
rm src/lib/auth/better-auth-poc.ts
rm src/app/api/auth-test/[[...all]]/route.ts
rm src/features/user/services/auth-service.ts

# POC test scripts
rm scripts/test-better-auth-poc.js
rm scripts/phase2b3-runtime-test.ps1

# Remove empty directory
rmdir src/app/api/auth-test/[[...all]] 2>/dev/null || true
rmdir src/app/api/auth-test 2>/dev/null || true
```

### Files to Keep (documentation):

All RC5-*.md files (12 files) — historical documentation.

### Decision Needed:

`scripts/data-migrations/existing-user-migration/` — Keep or remove?

**My recommendation:** Remove (NO-OP, Better Auth handles new users automatically, can be recreated if needed).

---

## Implementation Steps (Pending Approval)

1. Remove POC code files (3 files)
2. Remove POC test scripts (2 files)
3. Remove data migration scripts (1 directory, 3 files)
4. Update production route comment (remove "deprecated" reference)
5. Commit: `cleanup(rc5): remove POC files after production migration`
6. Push to `feature/rc3-performance`
7. Verify: `npm run build` + Docker runtime test

---

## Awaiting Approval

**Decision needed:**
1. ✅ Approve POC file removal (5 code files + 1 migration directory)?
2. ⚠️ Keep or remove `scripts/data-migrations/`?
3. ✅ Keep RC5-*.md documentation?

After approval, I will:
- Remove approved files
- Commit and push
- Provide verification steps

---

**Review complete. Awaiting your decision.**
