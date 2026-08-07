-- ============================================================
-- RC-5 Phase 1: Better Auth Schema Alignment
-- SAFE, IDEMPOTENT, TRANSACTIONAL MIGRATION
-- Uses RENAME COLUMN to preserve existing data
-- Wrapped in transaction for atomic execution
-- ============================================================

BEGIN;

-- Step 1: Rename Account columns (preserve existing data)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'provider' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "provider" TO "providerId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'providerAccountId' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "providerAccountId" TO "accountId";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'refresh_token' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "refresh_token" TO "refreshToken";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'access_token' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "access_token" TO "accessToken";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Account' AND column_name = 'id_token' AND table_schema = 'public') THEN
    ALTER TABLE "Account" RENAME COLUMN "id_token" TO "idToken";
  END IF;
END $$;

-- Step 2: Drop unused Account columns
ALTER TABLE "Account" DROP COLUMN IF EXISTS "expires_at";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "session_state";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "token_type";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "type";

-- Step 3: Add new Account columns required by Better Auth
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "accessTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "refreshTokenExpiresAt" TIMESTAMP(3);
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Step 4: Update unique constraint
-- Note: RENAME COLUMN preserves associated indexes automatically,
-- but the unique constraint name references old column names.
-- We drop the old and create new to ensure correct column references.
DROP INDEX IF EXISTS "Account_provider_providerAccountId_key";
DROP INDEX IF EXISTS "Account_providerId_accountId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- Step 5: Create Verification table
CREATE TABLE IF NOT EXISTS "Verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- Step 6: Create indexes for Verification table
CREATE INDEX IF NOT EXISTS "Verification_identifier_idx" ON "Verification"("identifier");
CREATE INDEX IF NOT EXISTS "Verification_expiresAt_idx" ON "Verification"("expiresAt");

COMMIT;
