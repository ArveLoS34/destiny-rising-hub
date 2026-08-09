-- ═══════════════════════════════════════════════════════════════════
-- RC-5 Phase 2B-1: Existing User Migration Script
-- ═══════════════════════════════════════════════════════════════════
--
-- PURPOSE:
--   Copy User.passwordHash → Account.password for existing users
--   who were created by mock auth but have no Better Auth Account.
--
-- PRECONDITIONS:
--   1. PostgreSQL database is accessible
--   2. "User" table exists with "passwordHash" column
--   3. "Account" table exists with columns: id, "accountId",
--      "providerId", "userId", password, "createdAt", "updatedAt"
--   4. No schema changes required (frozen schema)
--
-- IDEMPOTENCY:
--   This script is fully idempotent. Running it multiple times
--   will NOT create duplicate records. The WHERE NOT EXISTS
--   clause ensures only users WITHOUT a credential Account
--   are processed.
--
-- EXISTING ACCOUNT HANDLING:
--   Credential Account records that existed BEFORE this migration
--   are NEVER touched. Only users who have passwordHash but NO
--   credential Account will get new Account records.
--
-- DEMO USER HANDLING:
--   The demo user (guardian@destinyrisinghub.com) has passwordHash
--   set by mock auth. If it has no credential Account, it will
--   be migrated like any other user. If it already has one, it
--   will be skipped (idempotent).
--
-- ID GENERATION:
--   Uses gen_random_uuid()::text for Account.id.
--   This is a PostgreSQL 13+ built-in function.
--   Docker uses PostgreSQL 16-alpine which supports this.
--   Format: UUID string (36 chars with hyphens)
--   Account.id is String type — accepts any unique string.
--
-- ROLLBACK:
--   See rollback.sql in the same directory.
--   Uses transaction timestamp as batch marker.
--
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─── Step 1: Pre-migration snapshot ───
-- Count existing credential Accounts (before migration)
DO $$
DECLARE
  v_pre_count INTEGER;
  v_candidates INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_pre_count
  FROM "Account"
  WHERE "providerId" = 'credential';

  SELECT COUNT(*) INTO v_candidates
  FROM "User" u
  WHERE u."passwordHash" IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM "Account" a
      WHERE a."userId" = u.id AND a."providerId" = 'credential'
    );

  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'MIGRATION: Existing User → Account';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'Pre-existing credential Accounts: %', v_pre_count;
  RAISE NOTICE 'Users eligible for migration:     %', v_candidates;
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;

-- ─── Step 2: Migrate ───
-- Insert Account records for Users who have passwordHash
-- but no credential Account.
--
-- Key design decisions:
--   - accountId = User.id (Better Auth convention for credentials)
--   - providerId = 'credential' (Better Auth convention)
--   - password = User."passwordHash" (direct copy, no re-hash)
--   - createdAt = NOW() (transaction timestamp, used as batch marker)
--   - WHERE NOT EXISTS ensures idempotency
--
INSERT INTO "Account" (
  id,
  "accountId",
  "providerId",
  "userId",
  password,
  "createdAt",
  "updatedAt"
)
SELECT
  gen_random_uuid()::text,    -- id: unique UUID
  u.id,                        -- accountId: references User.id
  'credential',                -- providerId: credential provider
  u.id,                        -- userId: references User.id
  u."passwordHash",            -- password: copied from User (already hashed)
  NOW(),                       -- createdAt: transaction timestamp (batch marker)
  NOW()                        -- updatedAt: same as createdAt
FROM "User" u
WHERE u."passwordHash" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "Account" a
    WHERE a."userId" = u.id
      AND a."providerId" = 'credential'
  );

-- ─── Step 3: Post-migration verification ───
DO $$
DECLARE
  v_post_count INTEGER;
  v_created INTEGER;
  v_batch_ts TIMESTAMP;
BEGIN
  -- Get the transaction timestamp (same for all rows inserted above)
  v_batch_ts := NOW();

  SELECT COUNT(*) INTO v_post_count
  FROM "Account"
  WHERE "providerId" = 'credential';

  -- Count records created in THIS transaction (same createdAt)
  SELECT COUNT(*) INTO v_created
  FROM "Account"
  WHERE "providerId" = 'credential'
    AND "createdAt" = v_batch_ts;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'MIGRATION COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'Total credential Accounts:    %', v_post_count;
  RAISE NOTICE 'Accounts created by this run: %', v_created;
  RAISE NOTICE 'Batch timestamp (for rollback): %', v_batch_ts;
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  SAVE THIS TIMESTAMP FOR ROLLBACK:';
  RAISE NOTICE '   %', v_batch_ts;
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;

-- ─── Step 4: Verification queries ───
-- Uncomment to run verification checks:

-- Show all migrated users (Users with passwordHash and credential Account)
-- SELECT
--   u.id AS user_id,
--   u.email,
--   u.username,
--   u."displayName",
--   a.id AS account_id,
--   a."createdAt" AS account_created,
--   CASE WHEN a.password IS NOT NULL THEN true ELSE false END AS has_password
-- FROM "User" u
-- JOIN "Account" a ON a."userId" = u.id AND a."providerId" = 'credential'
-- WHERE u."passwordHash" IS NOT NULL
-- ORDER BY a."createdAt" DESC;

-- Verify no Users with passwordHash are missing credential Account
-- SELECT u.id, u.email, u.username
-- FROM "User" u
-- WHERE u."passwordHash" IS NOT NULL
--   AND NOT EXISTS (
--     SELECT 1 FROM "Account" a
--     WHERE a."userId" = u.id AND a."providerId" = 'credential'
--   );
-- Expected result: 0 rows (all users with passwordHash have credential Account)

COMMIT;
