# RC-5 Phase 1: Docker Validation Guide

## Overview

This guide walks through the complete Phase 1 validation in Docker environment.
Run each step in order and verify the expected output.

---

## Step 0: Setup

```bash
git pull origin feature/rc3-performance
docker compose down -v
docker compose up --build -d
sleep 20

# Verify app is running
docker compose ps
curl -s http://localhost:3000/api/health | head -1
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

**Expected output:**

```
     id      | provider | providerAccountId |    access_token     |    refresh_token     |    id_token
─────────────┼──────────┼───────────────────┼─────────────────────┼──────────────────────┼───────────────────
 test-disc.. | discord  | discord-11111     | discord-access-t..  | discord-refresh-t..  |
 test-gith.. | github   | github-67890      | github-access-token | github-refresh-token |
 test-goog.. | google   | google-12345      | google-access-token | google-refresh-token | google-id-token-123
```

---

## Step 3: Run Migration

```bash
# Check migration status first
docker compose exec app npx prisma migrate status

# Apply migration (uses our RENAME COLUMN SQL)
docker compose exec app npx prisma migrate deploy
```

**Expected migrate deploy output:**

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "destiny_rising_hub"

Applying migration `20260807000000_better_auth_schema_alignment`

1 migration applied
```

**If migrate deploy fails** (e.g., due to existing migration history), use manual SQL:

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"
```

---

## Step 4: Validate Migration

### 4a. Prisma validate (post-migration)

```bash
docker compose exec app npx prisma validate
```

### 4b. Prisma migrate status (should be "already applied")

```bash
docker compose exec app npx prisma migrate status
```

**Expected:** `20260807000000_better_auth_schema_alignment (applied)`

### 4c. _prisma_migrations table

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations;'
"
```

**Expected:** Migration record exists with `finished_at` set, `rolled_back_at` NULL.

### 4d. Constraint validation script

```bash
docker compose exec app node /app/rc5-phase1-validate.js
```

**Expected:** All checks pass ✅ (data preservation test will fail here since we haven't run test data yet — that's expected in step 4e)

---

## Step 5: Data Preservation

```bash
# Run validation script (includes data preservation checks)
docker compose exec app node /app/rc5-phase1-validate.js
```

**Expected output:**

```
═══ DATA PRESERVATION VALIDATION ═══

1. Google Account:
  ✅ Google account exists
  ✅ Google accountId preserved
  ✅ Google accessToken preserved
  ✅ Google refreshToken preserved
  ✅ Google idToken preserved

2. GitHub Account:
  ✅ GitHub account exists
  ✅ GitHub accountId preserved
  ✅ GitHub accessToken preserved

3. Discord Account:
  ✅ Discord account exists
  ✅ Discord accountId preserved
  ✅ Discord accessToken preserved
```

### Alternative: Manual SQL check

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT id, \"providerId\", \"accountId\", \"accessToken\", \"refreshToken\", \"idToken\" FROM \"Account\" WHERE id LIKE '\''test-%'\'' ORDER BY id;'
"
```

---

## Step 6: Table Structure

### Account table

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c '\d \"Account\"'
"
```

**Expected columns:**
- id (PK)
- providerId, accountId (renamed)
- userId (FK → User, CASCADE)
- accessToken, refreshToken, idToken (renamed)
- accessTokenExpiresAt, refreshTokenExpiresAt, password (NEW)
- scope
- createdAt, updatedAt
- Unique: (providerId, accountId)

### Verification table

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c '\d \"Verification\"'
"
```

**Expected columns:**
- id (PK)
- identifier, value
- expiresAt
- createdAt (nullable), updatedAt (nullable)
- Indexes: identifier, expiresAt

---

## Step 7: Rollback Test

```bash
# Apply rollback
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/rollback.sql
"

# Verify Account table reverted
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c '\d \"Account\"'
"
```

**Expected:** Columns back to original names (provider, providerAccountId, etc.)

```bash
# Verify test data still intact after rollback
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'SELECT id, provider, \"providerAccountId\", access_token FROM \"Account\" WHERE id LIKE '\''test-%'\'';'
"
```

**Expected:** Original column names with preserved data.

### Re-apply migration after rollback

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql
"

# Verify data still preserved
docker compose exec app node /app/rc5-phase1-validate.js
```

---

## Step 8: Cleanup Test Data

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -c 'DELETE FROM \"Account\" WHERE id LIKE '\''test-%'\''; DELETE FROM \"User\" WHERE id = '\''test-user-001'\'';'
"
```

---

## Phase 1 PASS Checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | `prisma validate` passes | ☐ |
| 2 | `prisma migrate deploy` succeeds | ☐ |
| 3 | `prisma migrate status` shows "applied" | ☐ |
| 4 | `_prisma_migrations` record exists | ☐ |
| 5 | Better Auth schema compatibility (all 4 models) | ☐ |
| 6 | Constraint validation script passes | ☐ |
| 7 | Multi-provider data preserved (Google, GitHub, Discord) | ☐ |
| 8 | Rollback test succeeds | ☐ |
| 9 | Re-apply migration after rollback succeeds | ☐ |
| 10 | Mock auth still works after rollback | ☐ |

---

## Files Reference

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Updated schema (Account + Verification) |
| `prisma/migrations/20260807000000_better_auth_schema_alignment/migration.sql` | Safe migration (RENAME COLUMN) |
| `prisma/migrations/20260807000000_better_auth_schema_alignment/rollback.sql` | Rollback migration |
| `rc5-phase1-validate.js` | Constraint + data validation script |
| `rc5-phase1-test-data.sql` | Multi-provider test data |
| `RC5-PHASE1-SCHEMA-COMPARISON.md` | Schema diff with Better Auth official |
