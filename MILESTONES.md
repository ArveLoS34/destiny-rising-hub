# Destiny Rising Hub — Milestone & Release Roadmap

> **Terminoloji:** Milestone (kapsam) + RC (Release Candidate — doğrulama)
> **Ana Prensip:** "Kod yazıldı" ≠ "Production'da doğrulandı"

---

## Durum Göstergeleri

| Sembol | Anlam |
|--------|-------|
| ✅ | Tamamlandı ve doğrulandı |
| 🔨 | Kod yazıldı, production doğrulaması bekleniyor |
| ⏳ | Planlanmış, başlanmadı |
| ❌ | Blokeli / bağımlılık var |
| 🎯 | RC hedefi |

---

## Milestone Overview

| Milestone | Kapsam | RC'ler | Durum |
|-----------|--------|--------|-------|
| **M1** | Database + Repository + Service | RC-1, RC-2 | 🔨 Dev complete |
| **M2** | Identity + OAuth + RBAC | RC-3 | ⏳ Schema ready |
| **M3** | Infrastructure (Redis + Queue + Storage + SMTP) | RC-4, RC-5 | ⏳ Planned |
| **M4** | Production Validation + E2E + Beta | RC-6 | 🔨 Partially started |

---

## Release Candidates

### 🎯 RC-1 — Infrastructure Validation

**Amaç:** Docker Compose ile tam ortam ayağa kalkıyor mu?

```
docker compose up
  ↓
PostgreSQL  → healthy
  ↓
Redis       → healthy
  ↓
MinIO       → healthy
  ↓
Mailpit     → healthy
  ↓
Next.js     → healthy
  ↓
/api/health → PASS
  ↓
✅ RC-1 TAMAM
```

| Kontrol | Durum | Komut |
|---------|-------|-------|
| Docker Compose dosyaları | 🔨 Yazıldı | `docker compose up -d` |
| PostgreSQL healthy | ⏳ Doğrulanmadı | `docker compose ps` |
| Redis healthy | ⏳ Doğrulanmadı | `redis-cli ping` |
| MinIO healthy | ⏳ Doğrulanmadı | `curl localhost:9000/minio/health/live` |
| Mailpit healthy | ⏳ Doğrulanmadı | `curl localhost:8025` |
| Application running | ⏳ Doğrulanmadı | `curl localhost:3000` |
| Health endpoint | 🔨 Yazıldı | `curl localhost:3000/api/health` |

**Exit Criteria:**
- [ ] `docker compose up -d` → Tüm servisler Up (healthy)
- [ ] `docker compose ps` → 5 servis running
- [ ] `curl localhost:3000/api/health` → `{"status": "healthy"}`
- [ ] Yeni geliştirici 10 dk içinde ortamı ayağa kaldırabiliyor

---

### 🎯 RC-2 — Database Validation

**Amaç:** Veritabanı operasyonları gerçek PostgreSQL üzerinde çalışıyor mu?

```
prisma migrate deploy
  ↓
prisma db seed
  ↓
20 Character loaded
  ↓
Repository CRUD
  ↓
API responses
  ↓
Frontend renders
  ↓
✅ RC-2 TAMAM
```

| Kontrol | Durum | Beklenen |
|---------|-------|----------|
| Migration applied | 🔨 Yazıldı | 0 error |
| Seed data loaded | 🔨 Yazıldı | 20 karakter |
| Integration tests | 🔨 Yazıldı | 15+ PASS |
| Transaction tests | 🔨 Yazıldı | 4+ PASS |
| API /api/characters | 🔨 Yazıldı | 20 karakter JSON |
| Frontend renders | ✅ Tamamlandı | Karakter listesi görünür |

**Exit Criteria:**
- [ ] `npx prisma migrate deploy` → Success
- [ ] `npm run db:seed` → 20 characters seeded
- [ ] `npm test` → PASS (tüm testler)
- [ ] `curl localhost:3000/api/characters` → 20 karakter JSON response
- [ ] `curl localhost:3000/characters` → HTML response (karakter listesi)
- [ ] Character detail sayfası açılıyor
- [ ] Search fonksiyonu çalışıyor
- [ ] Filter (element, role, rarity) çalışıyor

---

### 🎯 RC-3 — Identity Validation

**Amaç:** OAuth ve session yönetimi gerçek çalışıyor mu?

| Kontrol | Durum | Beklenen |
|---------|-------|----------|
| Google OAuth | ⏳ İmplementasyon | Login → callback → session |
| GitHub OAuth | ⏳ İmplementasyon | Login → callback → session |
| Discord OAuth | ⏳ İmplementasyon | Login → callback → session |
| Session → Redis | ⏳ İmplementasyon | Token Redis'te |
| Logout | ⏳ İmplementasyon | Session siliniyor |
| RBAC middleware | ⏳ İmplementasyon | Koruma aktif |

**Exit Criteria:**
- [ ] Google OAuth ile giriş yapılıyor
- [ ] Session token oluşturuluyor
- [ ] Session Redis'te saklanıyor
- [ ] Logout session'ı sonlandırıyor
- [ ] RBAC korumalı route'ları koruyor
- [ ] Auth integration testleri PASS

---

### 🎯 RC-4 — Storage Validation

**Amaç:** Dosya yükleme/indirme/transformasyon çalışıyor mu?

| Kontrol | Durum | Beklenen |
|---------|-------|----------|
| MinIO upload | ⏳ İmplementasyon | Dosya yüklendi |
| MinIO download | ⏳ İmplementasyon | Dosya indirildi |
| Image resize | ⏳ İmplementasyon | Boyutlandırıldı |
| WebP conversion | ⏳ İmplementasyon | Dönüştürüldü |
| AVIF conversion | ⏳ İmplementasyon | Dönüştürüldü |
| Thumbnail generation | ⏳ İmplementasyon | Thumbnail oluşturuldu |

**Exit Criteria:**
- [ ] MinIO'ya dosya yükleme → 200 OK
- [ ] Yüklenen dosya indirme → correct content
- [ ] Image resize → correct dimensions
- [ ] WebP/AVIF conversion → valid image
- [ ] Thumbnail → 150x150 veya belirlenen boyut

---

### 🎯 RC-5 — Queue Validation

**Amaç:** BullMQ job queue end-to-end çalışıyor mu?

```
Import Job → Queue → Worker → Process → Complete
                ↓
          Retry on failure
```

| Kontrol | Durum | Beklenen |
|---------|-------|----------|
| BullMQ setup | ⏳ İmplementasyon | Worker running |
| Job enqueue | ⏳ İmplementasyon | Job added |
| Job processing | ⏳ İmplementasyon | Job completed |
| Retry mechanism | ⏳ İmplementasyon | Failed → retry → success |
| Dead letter queue | ⏳ İmplementasyon | Permanent failures captured |
| Job monitoring UI | ⏳ İmplementasyon | Bull Board accessible |

**Exit Criteria:**
- [ ] Job enqueue → Worker receives → completes
- [ ] Failed job → automatic retry (3 attempts)
- [ ] Permanent failure → dead letter queue
- [ ] Bull Board dashboard accessible
- [ ] Concurrent jobs processed correctly

---

### 🎯 RC-6 — Full Workflow Validation

**Amaç:** Uçtan uca iş akışı — CMS'den frontend'e, hiçbir manuel müdahale olmadan.

```
New Character (CMS)
  ↓
Validation (Zod schema)
  ↓
Review (Admin approval)
  ↓
Publish (Status change)
  ↓
Queue (Background processing)
  ↓
Search Index (Update)
  ↓
AI Refresh (Suggestions)
  ↓
Notification (Subscribers)
  ↓
Frontend (Visible to users)
```

**Exit Criteria:**
- [ ] CMS'den yeni karakter oluşturuluyor
- [ ] Zod validation geçiyor
- [ ] Admin review → approve
- [ ] Publish → background job tetikleniyor
- [ ] Queue → search index güncelleniyor
- [ ] AI önerileri hesaplanıyor
- [ ] Notification gönderiliyor
- [ ] Frontend'de yeni karakter görünür
- [ ] **Sıfır manuel müdahale**

---

## Doğrulama Matrisi

```
┌─────────────────────┬───────────────────┬───────────────────────┐
│ Bileşen             │ Development       │ Production            │
│                     │ (kod yazıldı)     │ (doğrulandı)          │
├─────────────────────┼───────────────────┼───────────────────────┤
│ Prisma Schema       │ ✅ Tamamlandı     │ ⏳ RC-2 bekleniyor     │
│ Repository          │ ✅ Tamamlandı     │ ⏳ RC-2 bekleniyor     │
│ Service Layer       │ ✅ Tamamlandı     │ ⏳ RC-2 bekleniyor     │
│ Integration Tests   │ ✅ Yazıldı        │ ⏳ RC-2 bekleniyor     │
│ Transaction Tests   │ ✅ Yazıldı        │ ⏳ RC-2 bekleniyor     │
│ Docker Compose      │ ✅ Yazıldı        │ ⏳ RC-1 bekleniyor     │
│ Health Check API    │ ✅ Yazıldı        │ ⏳ RC-1 bekleniyor     │
│ CI/CD Pipeline      │ ✅ Yazıldı        │ ⏳ RC-6 bekleniyor     │
│ OAuth               │ 🔨 Schema hazır   │ ⏳ RC-3 bekleniyor     │
│ Redis Cache         │ 🔨 Config var     │ ⏳ RC-3 bekleniyor     │
│ BullMQ              │ ⏳ Planlandı      │ ⏳ RC-5 bekleniyor     │
│ MinIO/S3            │ 🔨 Config var     │ ⏳ RC-4 bekleniyor     │
│ SMTP                │ 🔨 Config var     │ ⏳ RC-4 bekleniyor     │
│ E2E Tests           │ ⏳ Planlandı      │ ⏳ RC-6 bekleniyor     │
│ Monitoring          │ ⏳ Planlandı      │ ⏳ RC-6 bekleniyor     │
│ Closed Beta         │ ⏳ Planlandı      │ ⏳ RC-6 sonrası        │
└─────────────────────┴───────────────────┴───────────────────────┘
```

---

## Kapalı Beta Hedefleri

RC-6 tamamlandıktan sonra kapalı beta başlar.

### Beta Metrikleri

| Metrik | Hedef | Ölçüm |
|--------|-------|-------|
| Crash Rate | < 0.1% | Sentry error tracking |
| Error Rate | < 1% | API error responses |
| Search Success | > 90% | Search with results / total searches |
| AI Accuracy | > 80% | User accepted suggestions / total |
| Slow Requests | < 5% | p95 > 1000ms |
| Memory Usage | < 512MB | Docker container metrics |

### Beta Kullanıcı Hedefi
- **Minimum:** 25 aktif kullanıcı
- **İdeal:** 50 aktif kullanıcı
- **Toplanacaklar:** Crash reports, user feedback, performance data

---

## CI/CD Pipeline

```
Push / PR
  ↓
┌──────────────────────────────────────────────┐
│ Stage 1: Quality Gates                       │
│  🔍 Lint + TypeCheck                         │
│  🔒 Security Audit (npm audit)               │
│  📦 Dependency Review (PR'larda)             │
├──────────────────────────────────────────────┤
│ Stage 2: Tests                               │
│  🧪 Unit Tests                               │
│  🔗 Integration Tests (PostgreSQL)           │
├──────────────────────────────────────────────┤
│ Stage 3: Build                               │
│  🏗️ Next.js Build                            │
├──────────────────────────────────────────────┤
│ Stage 4: Docker                              │
│  🐳 Docker Build + Test                      │
├──────────────────────────────────────────────┤
│ Stage 5: Deploy                              │
│  🚀 Staging (develop branch)                 │
│  🚀 Production (main branch)                 │
│     - Pre-deploy backup                      │
│     - Deploy                                 │
│     - Post-deploy smoke tests                │
│     - Release tag                            │
└──────────────────────────────────────────────┘
```

---

## Mimari Karar Kayıtları

Tüm mimari kararlar `docs/adr/` klasöründe belgelenmiştir:

| ADR | Başlık |
|-----|--------|
| ADR-001 | Repository Pattern |
| ADR-002 | Prisma ORM |
| ADR-003 | BullMQ Job Queue |
| ADR-004 | Redis Cache Strategy |
| ADR-005 | Next.js Standalone Output |
| ADR-006 | Docker Compose Geliştirme Ortamı |
| ADR-007 | Milestone + RC Release Workflow |

---

## Öncelik Sırası

1. **RC-1** — Docker Compose doğrulaması (1-2 saat)
2. **RC-2** — Database validation (30 dk + fix)
3. **RC-3** — Identity/OAuth implementasyonu (1-2 hafta)
4. **RC-4** — Storage validation (3-5 gün)
5. **RC-5** — Queue validation (3-5 gün)
6. **RC-6** — Full workflow end-to-end (1 hafta)
7. **Closed Beta** — 25 kullanıcı (2 hafta)

---

## Son Söz

> Başarı ölçütü **"kaç satır kod yazıldı?"** değil:
>
> **"Boş bir sunucuda `docker compose up` çalıştırıldıktan sonra
> sistem gerçekten ayağa kalkıyor mu ve bir içerik oluşturulup
> uçtan uca yayınlanabiliyor mu?"**
