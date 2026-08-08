-- ═══════════════════════════════════════════════════════════════════
-- RC-5 Phase 2B-1: Existing User Migration — ROLLBACK
-- ═══════════════════════════════════════════════════════════════════
--
-- PURPOSE:
--   Undo the existing user migration by removing ONLY the Account
--   records created by migrate.sql.
--
-- SAFETY:
--   This rollback ONLY removes Account records created by the
--   migration. Pre-existing credential Accounts are NEVER deleted.
--
-- USAGE:
--   Replace 'REPLACE_WITH_BATCH_TIMESTAMP' with the exact timestamp
--   reported by migrate.sql output:
--
--   "Batch timestamp (for rollback): 2026-08-08 20:30:45.123456"
--
--   Then run this script.
--
-- HOW IT WORKS:
--   migrate.sql inserts all records with createdAt = NOW()
--   (transaction timestamp). This timestamp is the same for ALL
--   records created in that migration run.
--
--   This rollback deletes only credential Accounts where
--   createdAt matches the batch timestamp. Pre-existing
--   credential Accounts (created before migration) have different
--   createdAt values and are preserved.
--
-- IDEMPOTENCY:
--   Running this rollback multiple times is safe. If no records
--   match the batch timestamp, nothing is deleted.
--
-- ═══════════════════════════════════════════════════════════════════

BEGIN;

-- ─── Step 1: Pre-rollback snapshot ───
DO $$
DECLARE
  v_pre_count INTEGER;
  v_to_delete INTEGER;
  v_batch_ts TIMESTAMP := 'REPLACE_WITH_BATCH_TIMESTAMP'::timestamp;
BEGIN
  SELECT COUNT(*) INTO v_pre_count
  FROM "Account"
  WHERE "providerId" = 'credential';

  SELECT COUNT(*) INTO v_to_delete
  FROM "Account"
  WHERE "providerId" = 'credential'
    AND "createdAt" = v_batch_ts;

  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'ROLLBACK: Existing User Migration';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'Batch timestamp:                %', v_batch_ts;
  RAISE NOTICE 'Total credential Accounts:      %', v_pre_count;
  RAISE NOTICE 'Accounts to delete (by batch):  %', v_to_delete;
  RAISE NOTICE 'Pre-existing Accounts preserved: %', v_pre_count - v_to_delete;
  RAISE NOTICE '═══════════════════════════════════════════';

  IF v_to_delete = 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  No records found for batch timestamp.';
    RAISE NOTICE '   Either already rolled back, or wrong timestamp.';
  END IF;
END $$;

-- ─── Step 2: Delete migration-created Accounts ───
-- ONLY deletes Accounts created by migrate.sql (matching batch timestamp)
-- Pre-existing credential Accounts are NEVER affected
DELETE FROM "Account"
WHERE "providerId" = 'credential'
  AND "createdAt" = 'REPLACE_WITH_BATCH_TIMESTAMP'::timestamp;

-- ─── Step 3: Post-rollback verification ───
DO $$
DECLARE
  v_post_count INTEGER;
  v_deleted INTEGER;
  v_batch_ts TIMESTAMP := 'REPLACE_WITH_BATCH_TIMESTAMP'::timestamp;
BEGIN
  SELECT COUNT(*) INTO v_post_count
  FROM "Account"
  WHERE "providerId" = 'credential';

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'ROLLBACK COMPLETE';
  RAISE NOTICE '═══════════════════════════════════════════';
  RAISE NOTICE 'Remaining credential Accounts: %', v_post_count;
  RAISE NOTICE '═══════════════════════════════════════════';
END $$;

COMMIT;
