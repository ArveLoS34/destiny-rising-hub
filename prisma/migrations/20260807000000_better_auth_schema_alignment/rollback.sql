-- ============================================================
-- ROLLBACK: Reverse Phase 1 Better Auth Schema Alignment
-- IDEMPOTENT — Safe to run multiple times
-- Also updates _prisma_migrations for Prisma history consistency
-- ============================================================

-- Step 1: Rename columns back to original names (idempotent)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'providerId' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "providerId" TO "provider";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'accountId' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "accountId" TO "providerAccountId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'refreshToken' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "refreshToken" TO "refresh_token";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'accessToken' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "accessToken" TO "access_token";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'idToken' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "idToken" TO "id_token";
  END IF;
END $$;

-- Step 2: Drop Better Auth columns
ALTER TABLE "Account" DROP COLUMN IF EXISTS "accessTokenExpiresAt";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "refreshTokenExpiresAt";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "password";

-- Step 3: Restore original columns (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'type' AND table_schema = 'public') THEN
    ALTER TABLE "Account" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'oauth';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'token_type' AND table_schema = 'public') THEN
    ALTER TABLE "Account" ADD COLUMN "token_type" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'session_state' AND table_schema = 'public') THEN
    ALTER TABLE "Account" ADD COLUMN "session_state" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'expires_at' AND table_schema = 'public') THEN
    ALTER TABLE "Account" ADD COLUMN "expires_at" INTEGER;
  END IF;
END $$;

-- Step 4: Restore original unique constraint (idempotent)
DROP INDEX IF EXISTS "Account_providerId_accountId_key";
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'Account' AND indexname = 'Account_provider_providerAccountId_key') THEN
    CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
  END IF;
END $$;

-- Step 5: Drop Verification table
DROP TABLE IF EXISTS "Verification";

-- Step 6: Update _prisma_migrations — mark as rolled back
-- This keeps Prisma migration history consistent
UPDATE _prisma_migrations
SET rolled_back_at = NOW()
WHERE migration_name = '20260807000000_better_auth_schema_alignment'
  AND rolled_back_at IS NULL;
