# Destiny Rising Hub — Milestone Roadmap

> Wave yerine Milestone terminolojisine geçilmiştir. Her milestone, belirli bir teslim
> odaklı grubu temsil eder. "Kod yazıldı" ≠ "Production'da doğrulandı" ayrımı
> her milestone için geçerlidir.

---

## Durum Göstergeleri

| Sembol | Anlam |
|--------|-------|
| ✅ | Tamamlandı ve doğrulandı |
| 🔨 | Kod yazıldı, production doğrulaması bekleniyor |
| ⏳ | Planlanmış, başlanmadı |
| ❌ | Blokeli / bağımlılık var |

---

## M1 — Database & Repository Layer

> Karakter verisinin kalıcı depolanması, sorgulanması ve erişim katmanı.

| Bileşen | Durum | Not |
|---------|-------|-----|
| Prisma Schema (Character) | 🔨 | Migration production'da uygulanmadı |
| Repository Layer | 🔨 | Gerçek DB üzerinde test edilmedi |
| Service Layer | 🔨 | Business logic yazıldı, production'da doğrulanmadı |
| Database Service | 🔨 | Connection pool, health check implement edildi |
| Integration Tests | 🔨 | Yazıldı, production PostgreSQL üzerinde koşulmadı |
| Seed Script | 🔨 | 20 karakter hazır, production'da çalıştırılmadı |
| Index'ler | 🔨 | Tanımlandı, EXPLAIN ANALYZIS production'da yapılmadı |

### Exit Criteria (M1)
- [ ] PostgreSQL production instance ayakta
- [ ] `prisma migrate deploy` başarılı
- [ ] Seed data yüklendi (20 karakter)
- [ ] Integration testleri `PASS` — 20/20
- [ ] Transaction testleri `PASS` — 4/4
- [ ] Connection pool doğrulandı
- [ ] Slow query log aktif
- [ ] Index'ler EXPLAIN ile doğrulandı

### Progress: **75%** (Development) → Production doğrulaması bekleniyor

---

## M2 — Identity & OAuth

> Kullanıcı kimlik doğrulama, yetkilendirme ve oturum yönetimi.

| Bileşen | Durum | Not |
|---------|-------|-----|
| User Schema (Prisma) | 🔨 | Model tanımlandı, production'da create edilmedi |
| Session Model | 🔨 | Token-based session schema hazır |
| Account Model (OAuth) | 🔨 | Multi-provider schema hazır |
| RBAC (Role-based Access) | ⏳ | Schema'da enum var, middleware yazılmadı |
| NextAuth.js / Better-Auth Integration | ⏳ | Kurulum başlanmadı |
| Google OAuth | ⏳ | Client ID/Secret bekleniyor |
| GitHub OAuth | ⏳ | Client ID/Secret bekleniyor |
| Discord OAuth | ⏳ | Client ID/Secret bekleniyor |
| Auth Middleware | ⏳ | Route protection yazılmadı |
| Session Management | ⏳ | Token refresh, expiry, revocation |

### Exit Criteria (M2)
- [ ] En az 1 OAuth provider ile gerçek giriş yapılıyor
- [ ] Session token oluşturuluyor ve doğrulanıyor
- [ ] RBAC middleware korumalı route'ları koruyor
- [ ] Token refresh çalışıyor
- [ ] Logout session'ı sonlandırıyor
- [ ] Auth integration testleri PASS

### Progress: **30%** (Schema) → Implementasyon bekleniyor

---

## M3 — Infrastructure & Services

> Cache, job queue, object storage, email altyapısı.

| Bileşen | Durum | Not |
|---------|-------|-----|
| Redis Connection | ⏳ | URL config var, implementasyon yok |
| Redis Cache Layer | ⏳ | Karakter cache, TTL yönetimi |
| BullMQ Setup | ⏳ | Job queue kurulumu |
| Background Jobs | ⏳ | Email gönderimi, image processing |
| MinIO / S3 Storage | ⏳ | Object storage entegrasyonu |
| Image Upload Pipeline | ⏳ | Upload, resize, CDN |
| SMTP / Email Service | ⏳ | Template engine, queue |
| Rate Limiting | ⏳ | Redis-based rate limiter |

### Exit Criteria (M3)
- [ ] Redis ayakta, health check geçiyor
- [ ] Cache hit/miss oranı izleniyor
- [ ] BullMQ worker çalışıyor, job success rate > 99%
- [ ] MinIO'ya dosya yükleme/indirme çalışıyor
- [ ] Email gönderimi Mailpit'te doğrulanıyor
- [ ] Rate limiter aktif

### Progress: **5%** (Config) → Implementasyon bekleniyor

---

## M4 — Production Validation & Beta

> Gerçek ortam doğrulaması, monitoring, CI/CD ve kapalı beta.

| Bileşen | Durum | Not |
|---------|-------|-----|
| Docker Compose (dev) | 🔨 | Yazıldı, `docker compose up` ile doğrulanmadı |
| Docker Compose (prod) | ⏳ | Production compose ayrı |
| CI/CD Pipeline | ⏳ | GitHub Actions: lint, test, build, deploy |
| E2E Tests | ⏳ | Playwright / Cypress |
| Monitoring (Sentry) | ⏳ | Error tracking |
| Logging (Structured) | ⏳ | Centralized logging |
| Backup Strategy | ⏳ | Automated DB backup |
| Performance Baseline | ⏳ | Lighthouse, k6 load test |
| Closed Beta Deployment | ⏳ | Vercel / Railway / Hetzner |
| Beta User Onboarding | ⏳ | Invite system |

### Exit Criteria (M4)
- [ ] `docker compose up` ile 10 dk içinde tam ortam ayağa kalkıyor
- [ ] CI/CD: push → lint → test → build → deploy otomatik
- [ ] Sentry'de gerçek error takibi aktif
- [ ] DB backup: günlük otomatik, restore test edildi
- [ ] Lighthouse score: Performance > 90, Accessibility > 95
- [ ] k6 load test: 100 concurrent user, p95 < 500ms
- [ ] Kapalı beta: 10-50 kullanıcı aktif
- [ ] Fatal error rate < 0.1%

### Progress: **15%** (Docker Compose dev yazıldı) → Devamı bekleniyor

---

## Docker Compose — Geliştirme Ortamı

Tüm servisler tek komutla ayağa kalkar:

```bash
# 1. Environment dosyasını kopyala
cp .env.docker .env

# 2. Tüm servisleri başlat
docker compose up -d

# 3. (Alternatif) Redis GUI ile başlat
docker compose --profile tools up -d

# 4. Logları takip et
docker compose logs -f app
```

### Servis Portları

| Servis | Port | URL |
|--------|------|-----|
| Application | 3000 | http://localhost:3000 |
| PostgreSQL | 5432 | localhost:5432 |
| Redis | 6379 | localhost:6379 |
| MinIO API | 9000 | http://localhost:9000 |
| MinIO Console | 9001 | http://localhost:9001 |
| Mailpit UI | 8025 | http://localhost:8025 |
| Redis Commander | 8081 | http://localhost:8081 |

### Yeni Geliştirici Kurulumu

```bash
git clone https://github.com/ArveLoS34/destiny-rising-hub.git
cd destiny-rising-hub
cp .env.docker .env
docker compose up -d

# ~10 dakika sonra:
# ✅ PostgreSQL: migration applied, seed data loaded
# ✅ Redis: running
# ✅ MinIO: running
# ✅ Mailpit: running
# ✅ Application: http://localhost:3000
```

---

## Doğrulama Matrisi

Her bileşen için iki aşamalı doğrulama:

```
┌─────────────────────┬───────────────────┬───────────────────────┐
│ Bileşen             │ Development       │ Production            │
│                     │ (kod yazıldı)     │ (doğrulandı)          │
├─────────────────────┼───────────────────┼───────────────────────┤
│ Prisma Schema       │ ✅ Tamamlandı     │ ⏳ Migration bekleniyor│
│ Repository          │ ✅ Tamamlandı     │ ⏳ DB testi bekleniyor │
│ Service Layer       │ ✅ Tamamlandı     │ ⏳ Integration bekleniyor│
│ Integration Tests   │ ✅ Yazıldı        │ ⏳ npm test bekleniyor  │
│ Transaction Tests   │ ✅ Yazıldı        │ ⏳ npm test bekleniyor  │
│ Docker Compose      │ ✅ Yazıldı        │ ⏳ docker compose up    │
│ OAuth               │ ⏳ Schema hazır   │ ⏳ İmplementasyon       │
│ Redis               │ ⏳ Config var     │ ⏳ İmplementasyon       │
│ CI/CD               │ ⏳ Planlandı      │ ⏳ Kurulum              │
│ Monitoring          │ ⏳ Planlandı      │ ⏳ Kurulum              │
│ E2E Tests           │ ⏳ Planlandı      │ ⏳ Kurulum              │
│ Beta                │ ⏳ Planlandı      │ ⏳ Deployment           │
└─────────────────────┴───────────────────┴───────────────────────┘
```

---

## Öncelik Sırası

1. **Docker Compose doğrulaması** — `docker compose up` ile tam ortam
2. **Gerçek PostgreSQL doğrulaması** — Migration + Seed + Test
3. **CI/CD** — Otomatik lint, test, build, deploy
4. **M2 (Identity)** — OAuth entegrasyonu
5. **M3 (Infrastructure)** — Redis + BullMQ + Storage
6. **M4 (Validation)** — E2E + Monitoring + Beta

---

## Değişiklik Günlüğü

| Tarih | Değişiklik |
|-------|-----------|
| 2026-08-05 | Wave terminolojisinden Milestone terminolojisine geçiş |
| 2026-08-05 | Docker Compose dev ortamı eklendi |
| 2026-08-05 | "Kod yazıldı" vs "Production doğrulandı" ayrımı netleştirildi |
| 2026-08-05 | Doğrulama matrisi eklendi |
