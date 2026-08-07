-- ============================================================
-- RC-5 Phase 1: Multi-Provider Test Data
-- Run BEFORE migration to test data preservation
-- ============================================================

-- Ensure test user exists
INSERT INTO "User" (id, email, username, "displayName", "emailVerified", "createdAt", "updatedAt")
VALUES ('test-user-001', 'test@destinyrisinghub.com', 'testuser', 'Test User', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Google Account
INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, scope, id_token, "createdAt", "updatedAt")
VALUES ('test-google-001', 'test-user-001', 'oauth', 'google', 'google-12345', 'google-refresh-token-xyz', 'google-access-token-abc', 1735689600, 'openid profile email', 'google-id-token-123', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- GitHub Account
INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, scope, id_token, "createdAt", "updatedAt")
VALUES ('test-github-001', 'test-user-001', 'oauth', 'github', 'github-67890', 'github-refresh-token-uvw', 'github-access-token-def', 1735689600, 'user:email repo', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Discord Account
INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, scope, id_token, "createdAt", "updatedAt")
VALUES ('test-discord-001', 'test-user-001', 'oauth', 'discord', 'discord-11111', 'discord-refresh-token-rst', 'discord-access-token-ghi', 1735689600, 'identify email guilds', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Verify test data was inserted
SELECT id, provider, "providerAccountId", access_token, refresh_token, id_token
FROM "Account"
WHERE id LIKE 'test-%'
ORDER BY id;
