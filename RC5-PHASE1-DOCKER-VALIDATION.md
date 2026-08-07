# RC-5 Phase 1: Complete Docker Validation Guide

## Prerequisites

```bash
git pull origin feature/rc3-performance
docker compose down -v
docker compose up --build -d
sleep 20
docker compose ps  # Verify all containers are running
```

---

## Step 1: Prisma Validate

```bash
docker compose exec app npx prisma validate
```

**Expected:** `The schema at prisma/schema.prisma is valid`

---

## Step 2: Insert Multi-Provider Test Data

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/rc5-phase1-test-data.sql
"
```

**Expected:** 3 test accounts inserted (Google, GitHub, Discord)

---

## Step 3: Run Migration

```bash
docker compose exec app npx prisma migrate status
docker compose exec app npx prisma migrate deploy
```

**Expected:**

```
Applying migration `20260807000000_better_auth_schema_alignment`
1 migration applied
```

### If migrate deploy fails (migration history conflict):

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"
```

---

## Step 4: Validate Everything

```bash
docker compose exec app node /app/rc5-phase1-validate.js
```

**Expected output:**

```
╔═══════════════════════════════════════════════════════╗
║  RC-5 PHASE 1: COMPLETE VALIDATION SUITE             ║
╚═══════════════════════════════════════════════════════╝

═══ BETTER AUTH: User Model Compatibility ═══
  ✅ User.email exists (required by Better Auth)
  ✅ User.emailVerified exists (required by Better Auth)
  ...
  → User model is COMPATIBLE with Better Auth via field mapping

═══ BETTER AUTH: Session Model Compatibility ═══
  ✅ Session.token has UNIQUE index
  ✅ Session.userId FK has ON DELETE CASCADE
  → Session model is an EXACT MATCH with Better Auth

═══ BETTER AUTH: Account Model Compatibility ═══
  ✅ Account.providerId exists (required by Better Auth)
  ✅ Account.accountId exists (required by Better Auth)
  ...
  → Account model is an EXACT MATCH with Better Auth

═══ BETTER AUTH: Verification Model Compatibility ═══
  ✅ Verification.createdAt is nullable (matches Better Auth)
  ✅ Verification.updatedAt is nullable (matches Better Auth)
  → Verification model is an EXACT MATCH with Better Auth

═══ ACCOUNT: Constraint Validation ═══
  ✅ Account: Primary Key on id
  ✅ Account: FK ON DELETE CASCADE
  ✅ Account: Composite UNIQUE (providerId, accountId)

═══ DATA PRESERVATION ═══
  ✅ Google accountId preserved
  ✅ GitHub refreshToken preserved
  ✅ Discord idToken preserved

═══ MIGRATION HISTORY ═══
  ✅ _prisma_migrations has records
  ✅ Migration finished_at is set
  ✅ Migration rolled_back_at is NULL

═══════════════════════════════════════════════════════════════
  TOTAL: XX passed, 0 failed
  🎉 ALL CHECKS PASSED — Phase 1 is READY
═══════════════════════════════════════════════════════════════
```

---

## Step 5: Migration Idempotency Test

```bash
# Run migration again — should succeed without errors
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"
```

**Expected:** No errors. All `IF NOT EXISTS` / `IF EXISTS` checks prevent duplicate operations.

```bash
# Re-validate after second run
docker compose exec app node /app/rc5-phase1-validate.js
```

**Expected:** Same results — all checks still pass.

---

## Step 6: _prisma_migrations Verification

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations;'
"
```

**Expected:**

```
                     migration_name                      |       finished_at       | rolled_back_at
---------------------------------------------------------+-------------------------+----------------
 20260807000000_better_auth_schema_alignment             | 2026-08-07 XX:XX:XX.XX  |
```

- `finished_at` is set ✅
- `rolled_back_at` is NULL ✅

---

## Step 7: Rollback Test

```bash
# Run rollback
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/rollback.sql
"
```

### 7a. Verify rollback

```bash
# Account table should have original columns
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c '\d \"Account\"'
"
```

**Expected:** Original columns restored (provider, providerAccountId, etc.)

### 7b. Verify data preserved after rollback

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT id, provider, \"providerAccountId\", access_token FROM \"Account\" WHERE id LIKE '\''test-%'\'';'
"
```

**Expected:** Data preserved — all tokens intact with original column names.

### 7c. Verify _prisma_migrations updated

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations;'
"
```

**Expected:** `rolled_back_at` is NOW SET (not NULL) — migration history consistent.

---

## Step 8: Re-apply Migration After Rollback

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"

# Reset the rollback flag in _prisma_migrations
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c \"UPDATE _prisma_migrations SET rolled_back_at = NULL, finished_at = NOW() WHERE migration_name = '20260807000000_better_auth_schema_alignment';\"
"

# Re-validate
docker compose exec app node /app/rc5-phase1-validate.js
```

**Expected:** All checks pass again. Data preserved.

---

## Step 9: RC-4 Smoke Test (Regression)

```bash
docker compose exec app node /app/rc4-smoke-test.js
```

**Expected:** 17/17 passed — no RC-4 features broken.

```
═══ RC-4 PRODUCTION SMOKE TEST ═══

1/5 Health check: ✅
2/5 Security headers: ✅
3/5 Login + cookie validation: ✅
4/5 CSRF: sign-out WITHOUT header → 403: ✅
5/5 CSRF: sign-out WITH header → 200: ✅

Results: 17 passed, 0 failed
```

---

## Step 10: Clean Up Test Data

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c \"DELETE FROM \\\"Account\\\" WHERE id LIKE 'test-%'; DELETE FROM \\\"User\\\" WHERE id = 'test-user-001';\"
"
```

---

## Phase 1 PASS Checklist

| # | Criterion | Command | Status |
|---|-----------|---------|--------|
| 1 | `prisma validate` passes | `npx prisma validate` | ☐ |
| 2 | `prisma migrate deploy` succeeds | `npx prisma migrate deploy` | ☐ |
| 3 | `prisma migrate status` clean | `npx prisma migrate status` | ☐ |
| 4 | `_prisma_migrations` consistent | SQL query | ☐ |
| 5 | Better Auth schema (4 models) | `node rc5-phase1-validate.js` | ☐ |
| 6 | Constraints validated | `node rc5-phase1-validate.js` | ☐ |
| 7 | Multi-provider data preserved | `node rc5-phase1-validate.js` | ☐ |
| 8 | Migration idempotent (2nd run) | Run migration.sql twice | ☐ |
| 9 | Rollback succeeds | `rollback.sql` | ☐ |
| 10 | Rollback → re-apply succeeds | migration.sql + validate | ☐ |
| 11 | `_prisma_migrations` after rollback | `rolled_back_at` set | ☐ |
| 12 | RC-4 smoke test 17/17 | `node rc4-smoke-test.js` | ☐ |

---

## Files Reference

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Better Auth compatible schema |
| `prisma/migrations/.../migration.sql` | Safe, idempotent migration |
| `prisma/migrations/.../rollback.sql` | Idempotent rollback + migration history |
| `rc5-phase1-validate.js` | Complete validation suite |
| `rc5-phase1-test-data.sql` | Multi-provider test data |
| `rc4-smoke-test.js` | RC-4 regression test |
| `RC5-PHASE1-SCHEMA-COMPARISON.md` | Schema diff documentation |
