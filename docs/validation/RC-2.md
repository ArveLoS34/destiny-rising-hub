# RC-2: Database Validation

## Objective

Prisma migration gerçek PostgreSQL üzerinde uygulanıyor mu? Seed data başarıyla yükleniyor mu?
Repository operasyonları gerçek DB üzerinde çalışıyor mu? Integration testler geçiyor mu?

## Environment

- **PostgreSQL:** 16 Alpine (Docker)
- **Prisma:** 7.9.1
- **Tarih:** [Doğrulama tarihi]

## Prerequisites

- ✅ RC-1 PASS (Infrastructure doğrulandı)
- Docker Compose çalışıyor

## Commands

### 1. Migration

```bash
# Schema doğrulama
npx prisma validate

# Migration apply
npx prisma migrate deploy

# Alternatif (development)
npx prisma db push
```

### 2. Seed

```bash
# Seed data yükle
npm run db:seed

# Karakter sayısını doğrula
docker compose exec postgres psql -U destiny_user -d destiny_rising_hub -c "SELECT COUNT(*) FROM \"Character\";"
```

### 3. Integration Tests

```bash
# Tüm testler
npm test

# Sadece character repository testleri
npm test -- --testPathPattern=character-repository

# Sadece transaction testleri
npm test -- --testPathPattern=transaction
```

### 4. API Testleri

```bash
# Karakter listesi
curl -sf http://localhost:3000/api/characters | jq '.[].name'

# Karakter detay (slug)
curl -sf http://localhost:3000/api/characters/nova | jq '.name'

# Search
curl -sf "http://localhost:3000/api/characters/search?q=fire" | jq '.[].name'

# Filter by element
curl -sf "http://localhost:3000/api/characters?element=Fire" | jq '.[].name'
```

### 5. Frontend Testleri

```bash
# Karakter listesi sayfası
curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/characters

# Karakter detay sayfası
curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/characters/nova
```

### 6. DB Performance

```bash
# Index usage doğrulama
docker compose exec postgres psql -U destiny_user -d destiny_rising_hub -c "
  EXPLAIN ANALYZE SELECT * FROM \"Character\" WHERE element = 'Fire' ORDER BY popularity DESC;
"

# Slow query log kontrolü
docker compose logs postgres | grep "duration"
```

## Expected Results

| Kontrol | Beklenen Sonuç |
|---------|----------------|
| `prisma validate` | `The schema at ... is valid` |
| `prisma migrate deploy` | 0 error |
| `npm run db:seed` | 20 characters seeded |
| `SELECT COUNT(*)` | 20 |
| `npm test` | PASS — tüm testler |
| API `/api/characters` | 20 karakter JSON array |
| API search | Sonuç döndürüyor |
| API filter | Filtered sonuç döndürüyor |
| Frontend `/characters` | HTTP 200, karakter listesi render |
| Index kullanımı | `Index Scan` EXPLAIN çıktısında |

## Actual Results

> **⏳ PENDING — Doğrulama bekleniyor**

## Evidence

> **⏳ PENDING**
>
> - [ ] prisma validate çıktısı
> - [ ] migration log
> - [ ] seed log (20 characters)
> - [ ] npm test sonucu (tam output)
> - [ ] API response (ilk 3 karakter)
> - [ ] EXPLAIN ANALYZE çıktısı

## Status

⏳ **PENDING**

---

### Checklist

- [ ] `prisma validate` → valid
- [ ] Migration apply → 0 error
- [ ] Seed → 20 characters
- [ ] DB count → 20
- [ ] Integration tests → all PASS
- [ ] Transaction tests → all PASS
- [ ] API /api/characters → 20 characters
- [ ] API search → results
- [ ] API filter → filtered results
- [ ] Frontend /characters → 200 OK
- [ ] Frontend /characters/nova → 200 OK
- [ ] Index kullanımı doğrulandı
