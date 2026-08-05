# RC-6: Full Workflow Validation

## Objective

Uçtan uca iş akışı — CMS'den frontend'e, hiçbir manuel müdahale olmadan — çalışıyor mu?
Bu, production readiness'ın nihai kanıtıdır.

## Environment

- **Tüm Servisler:** PostgreSQL, Redis, MinIO, Mailpit, Application, Worker
- **Tarih:** [Doğrulama tarihi]

## Prerequisites

- ✅ RC-1 PASS (Infrastructure)
- ✅ RC-2 PASS (Database)
- ✅ RC-3 PASS (Identity)
- ✅ RC-4 PASS (Storage)
- ✅ RC-5 PASS (Queue)

## End-to-End Senaryo

Tek bir senaryo: **Yeni karakter oluştur ve yayınla.**

```
1. CMS → Yeni karakter formunu doldur
2. Validation → Zod schema validation geç
3. Review → Admin onayı
4. Publish → Status: DRAFT → PUBLISHED
5. Queue → Background job tetiklenir
6. Search Index → Karakter aranabilir olur
7. AI Refresh → Öneriler hesaplanır
8. Notification → Abonelere bildirim
9. Frontend → Karakter sayfada görünür
```

## Commands

### 1. Authentication

```bash
# Admin olarak giriş yap
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"..."}'
```

### 2. Karakter Oluşturma (CMS)

```bash
# Yeni karakter oluştur (DRAFT)
curl -X POST http://localhost:3000/api/characters \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RC6 Test Character",
    "slug": "rc6-test",
    "element": "Fire",
    "role": "DPS",
    "rarity": "SSR"
  }'
```

### 3. Validation

```bash
# Zod schema validation geçti mi?
# Response: 201 Created (validation başarılı)
# veya 400 Bad Request (validation başarısız)
```

### 4. Admin Review

```bash
# Karakteri onayla
curl -X PATCH http://localhost:3000/api/characters/rc6-test/review \
  -H "Authorization: Bearer {token}" \
  -d '{"status": "APPROVED"}'
```

### 5. Publish

```bash
# Karakteri yayınla
curl -X PATCH http://localhost:3000/api/characters/rc6-test/publish \
  -H "Authorization: Bearer {token}"
```

### 6. Queue Processing

```bash
# Job tetiklendi mi?
docker compose exec redis redis-cli keys "bull:*"

# Worker logları
docker compose logs --tail=10 worker | grep "rc6-test"

# Job tamamlandı mı?
docker compose exec redis redis-cli keys "bull:*:completed"
```

### 7. Search Index

```bash
# Karakter aranabilir mi?
curl -sf "http://localhost:3000/api/characters/search?q=rc6" | jq '.[].name'
# Beklenen: "RC6 Test Character"
```

### 8. AI Refresh

```bash
# AI önerileri hesaplandı mı?
curl -sf http://localhost:3000/api/characters/rc6-test/suggestions | jq .
```

### 9. Notification

```bash
# Bildirim gönderildi mi?
# Mailpit'te kontrol et
curl -sf http://localhost:8025/api/messages | jq '.[].subject'
```

### 10. Frontend

```bash
# Karakter listesinde görünüyor mu?
curl -sf http://localhost:3000/characters | grep "rc6-test"

# Karakter detay sayfası
curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/characters/rc6-test
# Beklenen: 200
```

## Expected Results

| Adım | Beklenen Sonuç | Durum |
|------|----------------|-------|
| 1. Auth | Admin session oluşturuldu | ⏳ |
| 2. Create | 201 Created, DRAFT | ⏳ |
| 3. Validation | Zod schema PASS | ⏳ |
| 4. Review | APPROVED | ⏳ |
| 5. Publish | PUBLISHED, job tetiklendi | ⏳ |
| 6. Queue | Job completed | ⏳ |
| 7. Search | Aranabilir | ⏳ |
| 8. AI | Öneriler hesaplandı | ⏳ |
| 9. Notification | Email gönderildi | ⏳ |
| 10. Frontend | Sayfa erişilebilir | ⏳ |

## Actual Results

> **⏳ PENDING**

## Evidence

> **⏳ PENDING**
>
> - [ ] Karakter oluşturma response
> - [ ] Review/Publish response
> - [ ] Queue job logları
> - [ ] Search sonuçları
> - [ ] AI suggestions response
> - [ ] Mailpit'te email
> - [ ] Frontend sayfa screenshot
> - [ ] **Timeline:** Create → Frontend görünür (toplam süre)

## Timing

| Metrik | Hedef | Gerçek |
|--------|-------|--------|
| Create → Publish | < 1sn | — |
| Publish → Search | < 5sn | — |
| Publish → AI | < 30sn | — |
| Publish → Notification | < 10sn | — |
| Publish → Frontend | < 5sn | — |
| **E2E Total** | < 60sn | — |

## Zero Manual Intervention

Bu RC'nin en önemli kriteri: **Hiçbir adımda manuel müdahale yok.**

- [ ] Karakter oluşturma → otomatik validation
- [ ] Review → otomatik queue tetikleme
- [ ] Publish → otomatik search index update
- [ ] AI → otomatik suggestion generation
- [ ] Notification → otomatik email
- [ ] Frontend → otomatik görünür

## Status

⏳ **PENDING**

---

### Checklist

- [ ] Admin login başarılı
- [ ] Karakter oluşturuldu (DRAFT)
- [ ] Validation geçti
- [ ] Admin review onayladı
- [ ] Publish → PUBLISHED
- [ ] Queue job tetiklendi
- [ ] Queue job completed
- [ ] Search index güncellendi
- [ ] AI öneriler hesaplandı
- [ ] Notification gönderildi (Mailpit)
- [ ] Frontend'de karakter görünüyor
- [ ] Frontend detay sayfası erişilebilir
- [ ] E2E total < 60sn
- [ ] Sıfır manuel müdahale
