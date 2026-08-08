# RC-5 Phase 2B-1: Existing User Migration

## ⚠️ ÖNEMLİ — Bu Dosyalar Prisma Migration Değildir

- **Bu dosyalar Prisma migration chain'inin parçası DEĞİLDİR.**
- **`prisma migrate deploy` tarafından otomatik çalıştırılmazlar.**
- **Manuel data migration script'leridir.**
- **Doğrudan `psql` üzerinden çalıştırılmalıdır.**
- **Migration schema değiştirmez.**

## Ne Yapar

- Existing `User."passwordHash"` → `Account."password"` aktarımı yapar
- Mock auth tarafından oluşturulmuş kullanıcıları Better Auth credential account'a taşır
- Migration **idempotenttir** — birden fazla kez çalıştırılabilir, duplicate oluşturmaz
- Rollback **yalnızca ilgili migration batch'inin** oluşturduğu Account kayıtlarını hedefler
- Migration ÖNCESİ mevcut credential Account kayıtları ASLA silinmez

## Dosyalar

| Dosya | Amaç |
|-------|------|
| `migrate.sql` | Migration script (idempotent, transaction-safe) |
| `rollback.sql` | Rollback script (batch-safe, timestamp-based) |
| `README.md` | Bu dosya |

---

## Çalıştırma (Windows PowerShell)

### 1. Migration

```powershell
Get-Content scripts/data-migrations/existing-user-migration/migrate.sql -Raw | docker compose exec -T postgres psql -U destiny_user -d destiny_rising_hub
```

**ÖNEMLİ:** Çıktıda batch timestamp'ini kaydedin:

```
⚠️  SAVE THIS TIMESTAMP FOR ROLLBACK:
   2026-08-08 20:30:45.123456
```

### 2. Doğrulama

```powershell
# passwordHash'i olan tüm kullanıcıların credential Account'u olmalı
# Beklenen sonuç: 0 satır
docker compose exec postgres psql -U destiny_user -d destiny_rising_hub -c "SELECT u.id, u.email, u.username FROM `"User`" u WHERE u.`"passwordHash`" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM `"Account`" a WHERE a.`"userId`" = u.id AND a.`"providerId`" = 'credential');"
```

### 3. Rollback (gerekirse)

`rollback.sql` içindeki `REPLACE_WITH_BATCH_TIMESTAMP` değerini, migration çıktısında kaydedilen timestamp ile değiştirin, sonra:

```powershell
Get-Content scripts/data-migrations/existing-user-migration/rollback.sql -Raw | docker compose exec -T postgres psql -U destiny_user -d destiny_rising_hub
```

---

## Güvenlik Garantileri

| Garanti | Açıklama |
|---------|----------|
| ✅ **Idempotent** | Birden fazla çalıştırma duplicate oluşturmaz |
| ✅ **Batch-safe** | Rollback sadece ilgili batch'i siler |
| ✅ **Pre-existing preserved** | Migration öncesi credential Account'lar ASLA silinmez |
| ✅ **No schema changes** | Frozen schema değişmez |
| ✅ **No re-hashing** | passwordHash doğrudan kopyalanır (zaten bcrypt hash'li) |

## Demo Kullanıcı

Demo kullanıcı (`guardian@destinyrisinghub.com`) otomatik olarak işlenir. Eğer `passwordHash`'i var ama credential Account'u yoksa migrate edilir. Zaten credential Account'u varsa atlanır (idempotent).
