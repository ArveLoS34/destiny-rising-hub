# RC-5 Phase 1: Data Preservation Test Procedure

Bu test, migration'ın RENAME COLUMN komutuyla verileri koruduğunu doğrular.

## Test Akışı

```
1. Temiz DB
   ↓
2. İlk migration uygula (legacy Account şeması)
   ↓
3. Legacy kolonlara test verisi ekle
   (provider, providerAccountId, access_token, vb.)
   ↓
4. Migration öncesi değerleri kaydet
   ↓
5. İkinci migration uygula (RENAME COLUMN)
   ↓
6. Yeni kolonlarda değerleri kontrol et
   (providerId, accountId, accessToken, vb.)
   ↓
7. Birebir eşleşme doğrulaması
   ↓
8. Composite UNIQUE + migration history kontrolü
   ↓
9. npm run rc5:phase1:verify
```

## Docker Komutları

### Adım 1: Temiz başlangıç

```bash
docker compose down -v
docker compose up -d
sleep 15
```

### Adım 2: İlk migration'ı uygula

```bash
# İlk migration SQL'ini manuel uygula
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub \
    -f /app/prisma/migrations/00000000000000_initial_schema/migration.sql
"

# Prisma'ya bildir
docker compose exec app npx prisma migrate resolve \
  --applied 00000000000000_initial_schema
```

### Adım 3: Legacy kolonlara test verisi ekle

```bash
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub <<'EOF'
-- Test user ekle
INSERT INTO \"User\" (id, email, username, \"displayName\", \"emailVerified\", \"createdAt\", \"updatedAt\")
VALUES ('test-user-001', 'test@example.com', 'testuser', 'Test User', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Google account (ESKİ kolon isimleri)
INSERT INTO \"Account\" (id, \"userId\", type, provider, \"providerAccountId\", refresh_token, access_token, expires_at, scope, \"id_token\", \"createdAt\", \"updatedAt\")
VALUES ('test-google-001', 'test-user-001', 'oauth', 'google', 'google-12345', 'google-refresh-token-xyz', 'google-access-token-abc', 1735689600, 'email profile', 'google-id-token-123', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- GitHub account (ESKİ kolon isimleri)
INSERT INTO \"Account\" (id, \"userId\", type, provider, \"providerAccountId\", refresh_token, access_token, expires_at, scope, \"createdAt\", \"updatedAt\")
VALUES ('test-github-001', 'test-user-001', 'oauth', 'github', 'github-67890', 'github-refresh-token-uvw', 'github-access-token-def', 1735689600, 'user:email', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Discord account (ESKİ kolon isimleri)
INSERT INTO \"Account\" (id, \"userId\", type, provider, \"providerAccountId\", refresh_token, access_token, expires_at, scope, \"createdAt\", \"updatedAt\")
VALUES ('test-discord-001', 'test-user-001', 'oauth', 'discord', 'discord-11111', 'discord-refresh-token-rst', 'discord-access-token-ghi', 1735689600, 'identify', NOW(), NOW())
ON CONFLICT DO NOTHING;
EOF
"
```

### Adım 4: Migration öncesi değerleri kaydet

```bash
echo "=== MIGRATION ÖNCESİ VERİLER (Legacy Kolonlar) ==="
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -c \"
    SELECT 
      id,
      provider,
      \\\"providerAccountId\\\",
      access_token,
      refresh_token,
      id_token
    FROM \\\"Account\\\"
    WHERE id LIKE 'test-%'
    ORDER BY id
  \"
"
```

**Beklenen çıktı:**
```
      id       | provider | providerAccountId |   access_token    |   refresh_token    |    id_token
---------------+----------+-------------------+-------------------+--------------------+-------------------
 test-discord- | discord  | discord-11111     | discord-access... | discord-refresh... |
 test-github-0 | github   | github-67890      | github-access-t...| github-refresh-to...|
 test-google-0 | google   | google-12345      | google-access-t...| google-refresh-to...| google-id-token-123
```

### Adım 5: İkinci migration'ı uygula (RENAME COLUMN)

```bash
docker compose exec app npx prisma migrate deploy
```

**Beklenen çıktı:**
```
Applying migration `20260807000000_better_auth_schema_alignment`
Successfully applied 1 migration.
```

### Adım 6: Yeni kolonlarda değerleri kontrol et

```bash
echo "=== MIGRATION SONRASI VERİLER (Yeni Kolonlar) ==="
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -c \"
    SELECT 
      id,
      \\\"providerId\\\",
      \\\"accountId\\\",
      \\\"accessToken\\\",
      \\\"refreshToken\\\",
      \\\"idToken\\\"
    FROM \\\"Account\\\"
    WHERE id LIKE 'test-%'
    ORDER BY id
  \"
"
```

**Beklenen çıktı:**
```
      id       | providerId |  accountId   |    accessToken    |    refreshToken    |      idToken
---------------+------------+--------------+-------------------+--------------------+-------------------
 test-discord- | discord    | discord-11111| discord-access... | discord-refresh... |
 test-github-0 | github     | github-67890 | github-access-t...| github-refresh-to...|
 test-google-0 | google     | google-12345 | google-access-t...| google-refresh-to...| google-id-token-123
```

### Adım 7: Birebir eşleşme doğrulaması

```bash
echo "=== VERİ KORUMA DOĞRULAMASI ==="
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub <<'EOF'
-- Google account kontrolü
SELECT 
  'Google' as provider,
  CASE 
    WHEN \\\"providerId\\\" = 'google' 
    AND \\\"accountId\\\" = 'google-12345' 
    AND \\\"accessToken\\\" = 'google-access-token-abc'
    AND \\\"refreshToken\\\" = 'google-refresh-token-xyz'
    AND \\\"idToken\\\" = 'google-id-token-123'
    THEN '✅ PASS: Tüm değerler korundu'
    ELSE '❌ FAIL: Veri kaybı var'
  END as result
FROM \\\"Account\\\" WHERE id = 'test-google-001';

-- GitHub account kontrolü
SELECT 
  'GitHub' as provider,
  CASE 
    WHEN \\\"providerId\\\" = 'github' 
    AND \\\"accountId\\\" = 'github-67890' 
    AND \\\"accessToken\\\" = 'github-access-token-def'
    AND \\\"refreshToken\\\" = 'github-refresh-token-uvw'
    THEN '✅ PASS: Tüm değerler korundu'
    ELSE '❌ FAIL: Veri kaybı var'
  END as result
FROM \\\"Account\\\" WHERE id = 'test-github-001';

-- Discord account kontrolü
SELECT 
  'Discord' as provider,
  CASE 
    WHEN \\\"providerId\\\" = 'discord' 
    AND \\\"accountId\\\" = 'discord-11111' 
    AND \\\"accessToken\\\" = 'discord-access-token-ghi'
    AND \\\"refreshToken\\\" = 'discord-refresh-token-rst'
    THEN '✅ PASS: Tüm değerler korundu'
    ELSE '❌ FAIL: Veri kaybı var'
  END as result
FROM \\\"Account\\\" WHERE id = 'test-discord-001';
EOF
"
```

**Beklenen çıktı:**
```
 provider |          result
----------+---------------------------
 Google   | ✅ PASS: Tüm değerler korundu
 GitHub   | ✅ PASS: Tüm değerler korundu
 Discord  | ✅ PASS: Tüm değerler korundu
```

### Adım 8: Composite UNIQUE + migration history kontrolü

```bash
echo "=== CONSTRAINT + MIGRATION HISTORY KONTROLÜ ==="
docker compose exec app sh -c "
  PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub <<'EOF'
-- Composite unique constraint kontrolü
SELECT 
  'Composite UNIQUE' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE table_name = 'Account' 
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'Account_providerId_accountId_key'
    )
    THEN '✅ PASS: Constraint var'
    ELSE '❌ FAIL: Constraint yok'
  END as result;

-- Migration history kontrolü
SELECT 
  'Migration History' as test,
  CASE 
    WHEN COUNT(*) = 2 
    AND MAX(CASE WHEN migration_name = '00000000000000_initial_schema' THEN finished_at END) IS NOT NULL
    AND MAX(CASE WHEN migration_name = '20260807000000_better_auth_schema_alignment' THEN finished_at END) IS NOT NULL
    THEN '✅ PASS: 2 migration applied'
    ELSE '❌ FAIL: Migration history sorunlu'
  END as result
FROM _prisma_migrations;

-- Verification tablosu kontrolü
SELECT 
  'Verification Table' as test,
  CASE 
    WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Verification')
    THEN '✅ PASS: Tablo var'
    ELSE '❌ FAIL: Tablo yok'
  END as result;
EOF
"
```

**Beklenen çıktı:**
```
        test         |           result
---------------------+----------------------------
 Composite UNIQUE    | ✅ PASS: Constraint var
 Migration History   | ✅ PASS: 2 migration applied
 Verification Table  | ✅ PASS: Tablo var
```

### Adım 9: Full validation

```bash
docker compose exec app npm run rc5:phase1:verify
```

**Beklenen sonuç:**
```
TOTAL: 66 passed, 0 failed
OVERALL: PASS
Exit code: 0
```

## Başarı Kriterleri

| Test | Beklenen Sonuç |
|------|----------------|
| Migration öncesi veri ekleme | ✅ 3 account eklendi |
| Migration sonrası veri kontrolü | ✅ 3 account yeni kolonlarda |
| Google veri koruması | ✅ providerId, accountId, accessToken, refreshToken, idToken korundu |
| GitHub veri koruması | ✅ providerId, accountId, accessToken, refreshToken korundu |
| Discord veri koruması | ✅ providerId, accountId, accessToken, refreshToken korundu |
| Composite UNIQUE constraint | ✅ `Account_providerId_accountId_key` var |
| Migration history | ✅ 2 migration applied |
| Verification tablosu | ✅ Tablo var |
| Full validation | ✅ 66/66 PASS |
| Exit code | ✅ 0 |

## Test Sonucu Özeti

Bu test şunları kanıtlar:
1. ✅ Migration chain düzgün çalışıyor (initial → alignment)
2. ✅ RENAME COLUMN verileri birebir koruyor
3. ✅ Composite UNIQUE constraint düzgün oluşturuluyor
4. ✅ Migration history temiz
5. ✅ Verification tablosu oluşuyor
6. ✅ Prisma validation PASS
7. ✅ RC-4 smoke test PASS

**Bu testten sonra Phase 1 PASS ilan edilebilir ve schema freeze kararı verilebilir.**
