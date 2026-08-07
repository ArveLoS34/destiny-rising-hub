# RC-4 Güvenlik Değerlendirme ve Geçiş Tasarım Raporu

**Proje:** Destiny Rising Hub  
**Tarih:** 2026-08-07  
**Branch:** feature/rc3-performance  
**Durum:** Kod incelemesi tamamlandı, gerçek ortam doğrulaması bekliyor

---

## 1. Güvenlik Bulgularının Sınıflandırılması

### 🔴 CRITICAL

| # | Bulgu | Durum | Çözüm Aşaması |
|---|-------|-------|---------------|
| C-1 | Security headers eksikliği (CSP, HSTS, Permissions-Policy) | ✅ GİDERİLDİ (e710c5e) | RC-4 |
| C-2 | CSRF koruması yok | ✅ GİDERİLDİ (e710c5e) | RC-4 |
| C-3 | Password hashing uygulanmamıştı | ✅ GİDERİLDİ (b9fee8b) | RC-4 |

**Çözüm detayları:**
- **C-1:** `next.config.ts`'e CSP, HSTS (`max-age=31536000; includeSubDomains; preload`), Permissions-Policy eklendi. Mevcut X-Frame-Options=DENY, X-Content-Type-Options=nosniff, Referrer-Policy, X-XSS-Protection korundu.
- **C-2:** Double-submit cookie pattern uygulandı. CSRF token `generateCsrfToken()` ile üretiliyor, `csrf_token` cookie'sinde (non-HttpOnly) saklanıyor, `X-CSRF-Token` header'ında doğrulanıyor. Timing-safe karşılaştırma kullanılıyor.
- **C-3:** bcryptjs ile SALT_ROUNDS=10 uygulanmış durumda.

---

### 🟠 HIGH

| # | Bulgu | Durum | Çözüm Aşaması |
|---|-------|-------|---------------|
| H-1 | In-memory session yönetimi (restart'ta kaybolur) | ⚠️ TASARIM HAZIR | RC-5 (Better Auth) |
| H-2 | In-memory rate limiting (restart'ta sıfırlanır) | ⚠️ TASARIM HAZIR | RC-5 (Better Auth) |
| H-3 | Session rotation manuel (otomatik değil) | ✅ KISMİ GİDERİLDİ | RC-5'de Better Auth otomatik yapacak |

**Çözüm detayları:**
- **H-1:** Session'lar `Map<string, {userId, expiresAt}>` içinde tutuluyor. Production'da Better Auth + Prisma Session modeline taşınacak (aşağıda detaylı tasarım var).
- **H-2:** Rate limiting `Map<string, {count, firstAttempt}>` içinde tutuluyor. Redis-tabanlı çözüm tasarımı aşağıda.
- **H-3:** `refreshSession()` mevcut (eski token silinip yenisi oluşturuluyor). Better Auth otomatik session rotation sağlayacak.

---

### 🟡 MEDIUM

| # | Bulgu | Durum | Çözüm Aşaması |
|---|-------|-------|---------------|
| M-1 | IP-based rate limiting yok (sadece email-based) | ⚠️ BEKLEMEDE | RC-5 |
| M-2 | Common password check yok | 📋 PLANLANIYOR | RC-6+ |
| M-3 | Breached password check yok | 📋 PLANLANIYOR | RC-6+ |
| M-4 | Email domain validation yok (disposable email) | 📋 PLANLANIYOR | RC-6+ |
| M-5 | Session revocation (tüm oturumları kapat) yok | ⚠️ BEKLEMEDE | RC-5 |

---

### 🟢 LOW

| # | Bulgu | Durum | Çözüm Aşaması |
|---|-------|-------|---------------|
| L-1 | CSP'de `unsafe-inline` ve `unsafe-eval` var | ⚠️ KABUL EDİLDİ | RC-6+ (Next.js optimizasyonu) |
| L-2 | Rate limit window sabit (sliding window değil) | ⚠️ BEKLEMEDE | RC-5 (Redis ile çözülür) |
| L-3 | Session token formatı tahmin edilebilir (`Date.now()` + `Math.random()`) | ⚠️ KABUL EDİLDİ | RC-5 (Better Auth `crypto.randomBytes` kullanır) |

---

## 2. Security Headers Durumu (RC-4 ✅)

```typescript
// next.config.ts - Güncel hali
{
  key: 'X-Frame-Options',           value: 'DENY'                          // ✅ Clickjacking koruması
  key: 'X-Content-Type-Options',    value: 'nosniff'                       // ✅ MIME sniffing koruması
  key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' // ✅
  key: 'X-XSS-Protection',          value: '1; mode=block'                // ✅ Legacy XSS koruması
  key: 'Strict-Transport-Security',  value: 'max-age=31536000; includeSubDomains; preload' // ✅ HSTS
  key: 'Content-Security-Policy',    value: "default-src 'self'; ..."       // ✅ CSP
  key: 'Permissions-Policy',         value: 'camera=(), microphone=(), ...' // ✅ API kısıtlama
}
```

**CSP detayı:**
```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https://*.destinyrisinghub.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

**Not:** `unsafe-inline` ve `unsafe-eval` Next.js'in dev mode'da çalışması için gereklidir. Production'da nonce-based CSP'ye geçilecek (L-1 olarak sınıflandırıldı).

---

## 3. CSRF Koruması (RC-4 ✅)

### Mimari

```
┌────────────┐                              ┌────────────┐
│   Client   │                              │   Server   │
└─────┬──────┘                              └─────┬──────┘
      │  POST /api/auth (sign-in)                 │
      │──────────────────────────────────────────>│
      │                                           │  ✓ Password verify
      │                                           │  ✓ Create session
      │                                           │  ✓ Generate CSRF token
      │  Set-Cookie: session_token=... (HttpOnly)  │
      │  Set-Cookie: csrf_token=abc123            │
      │  Body: { user, csrfToken: "abc123" }       │
      │<──────────────────────────────────────────│
      │                                           │
      │  POST /api/auth (sign-out)                │
      │  Cookie: csrf_token=abc123                │
      │  Header: X-CSRF-Token: abc123             │
      │──────────────────────────────────────────>│
      │                                           │  ✓ Compare cookie vs header
      │                                           │  ✓ timingSafeEqual()
      │  { success: true }                         │
      │<──────────────────────────────────────────│
```

### Korunan Endpoint'ler

| Action | CSRF Gerekli? | Neden? |
|--------|--------------|--------|
| sign-in | ❌ Hayır | Kullanıcı henüz auth olmamış |
| sign-up | ❌ Hayır | Kullanıcı henüz auth olmamış |
| sign-out | ✅ Evet | Session sonlandırma (state-changing) |
| demo-login | ❌ Hayır | Dev-only, zaten auth oluşturma |
| refresh-session | ✅ Evet | Token rotation (state-changing) |
| validate-session (GET) | ❌ Hayır | Read-only operasyon |

### SameSite=Strict Katmanı

CSRF token'a ek olarak `SameSite=Strict` cookie flag'i zaten cross-site isteklerde cookie'nin gönderilmesini engeller. Bu, CSRF'ye karşı **iki katmanlı koruma** sağlar:
1. SameSite=Strict (cookie-level)
2. CSRF token validation (application-level)

---

## 4. Session Management: In-Memory → Database Geçiş Tasarımı

### Mevcut Durum (Mock Auth)

```typescript
// auth-service.ts
const sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();
```

**Riskler:**
- Sunucu restart'ında tüm session'lar kaybolur
- Multi-instance deployment'da session'lar paylaşılamaz
- Session revocation (kullanıcının tüm oturumlarını kapatma) yapılamaz
- Session metadata (IP, userAgent) saklanmıyor

### Hedef Durum (Better Auth + Prisma)

```typescript
// prisma/schema.prisma - Session modeli (zaten mevcut)
model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
}
```

### Geçiş Adımları

```
Aşama 1: Schema Uyumluluğu (RC-5)
├── Session modeli zaten Better Auth ile uyumlu
├── Minor: token generation (@default(cuid()) → crypto.randomBytes)
└── Better Auth kendi token formatını kullanır

Aşama 2: Better Auth Aktivasyonu (RC-5)
├── src/lib/auth/index.ts'te Better Auth config'i aktif et
├── src/app/api/auth/[...all]/route.ts'te handler'ı değiştir
└── Mock auth'un session Map'i tamamen devre dışı kalır

Aşama 3: Session Revocation (RC-5 sonrası)
├── DELETE /api/auth/revoke-all → Tüm session'ları sil
├── DELETE /api/auth/revoke/:id → Belirli session'ı sil
└── GET /api/auth/sessions → Aktif session listesi
```

### Production Deployment İçin Kontrol Listesi

- [ ] PostgreSQL bağlantısı doğrulandı
- [ ] `npx prisma migrate deploy` başarılı
- [ ] `BETTER_AUTH_SECRET` environment variable set edildi (min 32 char, crypto-safe)
- [ ] Session table'da index'ler oluşturuldu
- [ ] Expired session cleanup job tanımlandı (cron: her 6 saatte bir)

---

## 5. Rate Limiting: In-Memory → Redis Geçiş Tasarımı

### Mevcut Durum (Mock Auth)

```typescript
// auth-service.ts
const loginAttempts: Map<string, { count: number; firstAttempt: number }> = new Map();
// MAX_LOGIN_ATTEMPTS = 5
// LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000 (15 dakika)
```

**Riskler:**
- Sunucu restart'ında tüm rate limit verileri sıfırlanır
- Multi-instance deployment'da her instance kendi sayacını tutar
- Sadece email-based limiting var, IP-based yok
- Fixed window (sliding window değil)

### Hedef Durum (Redis-based)

```typescript
// Redis Rate Limiting Tasarımı
interface RateLimitConfig {
  maxAttempts: number;       // 5
  windowMs: number;          // 15 * 60 * 1000
  keyPrefix: string;         // "ratelimit:login:"
}

// Redis key yapısı:
// ratelimit:login:email:guardian@example.com → { count: 3 }
// ratelimit:login:ip:192.168.1.1           → { count: 2 }

// Sliding window algoritması:
// Her istekte:
// 1. Redis'de key'i getir
// 2. Window dışındaki eski kayıtları sil
// 3. Yeni kayıt ekle
// 4. Toplam sayıyı kontrol et
// 5. TTL set et (window süresi)
```

### Redis Konfigürasyonu

```typescript
// docker-compose.yml'e eklenecek
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis-data:/data
  command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

// Environment variables
REDIS_URL=redis://redis:6379
```

### Rate Limit Katmanları

| Katman | Anahtar | Limit | Pencere | Amaç |
|--------|---------|-------|---------|------|
| L1 - IP | `ratelimit:ip:{ip}` | 20 | 15 dk | DDoS koruması |
| L2 - Email | `ratelimit:email:{email}` | 5 | 15 dk | Brute-force koruması |
| L3 - Global | `ratelimit:global` | 100 | 1 dk | Genel koruma |

### Geçiş Stratejisi

```
RC-5 (Better Auth geçişi):
├── Better Auth'un built-in rate limiting'i aktif edilir
├── Redis adapter eklenir
└── Mock auth'un in-memory Map'i kaldırılır

RC-6+ (Enhancements):
├── Custom middleware ile IP-based limiting
├── Sliding window algoritması
└── Rate limit aşıldığında CAPTCHA challenge
```

### Better Auth'un Built-in Rate Limiting

Better Auth zaten şu rate limiting mekanizmalarını sağlar:
- Sign-in: 5 attempts per 15 minutes (per email)
- Sign-up: 3 per hour (per IP)
- Generic: 100 requests per minute (per IP)

Bu değerler Redis adapter ile kalıcı hale gelir.

---

## 6. RC Aşamalarına Göre Çözüm Planı

### RC-4 (Mevcut - Security Validation) ✅ Kod İncelemesi Tamamlandı

**Tamamlanan:**
- ✅ C-1: Security headers (CSP, HSTS, Permissions-Policy)
- ✅ C-2: CSRF koruması (double-submit cookie pattern)
- ✅ C-3: Password hashing (bcryptjs, SALT_ROUNDS=10)
- ✅ Password strength validation (uppercase, lowercase, number, special)
- ✅ Input sanitization (XSS prevention)
- ✅ Email/username validation
- ✅ Cookie security flags (HttpOnly, Secure, SameSite=Strict)
- ✅ Session rotation (refreshSession)
- ✅ Timing-safe CSRF comparison

**Kalan (Gerçek ortam doğrulaması):**
- 🔲 Docker ortamında tüm güvenlik kontrollerinin test edilmesi
- 🔲 Security headers'ın HTTP response'larda doğrulanması
- 🔲 CSRF token akışının end-to-end test edilmesi
- 🔲 Rate limiting'in fonksiyonel testi

### RC-5 (Better Auth Migration)

**Çözülecek bulgular:**
- H-1: In-memory session → Database session (Prisma + PostgreSQL)
- H-2: In-memory rate limiting → Redis-based (Better Auth built-in)
- H-3: Otomatik session rotation (Better Auth built-in)
- M-1: IP-based rate limiting (Better Auth built-in)
- M-5: Session revocation API

### RC-6+ (Security Hardening - Gelecek)

**Planlanan:**
- M-2: Common password check (haveibeenpwned API)
- M-3: Breached password check (HIBP Passwords API)
- M-4: Disposable email domain check
- L-1: Nonce-based CSP (unsafe-inline kaldırma)
- L-2: Sliding window rate limiting (custom middleware)

---

## 7. Gerçek Çalışma Ortamı Doğrulama Kontrol Listesi

### RC-4 Docker Test Senaryoları

```bash
# 1. Security Headers Test
curl -I https://localhost:3000 | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security|Content-Security-Policy|Permissions-Policy|Referrer-Policy|X-XSS-Protection)"

# 2. CSRF Token Generation Test
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' \
  -v 2>&1 | grep -E "(Set-Cookie|csrfToken)"

# 3. CSRF Validation Test (sign-out with token)
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=XXX; csrf_token=YYY" \
  -H "X-CSRF-Token: YYY" \
  -d '{"action":"sign-out"}'

# 4. CSRF Rejection Test (sign-out without token)
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=XXX" \
  -d '{"action":"sign-out"}'
# Beklenen: 403 CSRF validation failed

# 5. Rate Limiting Test
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/auth \
    -H "Content-Type: application/json" \
    -d '{"action":"sign-in","email":"guardian@destinyrisinghub.com","password":"wrong"}'
  echo "---"
done
# Beklenen: 5. denemeden sonra "Too many login attempts"

# 6. Password Hashing Test
# SignUp ile yeni kullanıcı oluştur, ardından aynı şifre ile signIn
# Başarılı olmalı (bcrypt hash+compare çalışıyor demektir)

# 7. Cookie Security Flags Test
curl -I -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' | grep Set-Cookie
# Beklenen: HttpOnly; Secure; SameSite=Strict

# 8. Session Expiration Test
# Session token ile 7 gün sonra tekrar deneme (manuel test)
```

### Başarı Kriterleri

| Test | Başarı Kriteri | Sonuç |
|------|----------------|-------|
| Security Headers | 7 header doğru değerle mevcut | 🔲 Bekliyor |
| CSRF Generation | csrfToken response body'de ve cookie'de | 🔲 Bekliyor |
| CSRF Validation | Geçerli token ile sign-out başarılı | 🔲 Bekliyor |
| CSRF Rejection | Token'sız sign-out 403 döndürür | 🔲 Bekliyor |
| Rate Limiting | 6. denemede "Too many login attempts" | 🔲 Bekliyor |
| Password Hash | Farklı signup'lar farklı hash üretir | 🔲 Bekliyor |
| Cookie Flags | HttpOnly, Secure, SameSite=Strict | 🔲 Bekliyor |

---

## 8. Dosya Değişiklik Özeti

| Dosya | Değişiklik | Commit |
|-------|-----------|--------|
| `next.config.ts` | CSP, HSTS, Permissions-Policy headers eklendi | e710c5e |
| `src/features/user/services/auth-service.ts` | CSRF token generation/validation fonksiyonları | e710c5e |
| `src/app/api/auth/[...all]/route.ts` | CSRF cookie/header helper'ları, validation entegrasyonu | e710c5e |
| `src/features/user/services/auth-service.ts` | bcryptjs password hashing | b9fee8b |
| `package.json` | bcrypt kaldırıldı, bcryptjs kaldı | 4e4495b |

---

## 9. Karar

**RC-4 Kod İncelemesi:** ✅ TAMAMLANDI
- Tüm security headers eklendi
- CSRF koruması implement edildi
- Password hashing doğrulandı
- Cookie security flags standartlaştırıldı

**RC-4 Nihai PASS:** 🔲 BEKLİYOR
- Docker ortamında gerçek testlerin yapılması gerekiyor
- Yukarıdaki 7 test senaryosunun tamamı geçmeli
- Test sonuçları kanıt olarak sunulmalı

**RC-5 Başlangıç Koşulu:** RC-4 Docker testleri PASS olmalı.
