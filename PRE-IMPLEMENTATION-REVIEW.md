# Phase 1 — Pre-Implementation Review
## Production Code Hardening

**Tarih:** 2026-08-09  
**Kapsam:** 2 kod tarafı blocker + 1 non-blocking maintenance  
**Durum:** Pre-implementation review (kod değişikliği yapılmadı)

---

## 1. HSTS / HTTPS Security

### Mevcut Durum Analizi

**Dosya:** `next.config.ts` (satır 42-45)

```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload',
},
```

**Bulgu:** ⚠️ **HSTS zaten implement edilmiş!**

Gap analysis'te HSTS eksik olarak işaretlenmiş ama `next.config.ts` dosyasında production-grade HSTS header'ı mevcut:
- `max-age=31536000` (1 yıl)
- `includeSubDomains` (alt domain'leri de kapsar)
- `preload` (HSTS preload list'e eklenebilir)

### Development Ortamı Etkisi

**Soru:** Development'ta localhost'u etkiliyor mu?

**Cevap:** ❌ **Hayır, etkilemiyor.**

HSTS header'ı **sadece HTTPS bağlantılarda** tarayıcı tarafından dikkate alınır:
- `http://localhost:3000` → HTTP connection → HSTS header tarayıcı tarafından **yok sayılır**
- `https://example.com` → HTTPS connection → HSTS header **uygulanır**

Development ortamında HTTP kullanıldığı için HSTS header etkisiz. Production'da HTTPS terminasyonu reverse proxy (nginx, Caddy, vb.) tarafından yapılıyorsa, uygulama zaten HTTPS olarak çalışır ve HSTS header uygulanır.

### Reverse Proxy / Hosting Tarafında HSTS

**Soru:** Reverse proxy'de HSTS zaten sağlanıyorsa uygulama tarafında tekrar eklenmesi gerekiyor mu?

**Cevap:** ✅ **Uygulama tarafında kalması önerilir.**

**Nedenler:**
1. **Defense in depth:** Reverse proxy'de HSTS olmasa bile uygulama düzeyinde koruma sağlar
2. **Portability:** Farklı hosting provider'larda tutarlı security posture
3. **Redundancy:** Reverse proxy configuration hatası durumunda fallback
4. **Cost:** Minimal overhead (her response'a 1 header ekleniyor)

**Sonuç:** Uygulama tarafında HSTS kalacak. Reverse proxy'de de eklenebilir ama redundancy sağlar.

### Blocker Durumu Güncellemesi

**Önceki:** 🔴 BLOCKER (HSTS eksik)  
**Şimdiki:** ✅ **BLOCKER DEĞİL — Zaten implement edilmiş**

**Aksiyon:** **Yok.** HSTS zaten production-grade konfigürasyonda mevcut.

---

## 2. Production Environment Template

### Mevcut Durum Analizi

#### Environment Variable Tutarsızlığı

**Kritik Bulgu:** ⚠️ **Auth config'de kullanılan değişkenler env dosyalarında tanımlı değil!**

**Auth config (`src/lib/auth/index.ts`):**
```typescript
secret: process.env.BETTER_AUTH_SECRET,
baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
trustedOrigins: process.env.TRUSTED_ORIGINS
  ? process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"],
```

**`.env.example` ve `.env` dosyalarında:**
- ✅ `NEXTAUTH_URL` (tanımlı ama auth config'de **kullanılmıyor**)
- ✅ `NEXTAUTH_SECRET` (tanımlı ama auth config'de **kullanılmıyor**)
- ❌ `BETTER_AUTH_SECRET` (auth config'de kullanılıyor ama **tanımlı değil**)
- ❌ `BETTER_AUTH_URL` (auth config'de kullanılıyor ama **tanımlı değil**)
- ❌ `TRUSTED_ORIGINS` (auth config'de kullanılıyor ama **tanımlı değil**)

**Sonuç:** Better Auth migration'ından sonra legacy NextAuth değişkenleri kaldırılmamış ama yeni Better Auth değişkenleri de env dosyalarına eklenmemiş.

#### Variable Mapping

| Auth Config Kullanımı | .env.example | .env | Durum |
|----------------------|--------------|------|-------|
| `BETTER_AUTH_SECRET` | ❌ Yok | ❌ Yok | **Kritik: Production'da undefined** |
| `BETTER_AUTH_URL` | ❌ Yok | ❌ Yok | Fallback: `NEXT_PUBLIC_APP_URL` |
| `TRUSTED_ORIGINS` | ❌ Yok | ❌ Yok | Fallback: `http://localhost:3000` |
| `NEXTAUTH_URL` | ✅ Var | ✅ Var | **Legacy, kullanılmıyor** |
| `NEXTAUTH_SECRET` | ✅ Var | ✅ Var | **Legacy, kullanılmıyor** |

### Production Environment Template Gereklilikleri

`.env.production.example` oluşturulurken aşağıdaki değişkenler **mutlaka** dahil edilmeli:

#### Critical (Production'da zorunlu)

1. **`BETTER_AUTH_SECRET`**
   - Auth config'de kullanılıyor: `secret: process.env.BETTER_AUTH_SECRET`
   - Fallback yok — undefined ise auth çökebilir
   - Minimum 32 karakter, yüksek entropi
   - **Template:** `BETTER_AUTH_SECRET="change-this-to-a-random-64-char-string-in-production"`

2. **`DATABASE_URL`**
   - Prisma adapter'da kullanılıyor
   - Production PostgreSQL connection string
   - **Template:** `DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"`

3. **`REDIS_URL`**
   - Redis secondary storage'da kullanılıyor
   - Production Redis connection string
   - **Template:** `REDIS_URL="redis://host:6379"`

#### Important (Production'da önerilen)

4. **`BETTER_AUTH_URL`** (opsiyonel, fallback var)
   - Auth baseURL için
   - Fallback: `NEXT_PUBLIC_APP_URL`
   - **Template:** `BETTER_AUTH_URL="https://app.destinyrisinghub.com"`

5. **`NEXT_PUBLIC_APP_URL`**
   - Client-side auth config'de kullanılıyor (`src/lib/auth/client.ts`)
   - **Template:** `NEXT_PUBLIC_APP_URL="https://app.destinyrisinghub.com"`

6. **`TRUSTED_ORIGINS`** (opsiyonel, fallback var)
   - CORS/CSRF koruması için
   - Comma-separated list
   - Fallback: `http://localhost:3000`
   - **Template:** `TRUSTED_ORIGINS="https://app.destinyrisinghub.com,https://www.destinyrisinghub.com"`

7. **`NODE_ENV`**
   - Production: `production`
   - **Template:** `NODE_ENV="production"`

#### Optional (Feature-specific)

8. **OAuth credentials** (disabled, credentials yok)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   - `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`

9. **Monitoring**
   - `SENTRY_DSN=""`

10. **Email**
    - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`

11. **Storage**
    - `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_ENDPOINT`

### Legacy Variable Temizliği

**Soru:** `NEXTAUTH_URL` ve `NEXTAUTH_SECRET` kaldırılmalı mı?

**Analiz:**
- Auth config'de **kullanılmıyorlar**
- Better Auth migration'ından sonra obsolete
- Ama `.env` dosyalarında var (development environment)
- Docker Compose'da `NEXTAUTH_URL` ve `NEXTAUTH_SECRET` kullanılıyor (legacy)

**Karar:** ⚠️ **Bu PR'da dokunma.**

**Neden:**
1. Docker Compose'da hala kullanılıyor olabilir (kontrol edilmedi)
2. Breaking change riski
3. Scope creep — bu PR sadece production template odaklı
4. Legacy variable temizliği ayrı bir maintenance PR olmalı

**Aksiyon:** `.env.production.example`'da **sadece Better Auth değişkenleri** olacak. Legacy NextAuth değişkenleri eklenmeyecek.

### Template Stratejisi

`.env.production.example` oluşturulurken:

1. ✅ Sadece placeholder/template değerleri
2. ✅ Gerçek secret değerleri **kesinlikle yok**
3. ✅ Mevcut variable isimleri korunuyor (değiştirilmiyor)
4. ✅ Production için gerekli minimum set
5. ✅ Kategorize edilmiş (Critical / Important / Optional)
6. ✅ Her değişken için açıklama yorumu

**Olmayacak:**
- ❌ Gerçek production değerleri
- ❌ Development-specific değerler (localhost, vs.)
- ❌ Legacy NextAuth değişkenleri (scope dışı)
- ❌ Performance testing değişkenleri (production'da gerekmez)

### Blocker Durumu

**Önceki:** 🔴 BLOCKER (production environment template eksik)  
**Şimdiki:** 🔴 **BLOCKER — Hala eksik**

**Aksiyon:** `.env.production.example` oluştur

---

## 3. docker-compose.yml version Cleanup (Non-Blocking Maintenance)

### Mevcut Durum

**Dosya:** `docker-compose.yml` (satır 1)

```yaml
version: '3.8'
```

### Problem

Docker Compose v2+ (2023+) `version` field'ı **deprecated** olarak işaretliyor:
- Uyarı: `version` field is obsolete, compose specification is used instead
- Fonksiyonel etkisi yok — sadece cosmetic warning
- Docker Compose v2+ otomatik olarak compose specification kullanıyor

### Risk Analizi

**Risk seviyesi:** 🟢 **Düşük**
- Fonksiyonel etkisi yok
- Breaking change riski yok
- Sadece warning kaldırma

### Scope Ayrımı

**Önemli:** Bu değişiklik **blocker ile aynı PR'da yapılmamalı.**

**Neden:**
1. Blocker (production template) ile non-blocking maintenance aynı seviyede değil
2. Git history'de farklı amaçlarla ayrıştırmak önemli
3. Review süreci farklı (blocker kritik, maintenance optional)

**Karar:** Ayrı bir maintenance commit/PR olarak işaretle.

### Aksiyon

**Şimdilik:** **Yok.** Bu PR kapsamı dışında.

**Sonra:** Ayrı maintenance PR'da `version: '3.8'` satırını kaldır.

---

## Özet: Pre-Implementation Review

### Blocker Status Güncellemesi

| # | Blocker | Önceki Durum | Şimdiki Durum | Aksiyon |
|---|---------|--------------|---------------|---------|
| 1 | HSTS header | 🔴 BLOCKER | ✅ **BLOCKER DEĞİL** | Yok (zaten var) |
| 2 | Production env template | 🔴 BLOCKER | 🔴 **BLOCKER** | `.env.production.example` oluştur |

### Kod Tarafı Aksiyonlar

**Bu PR'da yapılacak:**
1. `.env.production.example` oluştur
   - Critical variables: `BETTER_AUTH_SECRET`, `DATABASE_URL`, `REDIS_URL`
   - Important variables: `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `TRUSTED_ORIGINS`
   - Optional variables: OAuth, SMTP, S3, Sentry
   - Placeholder değerler, gerçek secret yok
   - Kategorize edilmiş, yorumlu

**Bu PR'da yapılmayacak:**
1. ~~HSTS header ekleme~~ (zaten var)
2. Legacy NextAuth variable temizliği (scope dışı)
3. `docker-compose.yml` version cleanup (ayrı maintenance PR)

### Schema Freeze Kontrolü

✅ **Prisma schema değişikliği:** Yok  
✅ **Auth lifecycle değişikliği:** Yok  
✅ **session_token contract:** Dokunulmuyor  
✅ **Redis rate limiting:** Dokunulmuyor  
✅ **storeSessionInDatabase:** Dokunulmuyor  

### Security Headers Mevcut Durum

`next.config.ts`'de mevcut security headers:

| Header | Değer | Durum |
|--------|-------|-------|
| `X-Frame-Options` | `DENY` | ✅ Production-grade |
| `X-Content-Type-Options` | `nosniff` | ✅ Production-grade |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ Production-grade |
| `X-XSS-Protection` | `1; mode=block` | ✅ Production-grade (deprecated ama hala etkili) |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | ✅ **Production-grade (zaten var!)** |
| `Content-Security-Policy` | restrictive policy | ✅ Production-grade |
| `Permissions-Policy` | restrictive policy | ✅ Production-grade |

**Sonuç:** Tüm security headers production-grade. HSTS dahil.

### Risk Değerlendirmesi

**`.env.production.example` oluşturma riski:** 🟢 **Düşük**
- Sadece template dosyası
- Runtime etkisi yok
- Breaking change riski yok
- Dokümantasyon amaçlı

**Bağımlılıklar:**
- DevOps: Production environment variable'ları set etmeli
- DevOps: `BETTER_AUTH_SECRET` üretmeli (min 32 char, high entropy)
- DevOps: `DATABASE_URL` ve `REDIS_URL` production değerleri sağlamalı

### Öneri

**İlerle:** ✅ Evet, `.env.production.example` oluştur.

**Scope:**
- Sadece 1 dosya: `.env.production.example`
- Sadece template/placeholder değerler
- Kategorize edilmiş, yorumlu
- Critical variables vurgulanmış

**Sonrası:**
- Ayrı maintenance PR: Legacy NextAuth variable temizliği
- Ayrı maintenance PR: `docker-compose.yml` version cleanup
- DevOps: Production environment provisioning

---

## Appendix: Environment Variable Referansı

### Auth Config Kullanımı (`src/lib/auth/index.ts`)

```typescript
secret: process.env.BETTER_AUTH_SECRET,
baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
trustedOrigins: process.env.TRUSTED_ORIGINS
  ? process.env.TRUSTED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"],
```

### Client Config Kullanımı (`src/lib/auth/client.ts`)

```typescript
baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
```

### Redis Config Kullanımı (`src/lib/auth/index.ts`)

```typescript
const redis = new Redis(process.env.REDIS_URL || "redis://redis:6379", {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});
```

### Database Config Kullanımı (`src/lib/auth/index.ts`)

```typescript
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
```

---

**Review tamamlandı.**  
**Sonraki adım:** `.env.production.example` oluştur (kod değişikliği, bu review'dan sonra).
