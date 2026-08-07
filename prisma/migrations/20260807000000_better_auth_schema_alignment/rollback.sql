-- ============================================================
-- ROLLBACK: Reverse Phase 1 Better Auth Schema Alignment
-- Restores Account model to pre-Better Auth state
-- ============================================================

-- Step 1: Rename columns back to original names
ALTER TABLE "Account" RENAME COLUMN "providerId" TO "provider";
ALTER TABLE "Account" RENAME COLUMN "accountId" TO "providerAccountId";
ALTER TABLE "Account" RENAME COLUMN "refreshToken" TO "refresh_token";
ALTER TABLE "Account" RENAME COLUMN "accessToken" TO "access_token";
ALTER TABLE "Account" RENAME COLUMN "idToken" TO "id_token";

-- Step 2: Drop Better Auth columns
ALTER TABLE "Account" DROP COLUMN IF EXISTS "accessTokenExpiresAt";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "refreshTokenExpiresAt";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "password";

-- Step 3: Restore original columns
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "type" TEXT NOT NULL DEFAULT 'oauth';
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "token_type" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "session_state" TEXT;
ALTER TABLE "Account" ADD COLUMN IF NOT EXISTS "expires_at" INTEGER;

-- Step 4: Restore original unique constraint
DROP INDEX IF EXISTS "Account_providerId_accountId_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Step 5: Drop Verification table
DROP TABLE IF EXISTS "Verification";
