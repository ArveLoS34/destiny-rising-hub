# Phase B — Pre-Implementation Review
## $0/ay Netlify Deployment

**Tarih:** 2026-08-09  
**Durum:** PRE-IMPLEMENTATION REVIEW (kod değişikliği yapılmadı)

---

## A. Mevcut Git Durumu

```
Branch:     feature/rc3-performance
HEAD:       a6810a1f4a1c170634d89983c346c8edb83ce8ba (sandbox local)
Remote:     83ab46c336267372edd0779dfa49895d872f67d3 (kullanıcı terminalinde push)
```

**Not:** Sandbox ve remote farklı commit'lerde — kullanıcı `.env.production.example`'ı kendi terminalinde farklı hash ile commit etmiş. Bu normal.

**Çalışma ağacı:**

```
Değiştirilmiş (tracked):
  M .github/workflows/ci.yml    ← Önceki oturumda düzenlenmiş
  M .gitignore                   ← Önceki oturumda düzenlenmiş

Yeni dosyalar (untracked):
  ?? netlify.toml                ← Önceki oturumda oluşturulmuş
  ?? DEPLOYMENT-ARCHITECTURE-REVIEW.md
  ?? DEPLOYMENT-IMPLEMENTATION-PLAN.md
  ?? NETLIFY-FREE-COMPATIBILITY-REVIEW.md
  ?? NEXT-PHASE-REVIEW.md
  ?? PHASE1-FINAL-GIT-REVIEW.md
  ?? PRE-IMPLEMENTATION-REVIEW.md
  ?? PRODUCTION-DEVOPS-REVIEW.md
  ?? PRODUCTION-READINESS-GAP-ANALYSIS.md
  ?? RELEASE-READINESS-ASSESSMENT.md
```

**ÖNEMLİ:** Sandbox'ta `ci.yml`, `.gitignore` ve `netlify.toml` zaten düzenlenmiş/oluşturulmuş. Bu değişiklikler önceki oturumda yapılmış. Implementasyona geçilmeden önce bu değişikliklerin gözden geçirilmesi gerekiyor.

---

## B. Build/Dependency Durumu

### package.json Analizi

| Script | Komut | Netlify Uyumluluğu |
|---|---|---|
| `build` | `next build` | ✅ Netlify bu komutu çalıştırır |
| `start` | `next start` | ❌ Netlify'de kullanılmaz (serverless) |
| `dev` | `next dev` | ❌ Sadece local development |
| `lint` | `eslint` | ✅ CI'da kullanılır |
| `db:generate` | `prisma generate` | ✅ CI build adımı |
| `db:push` | `prisma db push` | ✅ Migration alternatifi |
| `db:migrate` | `prisma migrate dev` | ⚠️ Development only (CI'da kullanılmaz) |

### Kritik Dependencies

| Paket | Sürüm | Netlify Uyumluluğu | Not |
|---|---|---|---|
| `next` | 16.3.0 | ✅ Full support | OpenNext adapter |
| `react` | 19.2.8 | ✅ — | — |
| `prisma` | 7.9.1 | ✅ — | Build sırasında generate gerekli |
| `@prisma/client` | 7.9.1 | ✅ — | Runtime |
| `@prisma/adapter-pg` | 7.9.1 | ✅ — | PostgreSQL driver adapter |
| `pg` | 8.22.0 | ✅ — | Node.js PostgreSQL client |
| `better-auth` | 1.6.25 | ✅ — | Serverless uyumlu |
| `@better-auth/redis-storage` | 1.6.26 | ⚠️ CONDITIONAL | ioredis kullanır (TCP) |
| `ioredis` | 5.11.1 | ⚠️ CONDITIONAL | TCP — Upstash ile çalışır ama overhead |
| `bcryptjs` | 3.0.3 | ✅ — | — |
| `zod` | 4.4.3 | ✅ — | — |

### Next.js Sürümü: 16.3.0

Netlify resmi dokümantasyonu Next.js 16.x'in tüm App Router özelliklerini destekliyor.

### `output: 'standalone'` Durumu

```typescript
// next.config.ts (satır 4)
output: 'standalone',
```

**Etki:**
- Dockerfile runner stage: `.next/standalone` dizinini kopyalar
- Netlify: OpenNext adapter `.next` dizinini kendi formatına dönüştürür
- **Uyumluluk:** ✅ Netlify bu konfigürasyonla çalışır — `output: 'standalone'` Netlify plugin'i tarafından handle edilir

**Kod değişikliği:** ❌ GEREKLİ DEĞİL

### Prisma Build Sırasında

CI build job'ında:
```yaml
- run: npx prisma generate
- run: npm run build
```

**Netlify'de:** Build command `npm run build`. Prisma generate otomatik çalışmaz.

**Risk:** Prisma Client oluşturulmazsa build başarısız olabilir.

**Çözüm seçenekleri:**
1. `netlify.toml`'de build command'ı güncelle: `npx prisma generate && npm run build`
2. `package.json`'da `postinstall` script ekle (DOKUNULMAZ kuralı gereği seçenek 1 tercih edilir)
3. Netlify'nin otomatik algılamasına güven (Prisma'yı algılayıp generate edebilir)

**Öneri:** Seçenek 1 — `netlify.toml`'de build command güncelle. `package.json`'a dokunulmaz.

---

## C. CI Job Dependency Grafiği

### Mevcut Durum (Önceki oturumda düzenlenmiş)

```
                    ┌──────────────────────────┐
                    │   Stage 1: Quality Gates │
                    ├──────────────────────────┤
                    │ lint                     │ ← Bağımsız
                    │ security-audit           │ ← Bağımsız
                    │ dependency-review (PR)   │ ← Bağımsız
                    │ license-check            │ ← Bağımsız
                    │ secret-scan (Gitleaks)   │ ← Bağımsız
                    └──────────┬───────────────┘
                               │
                    ┌──────────┴───────────────┐
                    │   Stage 2: Tests         │
                    ├──────────────────────────┤
                    │ unit-tests               │ ← needs: [lint, security-audit, secret-scan]
                    │ integration-tests        │ ← needs: [lint, security-audit, secret-scan]
                    └──────────┬───────────────┘
                               │
                    ┌──────────┴───────────────┐
                    │   Stage 3: Build         │
                    ├──────────────────────────┤
                    │ build                    │ ← needs: [unit-tests, integration-tests]
                    └──────────┬───────────────┘
                               │
                    ┌──────────┴───────────────┐
                    │   Stage 4: (REMOVED)     │
                    ├──────────────────────────┤
                    │ Comment only             │
                    │ "Docker/Trivy/SBOM/VPS   │
                    │  deploy removed —        │
                    │  Netlify deployment"     │
                    └──────────────────────────┘
```

### Kaldırılan Job'lar (önceki oturumda)

| Job | Eski `needs:` | Durum |
|---|---|---|
| `docker-build` | `[build]` | ❌ KALDIRILDI |
| `trivy-scan` | `[docker-build]` | ❌ KALDIRILDI |
| `sbom-generation` | `[build]` | ❌ KALDIRILDI |
| `deploy-staging` | `[docker-build, trivy-scan, sbom-generation]` | ❌ KALDIRILDI |
| `deploy-production` | `[docker-build, trivy-scan, sbom-generation]` | ❌ KALDIRILDI |

### Kalan Job'lar (8 adet)

1. `lint` — eslint + tsc --noEmit
2. `security-audit` — npm audit
3. `dependency-review` — PR'larda dependency review
4. `license-check` — license compliance
5. `secret-scan` — Gitleaks
6. `unit-tests` — Jest (unit + components)
7. `integration-tests` — Jest (PostgreSQL service ile)
8. `build` — next build

**Dependency zinciri doğru.** Docker/deploy job'ları zincirin ucundaydı — kaldırıldığında üstteki job'lar etkilenmez.

### CI Dosya Boyutu

- **Önceki:** 306 satır
- **Şimdiki:** 191 satır (-115 satır)

---

## D. Netlify İçin Gerekli Config

### netlify.toml Gereklilik Analizi

**Netlify otomatik algılama:**
- ✅ Next.js projesini otomatik algılar
- ✅ OpenNext adapter'ı otomatik uygular
- ✅ Build command otomatik algılanır (`npm run build`)
- ✅ Publish directory otomatik algılanır (`.next`)
- ✅ Plugin otomatik yüklenir (`@netlify/plugin-nextjs`)

**netlify.toml gerekli mi?**

| Konfigürasyon | Otomatik | netlify.toml ile |
|---|---|---|
| Build command | ✅ | ✅ Belgeleme |
| Publish directory | ✅ | ✅ Belgeleme |
| Plugin | ✅ | ✅ Belgeleme |
| NODE_VERSION | ✅ (runtime detection) | ✅ Explicit |
| www redirect | ❌ | ✅ Manuel |
| Security headers | ✅ (next.config.ts'den) | ⚠️ Çift header riski |

**Karar:** ⚠️ **netlify.toml GEREKLİ ama mevcut haliyle revizyon gerekli.**

### Mevcut netlify.toml Sorunları

1. **Header çakışması riski:**
   - `next.config.ts` zaten X-Frame-Options, X-Content-Type-Options, Referrer-Policy tanımlıyor
   - `netlify.toml`'de aynı header'ları tekrarlamak redundancy
   - Çift header bazı tarayıcılarda sorun yaratabilir

2. **Build command eksikliği:**
   - `npm run build` yeterli değil — `npx prisma generate` da gerekli
   - Prisma Client oluşturulmadan build başarısız olabilir

3. **`NPM_FLAGS = "--legacy-peer-deps"`:**
   - Gerekli mi kontrol edilmeli
   - `package-lock.json` mevcut — `npm ci` kullanılıyor CI'da
   - `--legacy-peer-deps` peer dependency çakışmalarını bypass eder

### Önerilen netlify.toml Revizyonu

```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

# Prisma dummy DATABASE_URL (generate için gerekli)
# Gerçek DATABASE_URL Netlify Dashboard'dan set edilir
[build.environment]
  NODE_VERSION = "20"
  DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/dummy"
```

**Not:** `DATABASE_URL` build sırasında dummy olarak verilir. Gerçek connection string runtime'da Netlify Dashboard'dan gelir.

---

## E. Değiştirilmesi Gereken Dosyalar

| # | Dosya | İşlem | Durum |
|---|---|---|---|
| 1 | `netlify.toml` | REVİZE | Önceki oturumda oluşturulmuş ama revizyon gerekli |
| 2 | `.github/workflows/ci.yml` | ✅ TAMAMLANDI | Docker/deploy job'ları kaldırılmış |
| 3 | `.gitignore` | ✅ TAMAMLANDI | `.env.production` ve `.netlify/` eklenmiş |

**Toplam:** 3 dosya. 2'si zaten tamamlandı, 1'i revizyon bekliyor.

---

## F. Değiştirilmemesi Gereken Dosyalar

| Dosya | Durum | Sebep |
|---|---|---|
| `src/lib/auth/index.ts` | ✅ Dokunulmadı | Production auth (Phase 2B-2) |
| `src/lib/auth/client.ts` | ✅ Dokunulmadı | Client auth config |
| `src/app/api/auth/[[...all]]/route.ts` | ✅ Dokunulmadı | Auth route handler |
| `prisma/schema.prisma` | ✅ Dokunulmadı | Schema freeze |
| `prisma/migrations/*` | ✅ Dokunulmadı | Migration history |
| `Dockerfile` | ✅ Dokunulmadı | Docker deployment alternatifi |
| `docker-compose.yml` | ✅ Dokunulmadı | Development ortamı |
| `docker-compose.prod.yml` | ✅ Dokunulmadı | Self-hosted alternatifi |
| `next.config.ts` | ✅ Dokunulmadı | Security headers + config |
| `package.json` | ✅ Dokunulmadı | Dependencies |
| `package-lock.json` | ✅ Dokunulmadı | Lock file |
| `src/app/api/health/route.ts` | ✅ Dokunulmadı | Health endpoint |

---

## G. Riskler

### 1. Prisma Generate — Build Başarısızlığı ⚠️ RİSKLİ

**Sorun:** Netlify build sırasında `npx prisma generate` otomatik çalışmayabilir.

**Etki:** Build başarısız olur — Prisma Client oluşturulmamış.

**Olasılık:** Orta

**Azaltma:** `netlify.toml`'de build command'ı `npx prisma generate && npm run build` olarak güncelle.

**Alternatif:** Netlify'nin Prisma plugin'i varsa otomatik generate edebilir — preview deploy'da test et.

### 2. DATABASE_URL — Build Sırasında Gerekli ⚠️ RİSKLİ

**Sorun:** `prisma generate` (veya `prisma db push`) DATABASE_URL gerektirebilir.

**Etki:** Build sırasında dummy DATABASE_URL sağlanmazsa hata.

**Olasılık:** Orta

**Azaltma:** `netlify.toml`'de `DATABASE_URL` dummy value olarak set et. Gerçek değer runtime'da Dashboard'dan gelir.

**Not:** Dockerfile'da da aynı yaklaşım kullanılıyor:
```dockerfile
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
```

### 3. output: 'standalone' — Netlify Uyumluluğu 🟢 DÜŞÜK RİSK

**Sorun:** `next.config.ts`'de `output: 'standalone'` var.

**Etki:** Netlify OpenNext adapter bu konfigürasyonu handle eder.

**Olasılık (sorun):** Düşük

**Azaltma:** Preview deploy'da test et. Sorun çıkarsa `output` kaldır — ama bu next.config.ts değişikliği gerektirir (istenmeyen).

### 4. ioredis + Netlify Serverless 🟡 ORTA RİSK

**Sorun:** `ioredis` TCP connection kullanıyor. Serverless cold start'larda overhead.

**Etki:** İlk request ~5-15ms yavaşlar. Warm start'larda connection reuse mümkün.

**Olasılık (sorun):** N/A — overhead kaçınılmaz ama kabul edilebilir.

**Azaltma:** Kod değişikliği gerekmez. `REDIS_URL` olarak Upstash TCP endpoint kullan.

### 5. netlify.toml Header Çakışması 🟡 ORTA RİSK

**Sorun:** `next.config.ts` ve `netlify.toml` aynı header'ları tanımlayabilir.

**Etki:** Çift header bazı tarayıcılarda sorun yaratabilir.

**Olasılık:** Orta

**Azaltma:** `netlify.toml`'den security headers'ı kaldır — `next.config.ts` zaten tanımlıyor.

### 6. Neon Scale-to-Zero 🟢 DÜŞÜK RİSK

**Sorun:** Neon free tier 5 dakika idle sonrası scale-to-zero.

**Etki:** İlk query ~300-500ms gecikme.

**Olasılık:** Yüksek (kaçınılmaz)

**Azaltma:** Kabul et — hobby projesi için acceptable.

---

## H. Önerilen Phase B Değişiklikleri

### Zaten Tamamlanmış (önceki oturumda)

| Dosya | İşlem | Durum |
|---|---|---|
| `.github/workflows/ci.yml` | Docker/deploy job'ları kaldırıldı | ✅ İNCELE |
| `.gitignore` | `.env.production` ve `.netlify/` eklendi | ✅ İNCELE |

### Revizyon Bekleyen

| Dosya | İşlem | Durum |
|---|---|---|
| `netlify.toml` | Build command + Prisma + header düzeltme | ⏸️ BEKLEMEDE |

### Önerilen netlify.toml Revizyonu

```toml
# Netlify Configuration
# https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
#
# Netlify Next.js projelerini otomatik algılar ve OpenNext adapter ile
# SSR, Route Handlers, Server Actions, Middleware ve ISR destekler.
#
# Deployment: $0/ay (Netlify Free + Neon Free + Upstash Free)

[build]
  # Prisma generate + Next.js build
  command = "npx prisma generate && npm run build"
  publish = ".next"

# Next.js plugin — otomatik yüklenir, belgelendirme amaçlı
[[plugins]]
  package = "@netlify/plugin-nextjs"

# Build environment
[build.environment]
  NODE_VERSION = "20"
  # Prisma generate için dummy DATABASE_URL (gerçek değer runtime'da Dashboard'dan gelir)
  DATABASE_URL = "postgresql://dummy:dummy@localhost:5432/dummy"

# Redirect: www → non-www
[[redirects]]
  from = "https://www.destinyrisinghub.com/*"
  to = "https://destinyrisinghub.com/:splat"
  status = 301
  force = true

# Not: Security headers next.config.ts'de tanımlı — burada tekrarlanmadı (çift header riski)
```

**Değişiklikler:**
- ✅ Build command'a `npx prisma generate` eklendi
- ✅ Dummy DATABASE_URL eklendi
- ✅ Security headers kaldırıldı (next.config.ts zaten tanımlıyor)
- ✅ `NPM_FLAGS` kaldırıldı (CI'da `npm ci` kullanılıyor — gerek yok)

---

## Özet Karar Matrisi

| Konu | Karar | Risk |
|---|---|---|
| CI Docker/deploy job'ları | ✅ Kaldırıldı (önceki oturum) | Yok |
| netlify.toml | ⚠️ Revizyon gerekli | Orta |
| .gitignore | ✅ Tamamlandı (önceki oturum) | Yok |
| Prisma generate | ⚠️ Build command'a ekle | Orta |
| Dummy DATABASE_URL | ⚠️ netlify.toml'e ekle | Orta |
| output: 'standalone' | ✅ Dokunma (Netlify handle eder) | Düşük |
| ioredis + Upstash | ✅ Kod değişikliği yok | Düşük |
| Security headers | ✅ next.config.ts'ten kullan (netlify.toml'den kaldır) | Orta |

---

```
PRE-IMPLEMENTATION REVIEW READY

Mevcut durum:
  - CI: Docker/deploy job'ları kaldırılmış (önceki oturumda)
  - .gitignore: Güncellenmiş (önceki oturumda)
  - netlify.toml: Oluşturulmuş ama REVİZYON GEREKLİ

İzleyen adım:
  1. netlify.toml revizyonu (build command + Prisma + header düzeltme)
  2. Tüm değişiklikleri gözden geçir
  3. Commit/push
  4. Neon + Upstash oluştur
  5. Netlify Dashboard'da env variables tanımla
  6. Preview deploy + regression test

Dokunulmayacak dosyalar: HEPSİ KORUNDU ✅
```
