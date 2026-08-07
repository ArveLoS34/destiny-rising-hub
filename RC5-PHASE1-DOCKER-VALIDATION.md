# RC-5 Phase 1: Complete Docker Validation Guide

## Principles

- **`prisma migrate deploy`** is the primary migration flow
- Manual SQL is **fallback only** (recovery/manual repair)
- Both scripts return proper **exit codes** for CI/CD integration
- Validation output includes **machine-readable JSON summary**

---

## Prerequisites

```bash
git pull origin feature/rc3-performance
docker compose down -v
docker compose up --build -d
sleep 20
docker compose ps
```

---

## Step 1: Prisma Validate

```bash
docker compose exec app npx prisma validate
echo "Exit code: $?"
```

**Expected:** Exit code `0`, output: `The schema is valid`

---

## Step 2: Insert Multi-Provider Test Data

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/rc5-phase1-test-data.sql
"
```

---

## Step 3: Migration (Primary Flow: prisma migrate deploy)

```bash
# Check status first
docker compose exec app npx prisma migrate status

# Apply migration via Prisma's official flow
docker compose exec app npx prisma migrate deploy
echo "Exit code: $?"

# Verify status after
docker compose exec app npx prisma migrate status
```

**Expected:** Exit code `0`, migration applied, status shows "applied"

### Fallback (only if migrate deploy fails):

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"
```

---

## Step 4: Full Validation

```bash
docker compose exec app node /app/rc5-phase1-validate.js
echo "Exit code: $?"
```

**Expected:** Exit code `0`

**Expected JSON output:**

```json
{
  "overall": "PASS",
  "passed": 42,
  "failed": 0,
  "sections": {
    "BETTER AUTH: User Model Compatibility": "PASS",
    "BETTER AUTH: Session Model Compatibility": "PASS",
    "BETTER AUTH: Account Model Compatibility": "PASS",
    "BETTER AUTH: Verification Model Compatibility": "PASS",
    "ACCOUNT: Constraint Validation": "PASS",
    "DATA PRESERVATION: Multi-Provider Test": "PASS",
    "MIGRATION HISTORY: Prisma Consistency": "PASS"
  },
  "timestamp": "2026-08-07T..."
}
```

---

## Step 5: Idempotency Test

```bash
# Run migration SQL again (idempotent)
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"
echo "Exit code: $?"

# Re-validate
docker compose exec app node /app/rc5-phase1-validate.js
echo "Exit code: $?"
```

**Expected:** Both exit code `0` — no errors, all checks still pass.

---

## Step 6: _prisma_migrations Verification

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations;'
"
```

**Expected:** `finished_at` is SET, `rolled_back_at` is NULL.

---

## Step 7: Rollback Test

```bash
# Rollback
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/rollback.sql
"
echo "Exit code: $?"
```

### 7a. Verify rollback

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c '\d \"Account\"'
"
```

**Expected:** Original columns restored (provider, providerAccountId, etc.)

### 7b. Verify data preserved

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT id, provider, \"providerAccountId\", access_token FROM \"Account\" WHERE id LIKE '\''test-%'\'';'
"
```

### 7c. Verify _prisma_migrations

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations;'
"
```

**Expected:** `rolled_back_at` is SET.

---

## Step 8: Re-apply After Rollback (Primary Flow: prisma migrate deploy)

```bash
# Re-apply via Prisma's official flow
docker compose exec app npx prisma migrate deploy
echo "Exit code: $?"

# Verify
docker compose exec app npx prisma migrate status

# Full validation
docker compose exec app node /app/rc5-phase1-validate.js
echo "Exit code: $?"
```

**Expected:** All exit code `0`. If `migrate deploy` reports the migration is already applied (because rollback.sql didn't remove the _prisma_migrations record), use:

```bash
# Mark migration as rolled back, then re-deploy
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c \"DELETE FROM _prisma_migrations WHERE migration_name = '20260807000000_better_auth_schema_alignment';\"
"
docker compose exec app npx prisma migrate deploy
```

---

## Step 9: RC-4 Regression Test

```bash
docker compose exec app node /app/rc4-smoke-test.js
echo "Exit code: $?"
```

**Expected:** Exit code `0`, 17/17 passed

**Expected JSON output:**

```json
{
  "overall": "PASS",
  "passed": 17,
  "failed": 0,
  "timestamp": "2026-08-07T..."
}
```

---

## Step 10: Cleanup

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c \"DELETE FROM \\\"Account\\\" WHERE id LIKE 'test-%'; DELETE FROM \\\"User\\\" WHERE id = 'test-user-001';\"
"
```

---

## Phase 1 PASS Checklist

| # | Criterion | Expected Exit Code | Status |
|---|-----------|--------------------|--------|
| 1 | `prisma validate` | 0 | ☐ |
| 2 | `prisma migrate deploy` | 0 | ☐ |
| 3 | `prisma migrate status` | Clean | ☐ |
| 4 | `_prisma_migrations` consistent | Applied | ☐ |
| 5 | Better Auth schema (4 models) | 0 | ☐ |
| 6 | Constraints validated | 0 | ☐ |
| 7 | Multi-provider data preserved | 0 | ☐ |
| 8 | Migration idempotent (2nd run) | 0 | ☐ |
| 9 | Rollback succeeds | 0 | ☐ |
| 10 | Rollback → `migrate deploy` | 0 | ☐ |
| 11 | `_prisma_migrations` after rollback | rolled_back_at set | ☐ |
| 12 | RC-4 smoke test 17/17 | 0 | ☐ |

---

## CI/CD Integration

Both scripts are designed for pipeline integration:

```bash
# In CI/CD pipeline:
docker compose exec -T app node /app/rc5-phase1-validate.js
if [ $? -ne 0 ]; then
  echo "Phase 1 validation FAILED"
  exit 1
fi

docker compose exec -T app node /app/rc4-smoke-test.js
if [ $? -ne 0 ]; then
  echo "RC-4 regression FAILED"
  exit 1
fi

echo "All validations PASSED"
```

JSON summaries can be parsed for reporting:

```bash
# Extract JSON summary from output
docker compose exec -T app node /app/rc5-phase1-validate.js | \
  sed -n '/JSON_SUMMARY_START/,/JSON_SUMMARY_END/p' | \
  grep -v JSON_SUMMARY | \
  jq '.overall'
```
