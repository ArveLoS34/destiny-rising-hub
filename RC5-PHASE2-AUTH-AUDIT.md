# RC-5 PHASE 2 — AUTH ARCHITECTURE AUDIT

**Date:** 2026-08-08  
**Status:** Planning Phase  
**Schema:** FROZEN (no changes allowed)

---

## EXECUTIVE SUMMARY

Mevcut authentication sistemi mock auth (in-memory) kullanıyor. Better Auth dependency yüklü ve client oluşturulmuş ancak aktif değil. Phase 2'de mock auth'ı Better Auth ile değiştireceğiz. Schema donmuş durumda, bu yüzden mevcut User/Session/Account/Verification modellerini kullanacağız.

**Kritik Kısıtlama:** Prisma schema değiştirilemez, yeni migration oluşturulamaz.

---

## 1. MEVCUT AUTHENTICATION AKIŞI

### 1.1 Mimari

```
┌─────────────────────────────────────────────────────────────┐
│ Client (Browser)                                            │
│  ├─ useAuth() hook (auth-context.tsx)                       │
│  └─ fetch('/api/auth') → POST/GET                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ API Route (src/app/api/auth/[[...all]]/route.ts)            │
│  ├─ GET: getCurrentUser(sessionToken)                       │
│  └─ POST: action-based routing                              │
│      ├─ sign-in                                             │
│      ├─ sign-up                                             │
│      ├─ sign-out                                            │
│      ├─ demo-login                                          │
│      ├─ validate-session                                    │
│      └─ refresh-session                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Mock Auth Service (auth-service.ts)                         │
│  ├─ In-memory user storage (Map)                            │
│  ├─ In-memory session storage (Map)                         │
│  ├─ bcrypt password hashing                                 │
│  ├─ CSRF token generation/validation                        │
│  └─ Rate limiting (in-memory)                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Session Yönetimi

**Cookie Yapısı:**
- `session_token` (HttpOnly, Secure, SameSite=Strict, 7 gün)
- `csrf_token` (SameSite=Strict, 24 saat)

**Session Lifecycle:**
1. Sign-in/sign-up → session oluştur → cookie set et
2. Her request → session_token cookie'den oku → user yükle
3. Sign-out → session sil → cookie temizle
4. Refresh-session → eski session sil → yeni session oluştur

### 1.3 CSRF Koruması

**Double-Submit Pattern:**
1. Login → CSRF token oluştur → cookie + response body'de döndür
2. State-changing request → CSRF token header'da gönder
3. Server → cookie'deki token ile header'daki token'ı karşılaştır
4. Timing-safe comparison (crypto.timingSafeEqual)

### 1.4 Rate Limiting

**In-Memory Rate Limit:**
- 5 login attempt / 15 dakika (email bazlı)
- IP bazlı rate limiting YOK
- Container restart'ta sıfırlanır

---

## 2. MOCK AUTH'IN KULLANILDIĞI YERLER

### 2.1 Doğrudan Kullanım

| Dosya | Kullanım | Açıklama |
|-------|----------|----------|
| `src/lib/auth/index.ts` | `export { authService }` | Mock auth'ı export ediyor |
| `src/lib/auth/auth-context.tsx` | `authFetch('/api/auth')` | API route üzerinden mock auth çağırıyor |
| `src/app/api/auth/[[...all]]/route.ts` | `authService.*` | Tüm auth operasyonları mock auth ile |
| `src/features/user/services/auth-service.ts` | Tüm implementation | Mock auth service kendisi |

### 2.2 Dolaylı Kullanım (useAuth Hook Üzerinden)

| Dosya | Kullanım | Açıklama |
|-------|----------|----------|
| `src/app/(auth)/login/page.tsx` | `useAuth()` | signIn, demoLogin |
| `src/app/profile/page.tsx` | `useAuth()` | user, signOut, demoLogin |

**Not:** Admin dashboard auth kullanmıyor, mock data ile çalışıyor.

---

## 3. BETTER AUTH'IN MEVCUT DURUMU

### 3.1 Yüklü ve Hazır Olanlar

✅ **Dependency Yüklü:**
```json
"better-auth": "^1.6.25"
```

✅ **Client Oluşturulmuş:**
```typescript
// src/lib/auth/client.ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
```

✅ **Konfigürasyon Hazır (yorum satırında):**
```typescript
// src/lib/auth/index.ts (commented out)
export const auth = betterAuth({
  database: { provider: "pg", adapter: adapter },
  emailAndPassword: { enabled: true },
  socialProviders: { google, github, discord },
  session: { expiresIn: 7 days },
  advanced: { csrf: { enabled: true } },
  rateLimit: { enabled: true, storage: "redis" },
});
```

✅ **API Route Handler Hazır (yorum satırında):**
```typescript
// src/app/api/auth/[[...all]]/route.ts (commented out)
export const { GET: betterGet, POST: betterPost } = toNextJsHandler(auth);
```

### 3.2 Eksik Olanlar

❌ **Aktif Değil:** Tüm Better Auth kodu yorum satırında  
❌ **Redis Adapter Yok:** Rate limiting için Redis adapter implementasyonu eksik  
❌ **Environment Variables:** OAuth credentials tanımlı değil  
❌ **Field Mapping:** User modelindeki displayName/avatar için Better Auth field mapping yok  
❌ **Demo Login:** Better Auth'ta demo login konsepti yok (mock auth'a özel)

---

## 4. DEĞİŞTİRİLECEK DOSYALAR

### 4.1 Kritik Değişiklikler

| Dosya | Değişiklik | Öncelik | Risk |
|-------|-----------|---------|------|
| `src/lib/auth/index.ts` | Better Auth konfigürasyonunu aktif et, field mapping ekle | 🔴 Critical | Medium |
| `src/app/api/auth/[[...all]]/route.ts` | Mock auth handler'larını Better Auth handler ile değiştir | 🔴 Critical | High |
| `src/lib/auth/auth-context.tsx` | API çağrılarını Better Auth client çağrılarına çevir | 🔴 Critical | High |

### 4.2 Yardımcı Değişiklikler

| Dosya | Değişiklik | Öncelik | Risk |
|-------|-----------|---------|------|
| `src/lib/auth/client.ts` | Redis adapter ekle (rate limiting için) | 🟡 Medium | Low |
| `.env.example` | OAuth credentials ekle | 🟡 Medium | Low |
| `docker-compose.yml` | Redis service ekle (zaten var, doğrula) | 🟢 Low | Low |

### 4.3 Değişmeyecek Dosyalar

| Dosya | Neden |
|-------|-------|
| `src/features/user/services/auth-service.ts` | Mock auth koruyacağız (fallback/demo için) |
| `src/app/(auth)/login/page.tsx` | useAuth hook kullanıyor, değişiklik gerekmez |
| `src/app/profile/page.tsx` | useAuth hook kullanıyor, değişiklik gerekmez |
| Prisma schema | ❌ FROZEN |

---

## 5. HER DOSYADA YAPILACAK DEĞİŞİKLİKLER

### 5.1 src/lib/auth/index.ts

**Mevcut Durum:** Mock auth export ediyor, Better Auth yorum satırında

**Değişiklik:**
```typescript
// 1. Better Auth konfigürasyonunu aktif et
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  
  // Field mapping: Better Auth ↔ Our schema
  user: {
    fields: {
      name: "displayName",      // Better Auth "name" → Bizim "displayName"
      image: "avatar",          // Better Auth "image" → Bizim "avatar"
    },
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "MEMBER" },
      locale: { type: "string", required: false, defaultValue: "en" },
      theme: { type: "string", required: false, defaultValue: "dark" },
    },
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 gün
    updateAge: 60 * 60 * 24,     // 1 gün
  },
  
  advanced: {
    csrf: { enabled: true },
    cookies: {
      session: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      },
    },
  },
  
  rateLimit: {
    enabled: true,
    storage: "redis", // Redis adapter kullanılacak
    redis: redisClient, // Redis client instance
  },
  
  // Social providers (şimdilik disabled, credential yok)
  // socialProviders: { google, github, discord },
});
```

**Risk:** Field mapping yanlış olursa user verisi bozulabilir  
**Mitigation:** Test ortamında kapsamlı test

---

### 5.2 src/app/api/auth/[[...all]]/route.ts

**Mevcut Durum:** Mock auth handler'ları (GET/POST)

**Değişiklik:**
```typescript
// 1. Better Auth handler'ları aktif et
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET: betterGet, POST: betterPost } = toNextJsHandler(auth);

// 2. Mock auth handler'ları kaldır veya yorum satırına al
// export async function GET(request: NextRequest) { ... }
// export async function POST(request: NextRequest) { ... }

// 3. Better Auth handler'ları export et
export { betterGet as GET, betterPost as POST };
```

**Kritik Nokta:** Better Auth kendi endpoint yapısını kullanıyor:
- `/api/auth/sign-in/email` (POST)
- `/api/auth/sign-up/email` (POST)
- `/api/auth/sign-out` (POST)
- `/api/auth/get-session` (GET)

**Problem:** Mock auth action-based (`{ action: "sign-in" }`), Better Auth endpoint-based.  
**Çözüm:** auth-context.tsx'te API çağrılarını güncelle (bkz. 5.3)

**Risk:** API contract değişirse frontend bozulabilir  
**Mitigation:** auth-context.tsx'te adapter pattern kullan

---

### 5.3 src/lib/auth/auth-context.tsx

**Mevcut Durum:** `/api/auth` API route'ına fetch gönderiyor

**Değişiklik:**
```typescript
// 1. Better Auth client import et
import { authClient } from "./client";

// 2. useAuth hook'u Better Auth client kullanacak şekilde güncelle
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  
  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  }, []);
  
  const signUp = useCallback(async (email: string, username: string, displayName: string, password: string) => {
    const result = await authClient.signUp.email({
      email,
      password,
      name: displayName, // Better Auth "name" field kullanıyor
    });
    if (result.error) {
      return { error: result.error.message };
    }
    return {};
  }, []);
  
  const signOut = useCallback(async () => {
    await authClient.signOut();
  }, []);
  
  // Demo login Better Auth'ta yok, mock auth'a fallback
  const demoLogin = useCallback(async () => {
    // Demo user'ı mock auth ile oluştur, sonra Better Auth ile sign-in et
    const demoUser = await authService.getDemoUser();
    await authClient.signIn.email({
      email: demoUser.email,
      password: "demo123", // Demo password
    });
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        isLoading: isPending,
        isAuthenticated: !!session,
        signIn,
        signUp,
        signOut,
        demoLogin,
        refreshSession: async () => {}, // Better Auth otomatik refresh yapıyor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

**Kritik Nokta:** Better Auth `useSession()` hook kullanıyor, fetch değil.  
**Risk:** Session state yönetimi değişebilir  
**Mitigation:** useSession() hook'unu doğru kullan

---

### 5.4 src/lib/auth/client.ts (Redis Adapter)

**Mevcut Durum:** Sadece client oluşturulmuş, Redis adapter yok

**Değişiklik:**
```typescript
import { createAuthClient } from "better-auth/react";

// Redis client oluştur (rate limiting için)
import Redis from "ioredis";
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Redis adapter rate limiting için kullanılacak
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
```

**Risk:** Redis bağlantı hatası olabilir  
**Mitigation:** Redis fallback mechanism ekle

---

## 6. API CONTRACT KORUMA

### 6.1 Mevcut API Contract

**Mock Auth API:**
```typescript
POST /api/auth
Body: { action: "sign-in" | "sign-up" | "sign-out" | "demo-login", ... }
Response: { user: User, csrfToken?: string } | { error: string }
```

**Better Auth API:**
```typescript
POST /api/auth/sign-in/email
Body: { email, password }
Response: { user: User, token: string }

POST /api/auth/sign-up/email
Body: { email, password, name }
Response: { user: User, token: string }

POST /api/auth/sign-out
Body: {}
Response: { success: true }

GET /api/auth/get-session
Response: { user: User } | null
```

### 6.2 Adapter Pattern

auth-context.tsx'te adapter pattern kullanarak API contract'ı koruyacağız:

```typescript
// Frontend bu şekilde kullanmaya devam edecek:
const { signIn } = useAuth();
await signIn(email, password);

// Adapter内部でBetter Auth API çağrılıyor:
const signIn = async (email: string, password: string) => {
  return await authClient.signIn.email({ email, password });
};
```

**Sonuç:** Frontend kodu değişmez, sadece adapter layer değişir.

---

## 7. SESSION/COOKIE/CSRF AKIŞI KORUMA

### 7.1 Session Yönetimi

**Mevcut:**
- Cookie: `session_token` (HttpOnly, 7 gün)
- Storage: In-memory Map (mock auth)

**Better Auth:**
- Cookie: `better-auth.session_token` (HttpOnly, 7 gün)
- Storage: PostgreSQL Session table

**Geçiş Stratejisi:**
1. Better Auth yeni session oluştururken eski cookie'yi de set et
2. Frontend her iki cookie'yi de okuyabilsin
3. Eski cookie expire olduğunda sadece Better Auth cookie kalsın

### 7.2 CSRF Koruması

**Mevcut:**
- Double-submit pattern
- `csrf_token` cookie + `X-CSRF-Token` header
- Timing-safe comparison

**Better Auth:**
- Built-in CSRF protection
- Same pattern (cookie + header)
- Automatic validation

**Geçiş:** Better Auth CSRF'i otomatik yönetiyor, ek değişiklik gerekmez.

### 7.3 Cookie İsimleri

**Problem:** Better Auth cookie isimleri farklı olabilir  
**Çözüm:** Better Auth konfigürasyonunda cookie isimlerini özelleştir

```typescript
advanced: {
  cookies: {
    session: {
      name: "session_token", // Mevcut isimle aynı
    },
    csrf: {
      name: "csrf_token", // Mevcut isimle aynı
    },
  },
}
```

---

## 8. SCHEMA FREEZE NEDENİYLE DİKKAT EDİLECEK NOKTALAR

### 8.1 User Model

**Mevcut Schema:**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  displayName   String
  avatar        String?
  passwordHash  String?   // ❌ Better Auth kullanmıyor
  emailVerified Boolean   @default(false)
  role          UserRole  @default(MEMBER)
  locale        String    @default("en")
  theme         String    @default("dark")
  // ... diğer alanlar
}
```

**Better Auth Beklentisi:**
- `name` field (bizde `displayName`)
- `image` field (bizde `avatar`)
- `emailVerified` field ✅
- `passwordHash` YOK (Account.password kullanıyor)

**Çözüm:** Field mapping kullan
```typescript
user: {
  fields: {
    name: "displayName",
    image: "avatar",
  },
}
```

**Risk:** `passwordHash` field'ı Better Auth tarafından kullanılmayacak  
**Mitigation:** Mock auth'ta kalacak, Better Auth Account.password kullanacak

### 8.2 Session Model

**Mevcut Schema:**
```prisma
model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  userId    String
  // ... diğer alanlar
}
```

**Better Auth Beklentisi:** ✅ Tam uyumlu

### 8.3 Account Model

**Mevcut Schema:**
```prisma
model Account {
  id           String   @id @default(cuid())
  providerId   String
  accountId    String
  userId       String
  password     String?  // ✅ Better Auth credential password için kullanıyor
  // ... diğer alanlar
}
```

**Better Auth Beklentisi:** ✅ Tam uyumlu

### 8.4 Verification Model

**Mevcut Schema:** ✅ Better Auth ile tam uyumlu

---

## 9. RİSKLER VE OLASI BREAKING CHANGES

### 9.1 Yüksek Risk

| Risk | Etki | Olasılık | Mitigation |
|------|------|----------|------------|
| **API Contract Değişikliği** | Frontend bozulabilir | Medium | Adapter pattern kullan |
| **Cookie İsim Değişikliği** | Session kaybı | Low | Cookie isimlerini özelleştir |
| **Field Mapping Hatası** | User verisi bozulabilir | Medium | Kapsamlı test yap |
| **Redis Bağlantı Hatası** | Rate limiting çalışmaz | Low | Fallback mechanism ekle |

### 9.2 Orta Risk

| Risk | Etki | Olasılık | Mitigation |
|------|------|----------|------------|
| **CSRF Token Mismatch** | Login/sign-out başarısız | Low | CSRF konfigürasyonunu test et |
| **Session Refresh Farklılığı** | Kullanıcı logout olabilir | Low | Refresh logic'i test et |
| **Demo Login Çalışmaz** | Demo kullanıcı giriş yapamaz | Medium | Mock auth fallback ekle |

### 9.3 Düşük Risk

| Risk | Etki | Olasılık | Mitigation |
|------|------|----------|------------|
| **Rate Limiting Farklılığı** | Farklı rate limit davranışı | Low | Rate limit config'i test et |
| **Social Login Çalışmaz** | OAuth ile giriş yapılamaz | High (disabled) | Şimdilik disabled bırak |

### 9.4 Breaking Changes

**Olası Breaking Changes:**
1. ❌ Cookie isimleri değişebilir → Özelleştir
2. ❌ API endpoint'leri değişir → Adapter pattern kullan
3. ❌ Session refresh behavior değişebilir → Test et
4. ❌ Rate limiting behavior değişebilir → Config et

**Önleme Stratejisi:**
1. Staging ortamında kapsamlı test
2. Feature flag ile gradual rollout
3. Rollback planı hazırla

---

## 10. PHASE 2 IMPLEMENTASYON SIRASI

### 10.1 Adım 1: Better Auth Konfigürasyonu (30 dk)

**Dosya:** `src/lib/auth/index.ts`

**İşlemler:**
1. Better Auth konfigürasyonunu yorum satırından çıkar
2. Field mapping ekle (displayName, avatar)
3. Cookie isimlerini özelleştir (session_token, csrf_token)
4. Redis adapter ekle (rate limiting için)
5. Test ortamında doğrula

**Başarı Kriteri:** Better Auth instance oluşuyor

---

### 10.2 Adım 2: API Route Geçişi (45 dk)

**Dosya:** `src/app/api/auth/[[...all]]/route.ts`

**İşlemler:**
1. Mock auth handler'ları yorum satırına al
2. Better Auth handler'ları aktif et
3. Route path'ini doğrula (`/api/auth/*`)
4. Test ortamında doğrula

**Başarı Kriteri:** `/api/auth/get-session` çalışıyor

---

### 10.3 Adım 3: Auth Context Geçişi (1 saat)

**Dosya:** `src/lib/auth/auth-context.tsx`

**İşlemler:**
1. Better Auth client import et
2. `useSession()` hook kullan
3. signIn/signUp/signOut fonksiyonlarını Better Auth client'a çevir
4. Demo login için mock auth fallback ekle
5. Test ortamında doğrula

**Başarı Kriteri:** Login/sign-out çalışıyor

---

### 10.4 Adım 4: Frontend Testi (1 saat)

**Dosyalar:** `src/app/(auth)/login/page.tsx`, `src/app/profile/page.tsx`

**İşlemler:**
1. Login page test et
2. Profile page test et
3. Session persistence test et
4. CSRF protection test et
5. Rate limiting test et

**Başarı Kriteri:** Tüm user flows çalışıyor

---

### 10.5 Adım 5: Redis Rate Limiting (30 dk)

**Dosya:** `src/lib/auth/client.ts`

**İşlemler:**
1. Redis client oluştur
2. Better Auth konfigürasyonuna ekle
3. Rate limiting test et
4. Docker ortamında doğrula

**Başarı Kriteri:** Rate limiting çalışıyor

---

### 10.6 Adım 6: Regression Testleri (1 saat)

**Testler:**
1. RC-5 Phase 1 validation (80/80)
2. RC-4 Smoke test (17/17)
3. Login flow test
4. Session persistence test
5. CSRF protection test

**Başarı Kriteri:** Tüm testler geçiyor

---

### 10.7 Toplam Süre: ~5 saat

**Risk Buffer:** +2 saat (beklenmeyen sorunlar için)  
**Toplam:** 7 saat

---

## 11. PHASE 2 BAŞARI KRİTERLERİ

### 11.1 Fonksiyonel Kriterler

✅ **Authentication:**
- [ ] Email/password ile sign-up çalışıyor
- [ ] Email/password ile sign-in çalışıyor
- [ ] Sign-out çalışıyor
- [ ] Demo login çalışıyor (mock auth fallback)
- [ ] Session persistence çalışıyor (sayfa yenilendiğinde session korunuyor)

✅ **Security:**
- [ ] CSRF protection çalışıyor
- [ ] Rate limiting çalışıyor (5 attempt / 15 dakika)
- [ ] Cookie'ler doğru flag'lerle set ediliyor (HttpOnly, Secure, SameSite)
- [ ] Password hashing çalışıyor (bcrypt)

✅ **Data Integrity:**
- [ ] User verisi doğru kaydediliyor
- [ ] Session verisi doğru kaydediliyor
- [ ] Account verisi doğru kaydediliyor
- [ ] Field mapping çalışıyor (displayName ↔ name, avatar ↔ image)

### 11.2 Test Kriterleri

✅ **Regression Tests:**
- [ ] RC-5 Phase 1 validation: 80/80 PASS
- [ ] RC-4 Smoke test: 17/17 PASS
- [ ] Login flow: PASS
- [ ] Profile page: PASS
- [ ] Session persistence: PASS

✅ **Integration Tests:**
- [ ] Docker ortamında çalışıyor
- [ ] PostgreSQL bağlantısı çalışıyor
- [ ] Redis bağlantısı çalışıyor
- [ ] Prisma client çalışıyor

### 11.3 Performance Kriterleri

✅ **Response Time:**
- [ ] Sign-in: < 500ms
- [ ] Sign-up: < 500ms
- [ ] Session validation: < 100ms
- [ ] Sign-out: < 200ms

✅ **Database Queries:**
- [ ] User lookup: < 50ms
- [ ] Session lookup: < 50ms
- [ ] Session creation: < 100ms

### 11.4 Security Audit

✅ **Cookie Security:**
- [ ] session_token: HttpOnly, Secure, SameSite=Strict
- [ ] csrf_token: SameSite=Strict
- [ ] Cookie'ler doğru path'te set ediliyor (/)

✅ **CSRF Protection:**
- [ ] CSRF token generate ediliyor
- [ ] CSRF token validate ediliyor
- [ ] Timing-safe comparison kullanılıyor

✅ **Rate Limiting:**
- [ ] Email bazlı rate limiting çalışıyor
- [ ] IP bazlı rate limiting çalışıyor
- [ ] Rate limit aşıldığında 429 dönüyor

---

## 12. TEST PLANI

### 12.1 Unit Testleri

**Test Edilecek Fonksiyonlar:**
1. Better Auth konfigürasyonu
2. Field mapping
3. Cookie ayarları
4. CSRF token generation/validation

**Test Dosyası:** `src/lib/auth/__tests__/better-auth.test.ts`

---

### 12.2 Integration Testleri

**Test Edilecek Akışlar:**
1. Sign-up flow
2. Sign-in flow
3. Sign-out flow
4. Session persistence
5. CSRF protection

**Test Dosyası:** `src/__tests__/integration/rc5-phase2-auth.test.ts`

---

### 12.3 E2E Testleri

**Test Edilecek User Flows:**
1. Login → Profile → Logout
2. Sign-up → Email verification → Login
3. Session expiry → Re-login
4. Rate limit → Error message

**Test Dosyası:** `e2e/auth-flow.spec.ts`

---

### 12.4 Regression Testleri

**Mevcut Testler:**
1. RC-5 Phase 1 validation (80/80)
2. RC-4 Smoke test (17/17)
3. Prisma validation
4. Migration deployment

**Çalıştırma:**
```bash
npm run rc5:phase1:verify
npm run rc4:smoke-test
```

---

### 12.5 Manual Test Checklist

**Authentication:**
- [ ] Sign-up with new user
- [ ] Sign-in with existing user
- [ ] Sign-out
- [ ] Demo login
- [ ] Session persistence (refresh page)
- [ ] Session expiry (wait 7 days)

**Security:**
- [ ] CSRF token in response
- [ ] CSRF token in cookie
- [ ] CSRF validation on sign-out
- [ ] Rate limiting (5 failed attempts)
- [ ] Cookie flags (HttpOnly, Secure, SameSite)

**Data Integrity:**
- [ ] User saved to database
- [ ] Session saved to database
- [ ] Password hashed correctly
- [ ] Field mapping working (displayName ↔ name)

**Error Handling:**
- [ ] Invalid email format
- [ ] Weak password
- [ ] Duplicate email
- [ ] Invalid credentials
- [ ] Session expired

---

## APPENDIX A: BETTER AUTH DOKÜMANTASYON

**Resmi Dokümantasyon:**
- https://www.better-auth.com/docs
- https://www.better-auth.com/docs/configuration
- https://www.better-auth.com/docs/adapters/prisma

**Örnekler:**
- https://github.com/better-auth/better-auth/tree/main/examples

---

## APPENDIX B: MEVCUT KOD ÖRNEKLERİ

### B.1 Mock Auth Service

```typescript
// src/features/user/services/auth-service.ts
export const authService = {
  async signInWithEmail(email: string, password: string) {
    const user = mockUsers.find(u => u.email === email);
    if (!user) return { error: "Invalid credentials" };
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: "Invalid credentials" };
    
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, { userId: user.id, expiresAt: ... });
    
    return { user, sessionToken };
  },
  // ... diğer metodlar
};
```

### B.2 Better Auth Client

```typescript
// src/lib/auth/client.ts
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### B.3 Auth Context

```typescript
// src/lib/auth/auth-context.tsx
export function useAuth() {
  const signIn = async (email: string, password: string) => {
    // Mevcut: API çağrısı
    const response = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'sign-in', email, password }),
    });
    
    // Phase 2: Better Auth client çağrısı
    const result = await authClient.signIn.email({ email, password });
  };
}
```

---

## SONUÇ

Phase 2 implementasyonu için tüm detaylar hazır. Schema freeze nedeniyle dikkatli olunmalı, özellikle field mapping ve cookie isimleri konusunda. Adapter pattern kullanarak API contract korunacak, böylece frontend kodu değişmeyecek.

**Öneri:** Phase 2'yi staging ortamında implement et, kapsamlı test yap, sonra production'a deploy et.
