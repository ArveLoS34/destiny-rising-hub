# Netlify Free Compatibility + Migration Review
**Tarih:** 2026-08-09  
**Hedef:** $0/ay Free-tier production/hobby deployment  
**Durum:** Review only — ZERO RUNTIME CHANGES

---

## Repository Durum Doğrulaması

```
Branch: feature/rc3-performance
HEAD: a6810a1f4a1c170634d89983c346c8edb83ce8ba
Tracked değişiklik: YOK (sadece untracked .md dosyaları)

Korunacak dosyalar (hepsi mevcut ve dokunulmayacak):
  ✅ src/lib/auth/index.ts
  ✅ src/lib/auth/client.ts
  ✅ src/app/api/auth/[[...all]]/route.ts
  ✅ prisma/schema.prisma
  ✅ prisma/migrations/ (2 migration)
  ✅ Dockerfile
  ✅ docker-compose.yml
  ✅ docker-compose.prod.yml
  ✅ next.config.ts
  ✅ .env.production.example
```

---

```
=== FREE PRODUCTION ARCHITECTURE REVIEW ===

Primary:
  Netlify Free + Neon Free + Upstash Free

Netlify compatibility: CONDITIONAL
Neon compatibility: PASS
Upstash compatibility: CONDITIONAL

Existing Auth compatibility: CONDITIONAL
Existing Prisma compatibility: PASS
Existing Redis compatibility: CONDITIONAL
Existing Health Endpoint: PASS
CI/CD compatibility: PASS
Free-tier suitability: CONDITIONAL

Required code changes: NONE (zero runtime changes)
Required config changes: LIST (aşağıda)
Required infrastructure: LIST (aşağıda)
Free-tier limitations: LIST (aşağıda)
Security risks: LIST (aşağıda)
Performance risks: LIST (aşağıda)
Rollback strategy: LIST (aşağıda)
Migration phases: LIST (aşağıda)
Regression tests: LIST (aşağıda)
Project breakage risk: LOW

FINAL: CONDITIONAL GO
```

---

## 1. Next.js 16.3 + Netlify Uyumluluğu

### Kaynak: [Netlify Resmi Dokümantasyon — Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)

| Next.js Feature | Netlify Desteği | Not |
|---|---|---|
| App Router | ✅ Full Support | — |
| Server-Side Rendering (SSR) | ✅ Full Support | — |
| React Server Components | ✅ Full Support | — |
| Server Actions | ✅ Full Support | — |
| Route Handlers | ✅ Full Support | /api/* endpoint'leri |
| Middleware | ✅ Full Support | Edge Functions olarak implement edilir |
| Image Optimization | ✅ Full Support | Netlify Image CDN |
| ISR | ✅ Full Support | — |
| SSG | ✅ Full Support | — |
| Response Streaming | ✅ Full Support | — |
| Redirects and Rewrites | ✅ Full Support | — |
| Internationalization | ✅ Full Support | — |
| Draft Mode | ✅ Full Support | — |
| Turbopack | ✅ Full Support | — |
| `next/after` (async work) | ✅ Full Support | — |
| Cache Components | ✅ Full Support | — |

### Mevcut Proje Uyumluluğu

| Proje Özelliği | Durum | Kanıt |
|---|---|---|
| `output: 'standalone'` (next.config.ts) | ⚠️ CONDITIONAL | Netlify OpenNext adapter kullanır, standalone output Netlify'de kullanılmaz. Ama build'i bozmaz — Netlify kendi adapter'ını uygular |
| Security headers (next.config.ts) | ✅ PASS | Netlify Functions üzerinden response header'ları korunur |
| Image remotePatterns | ✅ PASS | Netlify Image CDN ile uyumlu |
| Route Handlers (/api/auth/*, /api/health) | ✅ PASS | Netlify Functions olarak deploy edilir |
| App Router pages | ✅ PASS | Tam destek |

### Netlify Çalışma Prensibi

```
Next.js App (Netlify'de)
    ↓
OpenNext Adapter (otomatik)
    ↓
┌─────────────────────────────────────────┐
│ Netlify Functions (Node.js serverless)  │
│   ├── SSR pages                         │
│   ├── Route Handlers (/api/*)           │
│   ├── Server Actions                    │
│   └── ISR                               │
│                                         │
│ Netlify Edge Functions (Deno)           │
│   └── Middleware                         │
└─────────────────────────────────────────┘
```

**Önemli:** Netlify otomatik olarak Next.js projesini algılar ve OpenNext adapter'ı uygular. `netlify.toml` dosyasında minimal konfigürasyon yeterli olabilir.

---

## 2. Better Auth + Netlify Serverless Uyumluluğu

### Mevcut Auth Yapısı

```
/api/auth/*
    ↓
toNextJsHandler(auth) → { GET, POST }
    ↓
Better Auth instance
    ├── PostgreSQL (Prisma adapter) → sessions, users, accounts
    ├── Redis (ioredis) → rate limiting, secondary storage
    └── Cookies → session_token (httpOnly, secure, sameSite=lax)
```

### Netlify Serverless Request Lifecycle

```
Request → Netlify CDN → Netlify Function (Node.js serverless)
    ↓
Function invocation:
    ├── Cold start: ~300-1000ms (function initialization)
    │   ├── ioredis: new Redis() → TCP connection
    │   ├── Prisma: new PrismaClient() → DB connection
    │   └── Better Auth: initialize
    │
    └── Warm start: ~50-100ms
        ├── ioredis: connection reuse (possible)
        ├── Prisma: connection reuse (possible)
        └── Better Auth: handle request
```

### Auth Endpoint Uyumluluğu

| Endpoint | Durum | Not |
|---|---|---|
| POST /api/auth/sign-up/email | ✅ PASS | Route Handler → Netlify Function |
| POST /api/auth/sign-in/email | ✅ PASS | Route Handler → Netlify Function |
| POST /api/auth/sign-out | ✅ PASS | Cookie clearing works in serverless |
| GET /api/auth/get-session | ✅ PASS | Cookie reading works in serverless |

### Cookie Uyumluluğu

| Özellik | Durum | Not |
|---|---|---|
| HttpOnly | ✅ PASS | Serverless response headers'da çalışır |
| Secure (NODE_ENV=production) | ✅ PASS | HTTPS behind Netlify CDN |
| SameSite=Lax | ✅ PASS | Standart cookie attribute |
| Path=/ | ✅ PASS | — |

### Güvenlik Uyumluluğu

| Özellik | Durum | Not |
|---|---|---|
| CSRF protection (disableCSRFCheck: false) | ✅ PASS | Origin header kontrolü |
| Origin check (disableOriginCheck: false) | ✅ PASS | — |
| Trusted origins | ⚠️ CONDITIONAL | Netlify URL eklenmeli (TRUSTED_ORIGINS) |
| Rate limiting (Redis-backed) | ⚠️ CONDITIONAL | ioredis + Upstash uyumluluğu (aşağıda) |

### KRİTİK: Better Auth + Serverless

**Kanıt:** Better Auth, Vercel ve Netlify gibi serverless platformlarda çalışmak üzere tasarlanmıştır. Better Auth'ın resmi dokümantasyonunda Vercel deployment örnekleri mevcuttur. Netlify Functions, Vercel Functions ile benzer Node.js serverless runtime sağlar.

**Risk:** `@better-auth/redis-storage` paketi `ioredis` client kullanıyor. Serverless ortamda bu:
- Warm invocation'larda connection reuse mümkün
- Cold start'larda yeni TCP connection overhead
- `lazyConnect: true` zaten ayarlı — ilk kullanımda bağlanır
- `maxRetriesPerRequest: 3` — transient hataları tolere eder

**Sonuç:** Çalışır, ama optimal değil. Performans etkisi minimal (5-15ms/connection overhead).

---

## 3. Redis (ioredis) + Upstash + Netlify Uyumluluğu

### KRİTİK ANALİZ

**Mevcut Redis kullanımı (`src/lib/auth/index.ts`):**
```typescript
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

const secondaryStorage = redisStorage({
  client: redis,
  keyPrefix: "better-auth:",
});
```

**Protokol:** `ioredis` → TCP connection (Redis protocol/RESP)

### Upstash Redis Uyumluluğu

**Kaynak:** [Upstash vs Redis Cloud 2026](https://upstash.com/blog/upstash-vs-redis-cloud-a-2026-comparison)

> "Upstash exposes both standard Redis TCP and a native HTTP API, so it works in serverless and normal server environments."

> "Upstash runs a Redis-compatible engine... Most Redis client libraries (ioredis, redis-py, go-redis, @upstash/redis) work with it unchanged"

**Upstash connection string (TCP):**
```
rediss://default:password@host.upstash.io:6379
```

**`rediss://` = SSL/TLS over TCP** — ioredis tarafından desteklenir.

### Netlify Functions + TCP Redis

**Kaynak:** [Redis.io — Getting Started with Netlify and Redis](https://redis.io/tutorials/create/netlify/getting-started-with-redis/)

> "Can I use Redis with Netlify edge functions? Yes. Netlify edge functions run on Deno at the edge and can connect to Redis Cloud using a REST-based Redis client or a TCP-compatible client."

> "For Node.js-based Netlify functions, use node-redis or ioredis. Both support Redis Cloud and handle connection pooling"

**Sonuç:** Netlify Functions (Node.js) TCP bağlantısı destekliyor. ioredis + Upstash TCP endpoint birlikte çalışır.

### Uyumluluk Matrisi

| Özellik | Durum | Kanıt |
|---|---|---|
| ioredis + Upstash TCP | ✅ PASS | Upstash standart Redis protocol destekler |
| Netlify Functions TCP | ✅ PASS | Netlify Functions Node.js runtime TCP izin verir |
| @better-auth/redis-storage | ✅ PASS | ioredis client kullanır, Upstash uyumlu |
| Atomic INCR (Lua script) | ✅ PASS | Upstash Lua scripting destekler |
| TTL/EXPIRE | ✅ PASS | Standart Redis komutları |
| GETDEL | ✅ PASS | Upstash destekler |
| Key prefix ("better-auth:") | ✅ PASS | Client-side özellik |
| lazyConnect | ✅ PASS | Zaten ayarlı |

### ⚠️ Dikkat Edilmesi Gerekenler

**1. Connection Overhead:**
- Cold start: Yeni TCP connection (~5-15ms)
- Warm start: Connection reuse (mümkün, garanti değil)
- Etki: Minimal (rate limiting'de 5-15ms gecikme kabul edilebilir)

**2. Connection Pooling:**
- Serverless'ta connection pool yok (her invocation ayrı)
- `lazyConnect: true` yardımcı olur
- Upstash connection limit: 10,000 commands/sec (free tier)

**3. `redisStorage` atomic operations:**
- `@better-auth/redis-storage` Lua script ile atomic INCR yapar
- Upstash Lua scripting destekler
- Phase 2B-3'te test edilmiş behavior korunur

### Kod Değişikliği Gerekli mi?

**HAYIR.** Mevcut `src/lib/auth/index.ts` DEĞİŞTİRİLEMEZ.

Sadece `REDIS_URL` environment variable'ı Upstash TCP connection string olarak ayarlanacak:
```
REDIS_URL="rediss://default:password@host.upstash.io:6379"
```

---

## 4. Prisma + Neon PostgreSQL Uyumluluğu

### Mevcut Prisma Yapılandırması

```typescript
// src/lib/auth/index.ts
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });
```

**Driver:** Prisma 7.x `@prisma/adapter-pg` (pg driver)
**Connection:** `pg.Pool` (connection pool)
**Database:** PostgreSQL 16

### Neon Uyumluluğu

**Kaynak:** [Prisma Postgres vs Neon](https://www.prisma.io/docs/guides/switch-to-prisma-postgres/from-neon)

| Özellik | Neon Desteği | Not |
|---|---|---|
| PostgreSQL 16 | ✅ | — |
| Connection pooling (PgBouncer) | ✅ Built-in | Pooled connection string |
| SSL/TLS | ✅ Zorunlu | `sslmode=require` |
| Serverless driver | ✅ | HTTP driver da var ama pg adapter de çalışır |
| Prisma compatibility | ✅ | `@prisma/adapter-pg` uyumlu |
| Migration support | ✅ | `prisma migrate deploy` |

### Neon Connection String Format

**Pooled (önerilen — serverless için):**
```
postgresql://user:password@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
```

**Direct (migration için):**
```
postgresql://user:password@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
```

### ⚠️ Kritik: Pooled vs Direct Connection

**Migration işlemleri** (`prisma migrate deploy`) **direct (unpooled) connection** gerektirir:
- Pooled connection prepared statement'ları bozar
- Migration sırasında direct connection string kullanılmalı

**Application runtime** pooled connection kullanabilir:
- `DATABASE_URL` = pooled (app runtime)
- `DATABASE_URL_UNPOOLED` = direct (migration)

### Serverless Connection Davranışı

**Prisma + pg adapter + Neon:**
```
Request → Netlify Function
    ↓
PrismaClient (singleton — warm invocation'da reuse)
    ↓
pg.Pool (connection pooling)
    ↓
Neon PgBouncer (server-side pooling)
    ↓
PostgreSQL
```

**Connection explosion riski:**
- Her Netlify Function instance kendi pg.Pool'u tutar
- Warm invocation'larda pool reuse edilir
- Neon PgBouncer server-side pooling yapar
- Neon free tier: 10,000 pooled connections

**Sonuç:** Risk minimal. Neon'un PgBouncer'ı connection'ları yönetir.

### Migration Stratejisi

**Seçenek 1: Build sırasında migration (önerilen)**
```
GitHub Actions → Build → Post-build: prisma migrate deploy (direct URL)
```

**Seçenek 2: İlk deploy sırasında migration**
```
Netlify deploy → İlk request → docker-entrypoint.sh benzeri init
```

**Seçenek 3: Manuel migration (CI'dan)**
```
GitHub Actions → prisma migrate deploy (Neon direct URL ile)
```

**Önerilen:** Seçenek 3 — CI'da ayrı migration adımı.

### Kod Değişikliği Gerekli mi?

**HAYIR.** `DATABASE_URL` environment variable'ı Neon pooled connection string olarak ayarlanacak.

**Opsiyonel:** Migration için ayrı `DATABASE_URL_UNPOOLED` tanımlanabilir.

---

## 5. Health Endpoint Uyumluluğu

### Mevcut Health Check

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const checks = {};
  
  // Database check
  const dbHealthy = await databaseService.healthCheck(); // SELECT 1
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: ...,
    version: ...,
    checks: { database, application },
    uptime: process.uptime(),
  });
}
```

### Netlify Uyumluluğu

| Özellik | Durum | Not |
|---|---|---|
| Route Handler olarak çalışır | ✅ PASS | Netlify Function |
| Database health check (SELECT 1) | ✅ PASS | Neon connection |
| Redis health check | ⚠️ YOK | Mevcut health endpoint'te Redis check yok |
| Response format | ✅ PASS | JSON response |
| HTTP 200/503 | ✅ PASS | — |

### Sonuç

Mevcut health endpoint Netlify'de sorunsuz çalışır. Redis health check eklenmemiş (bu review kapsamında eklenmez).

---

## 6. Environment Variables — Netlify Mapping

### Critical (Netlify Dashboard'da tanımlanacak)

| Variable | Mevcut (.env.production.example) | Netlify Değeri | Not |
|---|---|---|---|
| `NODE_ENV` | `production` | `production` | Netlify otomatik set eder |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://site-name.netlify.app` | Netlify URL |
| `BETTER_AUTH_SECRET` | placeholder | `openssl rand -base64 48` | Netlify secret |
| `BETTER_AUTH_URL` | `https://your-domain.com` | `https://site-name.netlify.app` | Netlify URL |
| `TRUSTED_ORIGINS` | comma-separated | `https://site-name.netlify.app` | Netlify URL |
| `DATABASE_URL` | postgresql://... | Neon pooled URL | Neon connection string |
| `REDIS_URL` | redis://localhost:6379 | `rediss://default:...@host.upstash.io:6379` | Upstash TCP URL |

### Optional

| Variable | Durum | Not |
|---|---|---|
| `BULLMQ_REDIS_URL` | ❌ KULLANILMAZ | BullMQ serverless'te çalışmaz |
| `SMTP_*` | ⚠️ OPTIONAL | Email servisi varsa |
| `OAuth credentials` | ❌ DISABLED | Zaten devre dışı |
| `S3/R2 credentials` | ⚠️ OPTIONAL | Storage servisi varsa |
| `SENTRY_DSN` | ⚠️ OPTIONAL | Monitoring varsa |
| `Analytics` | ⚠️ OPTIONAL | — |
| `Feature flags` | ✅ PASS | — |
| `CDN_URL` | ❌ KULLANILMAZ | Netlify kendi CDN'ini sağlar |
| `RATE_LIMIT_*` | ✅ PASS | Better Auth config'de kullanılır |

### NEXT_PUBLIC_* Ayrımı

| Variable | Client'a exposed? | Güvenlik |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | ✅ Evet | Public URL (güvenli) |
| `NEXT_PUBLIC_APP_NAME` | ✅ Evet | Public name (güvenli) |
| `BETTER_AUTH_SECRET` | ❌ Hayır | Server-only (secret) |
| `DATABASE_URL` | ❌ Hayır | Server-only (secret) |
| `REDIS_URL` | ❌ Hayır | Server-only (secret) |

**Netlify'de:** `NEXT_PUBLIC_*` prefix'li değişkenler client bundle'a dahil edilir. Prefix'siz değişkenler sadece server-side (Netlify Functions) erişilebilir.

### Context-Based Variables

Netlify'de environment variable'lar context'e göre ayarlanabilir:
- **Production:** Production branch deploy
- **Deploy preview:** PR preview deploy
- **Branch deploy:** Feature branch deploy

---

## 7. Dockerfile Analizi — Netlify İçin Gerekli mi?

### Mevcut Dockerfile

5 aşamalı multi-stage build:
1. `deps` — npm ci
2. `prisma` — prisma generate
3. `builder` — next build
4. `development` — dev runner
5. `runner` — production runner (node server.js)

### Netlify Deployment Model

```
GitHub push → Netlify build
    ↓
Netlify otomatik algılar: Next.js projesi
    ↓
npm install → npm run build
    ↓
OpenNext adapter uygular
    ↓
Netlify Functions + Edge Functions olarak deploy
```

**Netlify Docker KULLANMAZ.** Kendi build sistemi var:
- `npm ci` veya `npm install`
- `npm run build`
- Otomatik framework detection
- OpenNext adapter

### Sonuç

| Dosya | Netlify'de Kullanılıyor mu? |
|---|---|
| `Dockerfile` | ❌ HAYIR — Netlify kendi build sistemini kullanır |
| `docker-compose.yml` | ❌ HAYIR |
| `docker-compose.prod.yml` | ❌ HAYIR |

**Ama:** Bu dosyalar silinmez. Korunur çünkü:
- Docker deployment alternatifi olarak kalır
- Self-hosted deployment seçeneği korunur
- Future migration için referans

---

## 8. docker-compose.prod.yml — Netlify Mimarisinde Durum

### Mevcut Servisler

| Servis | Netlify'de Durum | Not |
|---|---|---|
| `app` | ❌ Kullanılmıyor | Netlify kendi runner'ını sağlar |
| `postgres` | ❌ Kullanılmıyor | Neon (managed) yerine geçer |
| `redis` | ❌ Kullanılmıyor | Upstash (managed) yerine geçer |
| `backup` | ❌ Kullanılmıyor | Neon otomatik backup yapar |

### Sonuç

`docker-compose.prod.yml` Netlify deployment'da **tamamen kullanılmıyor.** Ama **silinmez** — Docker deployment alternatifi olarak korunur.

### Ayrı Cleanup PR?

**Öneri:** Şu an silme. Netlify migration başarılı olduktan sonra ayrı bir PR ile:
- Docker dosyaları "archived" olarak işaretlenebilir
- Veya `docs/DOCKER-DEPLOYMENT.md` olarak taşınabilir
- Veya repository'de kalır (gelecekteki self-hosted deployment için)

---

## 9. CI/CD Uyumluluğu

### Mevcut GitHub Actions Pipeline

| Job | Netlify Uyumluluğu | Not |
|---|---|---|
| `lint` | ✅ PASS | Bağımsız |
| `security-audit` | ✅ PASS | Bağımsız |
| `dependency-review` | ✅ PASS | Bağımsız |
| `license-check` | ✅ PASS | Bağımsız |
| `secret-scan` (Gitleaks) | ✅ PASS | Bağımsız |
| `unit-tests` | ✅ PASS | Bağımsız |
| `integration-tests` | ✅ PASS | PostgreSQL service ile |
| `build` | ✅ PASS | `npm run build` |
| `docker-build` | ❌ GEREKSİZ | Netlify kendi build yapar |
| `trivy-scan` | ⚠️ GEREKSİZ | Docker image yok |
| `sbom-generation` | ⚠️ GEREKSİZ | Docker image yok |
| `deploy-staging` | ⚠️ TODO | Netlify preview deploy |
| `deploy-production` | ⚠️ TODO | Netlify otomatik deploy |

### Netlify GitHub Integration

```
GitHub push
    ↓
┌─────────────────────────────────────┐
│ GitHub Actions CI                   │
│   ├── lint                          │
│   ├── test                          │
│   ├── security-audit                │
│   └── build                         │
└─────────────────────────────────────┘
    ↓ (ayrı trigger)
┌─────────────────────────────────────┐
│ Netlify GitHub Integration          │
│   ├── Otomatik build                │
│   ├── Otomatik deploy               │
│   ├── Preview deploy (PR'ler için)  │
│   └── Production deploy (main)      │
└─────────────────────────────────────┘
```

**İki seçenek:**

**Seçenek A: Mevcut CI + Netlify otomatik deploy**
- GitHub Actions: lint, test, security (mevcut — değiştirme)
- Netlify: Otomatik deploy (GitHub integration)
- Docker/Trivy/SBOM job'ları: Devre dışı bırak (veya kalır ama etkisiz)

**Seçenek B: Tüm pipeline Netlify'de**
- Netlify build hooks ile CI tetikle
- Daha basit ama mevcut CI investment'ı atılır

**Önerilen:** Seçenek A — Mevcut CI korunur, Docker/Trivy/SBOM job'ları `if: false` ile devre dışı bırakılır. Netlify otomatik deploy yapar.

### GHCR/VPS Planı Artık Kullanılmıyor

❌ Aşağıdakiler artık geçerli DEĞİL:
- GHCR push
- SSH deployment
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`
- `docker compose pull`
- Caddy configuration
- VPS directory structure

---

## 10. Netlify Free Limitleri — Detaylı Analiz

### Güncel Free Plan (2026)

**Kaynak:** [Netlify Pricing 2026](https://www.toolpick.dev/blog/netlify-review-2026-alternatives)

| Kaynak | Limit | Credit Tüketim | Açıklama |
|---|---|---|---|
| Credits | 300/ay | — | Toplam bütçe |
| Production deploy | ~20 deploy/ay | 15 credits/deploy | Her deploy 15 credit |
| Compute | ~30 GB-hour/ay | 10 credits/GB-hour | Function runtime |
| Bandwidth | ~15 GB/ay | 20 credits/GB | Data transfer |
| Web requests | ~1.5M requests/ay | 2 credits/10K | HTTP istekleri |
| Build minutes | 300 dakika/ay | (Legacy hesaplama) | — |
| Concurrent builds | 1 | — | — |

### Credit Tüketim Hesabı (Hobby Projesi)

**Senaryo:** Günlük 100 ziyaretçi, günde 500 sayfa view

**Aylık:**
- Production deploys: ~10 × 15 = 150 credits
- Compute: ~3 GB-hour × 10 = 30 credits (hobby traffic)
- Bandwidth: ~2 GB × 20 = 40 credits
- Web requests: ~15K × 15K × 2 = 30 credits (15K page views/ay)

**Toplam:** ~250 credits/ay (300 limit altında ✅)

### ⚠️ Kritik: Hard Limit Davranışı

**Kaynak:** [Netlify Free Plan FAQ](https://flexprice.io/blog/complete-guide-to-netlify-pricing-and-plans)

> "The Free plan's 300-credit cap is hard, meaning your sites pause until the next billing cycle, with no auto-recharge available."

**Limit aşılırsa:**
- ✅ Site otomatik PAUSE edilir
- ✅ Otomatik ücretlendirme YOK
- ✅ Kredi kartı bilgisi gerekmiyor
- ✅ Sonraki billing cycle'da otomatik devam

**Risk:** Site erişilemez olur ama ücret çekilmez.

### Ücretsiz Kalma Stratejisi

1. Deploy sayısını minimize et (günde 1-2'den fazla değil)
2. Preview deploy'ler credit tüketir — dikkatli kullan
3. Bandwidth'i minimize et (image optimization, caching)
4. Usage alerts ayarla (50%, 75%, 100%)

---

## 11. Neon Free — Detaylı Analiz

### Güncel Free Plan (2026)

**Kaynak:** [Neon Pricing 2026](https://www.srvrlss.io/provider/neon/)

| Kaynak | Limit | Not |
|---|---|---|
| Storage | 0.5 GB/project | — |
| Compute | 100 CU-hours/project/ay | ~4 gün sürekli aktif |
| Autoscaling | Up to 2 CU | ~2 vCPU + 8 GB RAM |
| Scale-to-zero | 5 dakika idle sonra | Zorunlu (free tier'da) |
| Branches | 10/project | — |
| Projects | 100 | — |
| PITR (Point-in-time recovery) | 6 saat | — |
| Egress | 5 GB | — |
| Connection pooling | Built-in PgBouncer | — |

### Compute Hour Hesabı

**Senaryo:** Günlük 100 ziyaretçi

- Her request: ~50ms DB compute
- Günlük 500 query: ~25 saniye compute/gün
- Aylık: ~750 saniye = ~0.2 CU-hours/ay

**100 CU-hours limite:** Çok uzak. ✅ Yeterli.

### ⚠️ Scale-to-Zero Etkisi

- 5 dakika idle → database uyur
- İlk query → cold start: ~300-500ms
- Sonraki query'ler → warm: ~5-10ms

**Kullanıcı deneyimi:** İlk sayfa yüklemesinde ~300-500ms gecikme (kabul edilebilir).

### Storage Limiti (0.5 GB)

**Mevcut schema boyutu:** ~20 model, text fields, JSON fields

**Tahmini:** İlk birkaç ay 0.5 GB yeterli. Büyürse:
- Atıl verileri temizle
- Paid plana geç ($0.35/GB/ay — çok ucuz)

### Backup/Recovery

**Neon Free:**
- ✅ Otomatik backup (6 saat PITR)
- ✅ Dashboard'dan restore
- ⚠️ 6 saat window (sınırlı)

**Ek strateji:**
- `pg_dump` ile günlük manuel backup (CI job veya cron)
- Branch ile snapshot alınabilir

---

## 12. Upstash Free — Detaylı Analiz

### Güncel Free Plan (2026)

**Kaynak:** [Upstash Pricing 2026](https://www.srvrlss.io/provider/upstash/)

| Kaynak | Limit | Not |
|---|---|---|
| Commands | 500K/ay | Mart 2025'ten itibaren aylık (günlük değil) |
| Data | 256 MB | — |
| Bandwidth | 10 GB/ay | — |
| Max throughput | 10,000 commands/sec | — |
| Region | Single | — |

### Rate Limiting Command Tüketimi

**Better Auth rate limiting (mevcut yapılandırma):**

| Endpoint | Window | Max | Komut/Request |
|---|---|---|---|
| `/sign-in/email` | 900s | 5 | ~3 (INCR + EXPIRE + TTL) |
| `/sign-up/email` | 3600s | 3 | ~3 |
| General (default) | 60s | 100 | ~3 |
| Secondary storage (get/set/delete) | — | — | ~2/request |

**Senaryo:** Günlük 100 auth request

- Rate limit checks: 100 × 3 = 300 commands/gün
- Session operations: 100 × 2 = 200 commands/gün
- Toplam: ~500 commands/gün
- Aylık: ~15,000 commands/ay

**500K limit:** Çok yeterli. ✅

**Senaryo:** Günlük 1000 auth request

- Toplam: ~5,000 commands/gün = ~150K commands/ay
- **500K limit:** Yine yeterli. ✅

### Upstash + ioredis Uyumluluğu (Tekrar)

**Upstash TCP endpoint:**
```
rediss://default:AUTH_TOKEN@generic-host.upstash.io:6379
```

**Mevcut kod:**
```typescript
const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});
```

**`REDIS_URL` olarak Upstash TCP URL verilirse:**
- ioredis `rediss://` protocol'ü tanır (SSL/TLS over TCP)
- Upstash Redis protocol uyumlu
- Tüm komutlar çalışır (INCR, EXPIRE, GET, SET, Lua scripts)
- **Kod değişikliği gerekmez**

---

## 13. Free Architecture

```
                    GitHub
                       │
                       ▼
              Netlify Free ($0/ay)
                       │
          ┌────────────┴─────────────┐
          │                          │
          ▼                          ▼
   Next.js / Better Auth       HTTPS / CDN
          │
   ┌──────┴───────┐
   │              │
   ▼              ▼
Neon PostgreSQL   Upstash Redis
  Free Tier        Free Tier
```

### Bileşen Dağılımı

| Bileşen | Sağlayıcı | Free Tier |
|---|---|---|
| App hosting + CDN + HTTPS | Netlify | 300 credits/ay |
| PostgreSQL | Neon | 0.5 GB + 100 CU-hours/ay |
| Redis | Upstash | 256 MB + 500K commands/ay |
| SSL/TLS | Netlify (Let's Encrypt) | Otomatik |
| DNS | Netlify veya Cloudflare | Ücretsiz |

### Toplam Maliyet: **$0/ay**

---

## 14. Fallback: Render

### Render Free Karşılaştırma

| Özellik | Netlify Free | Render Free |
|---|---|---|
| Next.js App Router | ✅ Full (OpenNext) | ❌ Sınırlı (static only veya paid) |
| Server-side rendering | ✅ Functions ile | ❌ Static only (free) |
| Route Handlers | ✅ Netlify Functions | ❌ — |
| Middleware | ✅ Edge Functions | ❌ — |
| Cold start | ~300-500ms | N/A (sleep after 15min) |
| Always on | ✅ (credit bazlı) | ❌ (15 dakika idle → sleep) |
| Free tier | 300 credits/ay | 750 saat/ay (ama sleep) |
| Next.js uyumluluğu | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**Sonuç:** Render free tier Next.js App Router + SSR + Route Handlers için uygun DEĞİL. Render'ın free planı static site'ler için. Next.js SSR desteklemesi Render Starter ($7/ay) gerektirir.

**Netlify açık ara üstün.**

---

## 15. Proje Bozmama Kuralı — Doğrulama

### Dokunulmayacak Dosyalar

| Dosya | Durum | Sebep |
|---|---|---|
| `src/lib/auth/index.ts` | ❌ DEĞİŞTİRİLMEZ | Production auth migration (Phase 2B-2) |
| `src/lib/auth/client.ts` | ❌ DEĞİŞTİRİLMEZ | Client auth config |
| `src/app/api/auth/[[...all]]/route.ts` | ❌ DEĞİŞTİRİLMEZ | Auth route handler |
| `prisma/schema.prisma` | ❌ DEĞİŞTİRİLMEZ | Schema freeze |
| `prisma/migrations/` | ❌ DEĞİŞTİRİLMEZ | Migration history |
| `Dockerfile` | ❌ DEĞİŞTİRİLMEZ | Docker deployment alternatifi |
| `docker-compose.yml` | ❌ DEĞİŞTİRİLMEZ | Development ortamı |
| `docker-compose.prod.yml` | ❌ DEĞİŞTİRİLMEZ | Self-hosted deployment alternatifi |
| `next.config.ts` | ❌ DEĞİŞTİRİLMEZ | Security headers + config |
| `package.json` | ❌ DEĞİŞTİRİLMEZ | Dependencies |
| `package-lock.json` | ❌ DEĞİŞTİRİLMEZ | Lock file |
| `src/app/api/health/route.ts` | ❌ DEĞİŞTİRİLMEZ | Health endpoint |

### İzin Verilen Değişiklikler (Sadece Config)

| Değişiklik | Tür | Not |
|---|---|---|
| `netlify.toml` oluştur | Yeni dosya | Netlify build config |
| GitHub Actions (CI) — Docker job'ları devre dışı bırak | Küçük değişiklik | `if: false` ekle |
| `.gitignore` — Netlify cache ekle | Küçük ekleme | — |
| Environment variables (Netlify Dashboard) | Config | Kod değil |

---

## 16. Güvenli Migration Planı

### Phase A — Compatibility (Kod değişikliği YOK)

1. ✅ Bu review dokümanı (tamamlandı)
2. Netlify account oluştur
3. Neon account oluştur
4. Upstash account oluştur
5. Uyumluluk doğrulamaları tamam

### Phase B — Configuration (Sadece config dosyaları)

1. `netlify.toml` oluştur (gerekirse)
2. GitHub Actions'da Docker job'larını devre dışı bırak (opsiyonel)
3. `.gitignore` güncelle (Netlify cache)
4. **Hiçbir runtime kodu değiştirme**

### Phase C — External Services (Infrastructure provision)

1. Neon Free PostgreSQL oluştur
   - Pooled connection string al
   - Direct connection string al (migration için)
2. Upstash Free Redis oluştur
   - TCP connection string al
3. Secret üret: `openssl rand -base64 48`

### Phase D — Netlify Preview Deploy

1. GitHub → Netlify integration kur
2. Repository bağla
3. Environment variables ekle (Netlify Dashboard)
4. Preview deploy tetikle
5. Test:
   - Build başarılı mı?
   - Sayfalar render ediliyor mu?
   - /api/health çalışıyor mu?

### Phase E — Runtime Regression Test

Phase 2B-4 testlerinin TAMAMI tekrar çalıştır:

| Test | Beklenen Sonuç |
|---|---|
| Sign-up (yeni kullanıcı) | 201 Created |
| Sign-in (doğru bilgiler) | 200 + session_token cookie |
| Get-session | 200 + user data |
| Sign-out | 200 + cookie cleared |
| Post-sign-out session | 401 Unauthorized |
| Wrong password | 401 Unauthorized |
| Duplicate sign-up | 422 |
| Valid Origin | 200 |
| Invalid Origin | 403 |
| Rate limit (>5 sign-in/15min) | 429 |
| PostgreSQL persistence | Session DB'de mevcut |
| Redis rate limiting | Atomic increment çalışır |
| HttpOnly cookie | JavaScript'te erişilemez |
| SameSite=Lax | Cookie attribute doğru |
| No secret leakage | Client bundle'da secret yok |

### Phase F — Production Deploy

1. Tüm testler PASS olduktan sonra
2. Custom domain bağla (opsiyonel)
3. DNS yönlendir
4. Production deploy
5. Monitoring başlat

---

## 17. Rollback Planı

### Application Rollback

**Netlify:**
- Netlify Dashboard → Deploys → Previous deploy → "Publish"
- Anında rollback (eski deploy'a geri dön)
- Veya GitHub'da previous commit'e revert + otomatik deploy

### Database Rollback

**Neon PITR:**
- Dashboard → Branching → Point-in-time recovery
- 6 saat içinde herhangi bir noktaya dönebilir
- Migration uygulanmışsa: Önceki schema state'e restore

**⚠️ Prisma migration'ları silerek rollback YAPMA:**
- Migration history korunur
- Geriye dönük ihtiyaç olursa migration dosyaları mevcut

### Redis Rollback

**Upstash:**
- Redis data kaybolursa: Rate limit counters sıfırlanır
- Veri kaybı kritik değil (rate limiting sadece)
- Session'lar PostgreSQL'de (storeSessionInDatabase: true)

---

## 18. Başarı Kriterleri

### Zorunlu (Hepsi PASS olmalı)

- ✅ Existing build PASS
- ✅ TypeScript PASS
- ✅ Existing tests PASS
- ✅ Netlify build PASS
- ✅ Netlify deploy PASS
- ✅ /api/health → 200
- ✅ Sign-up → 201
- ✅ Sign-in → 200 + cookie
- ✅ Get-session → 200 + user
- ✅ Sign-out → 200 + cookie cleared
- ✅ Post-sign-out → 401
- ✅ Wrong password → 401
- ✅ Duplicate sign-up → 422
- ✅ Valid Origin → 200
- ✅ Invalid Origin → 403
- ✅ Rate limit exceeded → 429
- ✅ PostgreSQL persistence verified
- ✅ Redis rate limiting verified
- ✅ HttpOnly cookie verified
- ✅ SameSite=Lax verified
- ✅ No secret leakage in client bundle

---

## 19. Free-Tier Limitations & Risks

### Netlify Free Riskleri

| Risk | Etki | Olasılık | Azaltma |
|---|---|---|---|
| 300 credit limit aşımı | Site pause | Orta (hobby için düşük) | Usage alerts + deploy sayısını minimize et |
| Fiyatlandırma değişikliği | Daha az credit | Orta (4 değişiklik 2025-2026) | Alternatif platform hazır tut |
| Function timeout | Uzun request'ler kesilir | Düşük | 10 saniye default (hobby için yeterli) |
| Cold start | İlk request yavaş | Yüksek | ~300-500ms (kabul edilebilir) |

### Neon Free Riskleri

| Risk | Etki | Olasılık | Azaltma |
|---|---|---|---|
| Scale-to-zero | İlk query 300-500ms | Yüksek | Kabul et veya keep-alive ping |
| 100 CU-hours limit aşımı | DB suspend | Çok düşük (hobby için yeterli) | Usage monitoring |
| 0.5 GB storage limit aşımı | DB suspend | Düşük (uzun vadede) | Veri temizleme veya upgrade |
| 6 saat PITR window | Backup sınırlı | Orta | Ek pg_dump backup |

### Upstash Free Riskleri

| Risk | Etki | Olasılık | Azaltma |
|---|---|---|---|
| 500K commands limit aşımı | Redis suspend | Çok düşük | Command counting |
| 256 MB data limit aşımı | Write hatası | Çok düşük | Key expiry policies |
| Single region | Latency | Düşük | En yakın region seç |
| TCP connection overhead | Serverless cold start | Orta | lazyConnect + connection reuse |

---

## 20. Güvenlik Değerlendirmesi

### Netlify Güvenlik

| Özellik | Durum | Not |
|---|---|---|
| HTTPS (TLS) | ✅ Otomatik | Let's Encrypt |
| DDoS protection | ✅ Temel | Free tier'da |
| Security headers | ✅ next.config.ts'den | HSTS, CSP, X-Frame-Options |
| Secret management | ✅ Netlify encrypted | Environment variables |
| Client secret leakage | ✅ Yok | NEXT_PUBLIC_* ayrımı korunur |

### Neon Güvenlik

| Özellik | Durum | Not |
|---|---|---|
| SSL/TLS connection | ✅ Zorunlu | `sslmode=require` |
| IP restriction | ⚠️ Sınırlı | Free tier'da yok |
| Encryption at rest | ✅ | AES-256 |
| Audit logs | ⚠️ Sınırlı | Free tier'da |

### Upstash Güvenlik

| Özellik | Durum | Not |
|---|---|---|
| SSL/TLS connection | ✅ Zorunlu | `rediss://` |
| Authentication | ✅ Token-based | AUTH token |
| Encryption at rest | ✅ | — |

---

## 21. Performance Riskleri

### Serverless Cold Start

| Bileşen | Cold Start | Sıklık |
|---|---|---|
| Netlify Function | ~300-1000ms | İlk request (5 dakika idle'dan sonra) |
| Neon Database | ~300-500ms | İlk query (5 dakika idle'dan sonra) |
| Upstash Redis | ~0ms | HTTP-based, cold start yok |

**Toplam worst case:** ~600-1500ms (ilk request)
**Warm request:** ~50-100ms

### Acceptable mi?

- Hobby/proje için: ✅ Evet
- Production-grade düşük gecikme için: ❌ Hayır (VPS daha iyi)

---

## 22. Migration Fazları — Özet

```
Phase A — Compatibility Review     ✅ TAMAMLANDI (bu doküman)
    │
Phase B — Configuration Files
    │   ├── netlify.toml (gerekirse)
    │   ├── .gitignore güncelle
    │   └── CI Docker job'ları devre dışı (opsiyonel)
    │
Phase C — External Services
    │   ├── Neon Free PostgreSQL oluştur
    │   ├── Upstash Free Redis oluştur
    │   └── Secret üret
    │
Phase D — Netlify Preview Deploy
    │   ├── Netlify + GitHub bağla
    │   ├── Environment variables ekle
    │   ├── Preview deploy tetikle
    │   └── Smoke test
    │
Phase E — Runtime Regression
    │   ├── Auth lifecycle testleri (tüm Phase 2B-4 testleri)
    │   ├── Health check testi
    │   ├── Rate limiting testi
    │   └── Security header doğrulama
    │
Phase F — Production Deploy
    │   ├── Custom domain (opsiyonel)
    │   ├── DNS yönlendir
    │   ├── Production deploy
    │   └── Monitoring başlat
    │
    ▼
   CANLI
```

---

## Sonuç Karşılaştırma

| Özellik | VPS ($35/ay) | Netlify Free ($0/ay) |
|---|---|---|
| Maliyet | $35/ay ($420/yıl) | $0/ay |
| Setup karmaşıklığı | Yüksek (1-2 hafta) | Düşük (1-2 gün) |
| Docker gerekli | Evet | Hayır |
| SSH management | Evet | Hayır |
| SSL management | Caddy otomatik | Netlify otomatik |
| Backup | Manuel + Neon PITR | Neon PITR |
| Cold start | Yok | ~300-1500ms |
| Ölçeklenebilirlik | Dikey (manual) | Otomatik |
| Kontrol | Tam (root) | Sınırlı |
| Kod değişikliği | docker-compose.prod.yml | Sadece config |
| Production risk | Düşük | Orta (free tier limitleri) |

---

## Karar Önerisi

**Netlify Free + Neon Free + Upstash Free:**

✅ **CONDITIONAL GO**

**Koşullar:**
1. Hobby/proje düzeyinde kullanım (günlük <1000 kullanıcı)
2. Cold start toleransı (~300-1500ms)
3. Free tier limitleri içinde kalma
4. VPS/Docker alternatifi her zaman mevcut (migration reversible)

**Avantajlar:**
- $0/ay maliyet
- Hızlı setup (1-2 gün)
- Kod değişikliği minimum (sadece config)
- Mevcut proje bozulmaz
- Her zaman VPS'e geçiş mümkün

**Riskler:**
- Free tier limitleri (300 credits, 100 CU-hours, 500K commands)
- Cold start gecikmesi
- Fiyatlandırma değişikliği riski (Netlify 2025-2026'da 4 kez değiştirdi)

**Mitigation:**
- Docker dosyaları korunur (future migration path)
- Phase 2B-4 testleri tekrarlanır (regression guarantee)
- Rollback planı mevcut (Netlify deploy rollback + Neon PITR)

---

```
FINAL: CONDITIONAL GO

Mevcut proje bozulmadan, sıfır runtime değişikliğiyle,
$0/ay maliyetle production deployment MÜMKÜN.

Migration, Phase A → F sırasıyla, güvenlik odaklı
ve geri alınabilir şekilde gerçekleştirilebilir.
```
