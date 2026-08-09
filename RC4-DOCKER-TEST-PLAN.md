# RC-4 Docker Gerçek Ortam Test Planı

**Tarih:** 2026-08-07  
**Branch:** feature/rc3-performance  
**Ön koşul:** Docker container çalışır durumda (`docker compose up --build`)  
**Base URL:** `http://localhost:3000`

---

## Mimari Değişiklik Özeti

| Önce | Sonra |
|------|-------|
| Client `authService` doğrudan import (in-memory) | `useAuth()` → `fetch('/api/auth')` |
| Route: `[...all]` required catch-all → `/api/auth` 404 | Route: `[[...all]]` optional catch-all → `/api/auth` 200 |
| CSRF koruması çalışmıyordu | CSRF cookie + header validation aktif |
| Cookie yoktu | `session_token` (HttpOnly) + `csrf_token` |

---

## Test Senaryoları

### 1. Endpoint Erişilebilirlik

```bash
# 1.1 GET /api/auth → { user: null } (token yoksa)
curl -s http://localhost:3000/api/auth | python3 -m json.tool
# BEKLENEN: {"user":null}

# 1.2 GET /api/health → 200
curl -s http://localhost:3000/api/health | python3 -m json.tool
# BEKLENEN: {"status":"healthy",...}
```

### 2. Demo Login (Session + CSRF Oluşturma)

```bash
# 2.1 POST /api/auth { action: "demo-login" }
curl -v -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' 2>&1

# BEKLENEN:
# HTTP/1.1 200
# Set-Cookie: session_token=session_...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/
# Set-Cookie: csrf_token=...; Path=/; SameSite=Strict; Secure; Max-Age=86400
# Body: {"user":{...},"csrfToken":"..."}
```

```bash
# 2.2 Cookie'leri çıkar
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' \
  -c /tmp/cookies.txt

# Session ve CSRF cookie'leri kaydedildi
cat /tmp/cookies.txt
```

### 3. Authenticated Session Doğrulama

```bash
# 3.1 GET /api/auth (session cookie ile) → { user: {...} }
curl -s http://localhost:3000/api/auth \
  -b /tmp/cookies.txt | python3 -m json.tool
# BEKLENEN: {"user":{"id":"user_demo_001","username":"guardian",...}}
```

### 4. CSRF Koruması

```bash
# 4.1 CSRF token ile sign-out (BAŞARILI)
CSRF_TOKEN=$(grep csrf_token /tmp/cookies.txt | awk '{print $NF}')
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_TOKEN}" \
  -b /tmp/cookies.txt \
  -d '{"action":"sign-out"}' | python3 -m json.tool
# BEKLENEN: {"success":true}

# 4.2 Yeni login yap (tekrar test için)
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' \
  -c /tmp/cookies.txt
CSRF_TOKEN=$(grep csrf_token /tmp/cookies.txt | awk '{print $NF}')

# 4.3 CSRF token OLMADAN sign-out → 403
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -b /tmp/cookies.txt \
  -d '{"action":"sign-out"}'
# BEKLENEN: {"error":"CSRF validation failed"} (403)

# 4.4 YANLIŞ CSRF token ile sign-out → 403
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: wrong_token_value" \
  -b /tmp/cookies.txt \
  -d '{"action":"sign-out"}'
# BEKLENEN: {"error":"CSRF validation failed"} (403)

# 4.5 CSRF token ile refresh-session → yeni token
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: ${CSRF_TOKEN}" \
  -b /tmp/cookies.txt \
  -d '{"action":"refresh-session"}' \
  -c /tmp/cookies_new.txt | python3 -m json.tool
# BEKLENEN: {"success":true,"csrfToken":"<yeni_token>"}
```

### 5. Password Hashing

```bash
# 5.1 Sign up (bcrypt hash oluşturulur)
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-up","email":"test@example.com","username":"testuser","displayName":"Test User","password":"Test1234!"}' \
  -c /tmp/signup_cookies.txt | python3 -m json.tool
# BEKLENEN: {"user":{...},"csrfToken":"..."}

# 5.2 Aynı şifre ile sign in (bcrypt compare başarılı)
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-in","email":"test@example.com","password":"Test1234!"}' \
  -c /tmp/signin_cookies.txt | python3 -m json.tool
# BEKLENEN: {"user":{...},"csrfToken":"..."}

# 5.3 Yanlış şifre ile sign in
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-in","email":"test@example.com","password":"WrongPass1!"}'
# BEKLENEN: {"error":"Invalid credentials"}
```

### 6. Rate Limiting

```bash
# 6.1 6 kez yanlış şifre denemesi
for i in $(seq 1 6); do
  echo "--- Attempt $i ---"
  curl -s -X POST http://localhost:3000/api/auth \
    -H "Content-Type: application/json" \
    -d '{"action":"sign-in","email":"guardian@destinyrisinghub.com","password":"wrong"}'
  echo ""
done
# BEKLENEN: İlk 5 denemede "Invalid credentials", 6. denemede "Too many login attempts"
```

### 7. Security Headers

```bash
# 7.1 Tüm security headers'ları kontrol et
curl -s -I http://localhost:3000/api/health

# BEKLENEN headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# Content-Security-Policy: default-src 'self'; ...
# Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

### 8. Cookie Security Flags

```bash
# 8.1 Set-Cookie header kontrolü
curl -s -v -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"demo-login"}' 2>&1 | grep -i "set-cookie"

# BEKLENEN:
# set-cookie: session_token=...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800; Path=/
# set-cookie: csrf_token=...; Path=/; SameSite=Strict; Secure; Max-Age=86400
```

### 9. Input Validation

```bash
# 9.1 Geçersiz email
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-in","email":"invalid","password":"Test1234!"}'
# BEKLENEN: {"error":"Invalid email format"}

# 9.2 Zayıf şifre (sign-up)
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-up","email":"test2@example.com","username":"test2","displayName":"Test","password":"weak"}'
# BEKLENEN: {"error":"Password must be at least 8 characters and include..."}

# 9.3 Geçersiz username
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"sign-up","email":"test3@example.com","username":"ab","displayName":"Test","password":"Test1234!"}'
# BEKLENEN: {"error":"Username must be 3-20 characters..."}
```

---

## Başarı Kriterleri

| # | Test | PASS Kriteri |
|---|------|-------------|
| 1 | Endpoint erişilebilirlik | GET /api/auth → 200, body: `{"user":null}` |
| 2 | Demo login | 200, Set-Cookie: session_token + csrf_token |
| 3 | Session doğrulama | GET /api/auth + cookie → `{"user":{...}}` |
| 4 | CSRF koruma | Token'sız → 403, Token'lı → 200 |
| 5 | Password hashing | SignUp → SignIn başarılı, yanlış şifre → hata |
| 6 | Rate limiting | 6. denemede "Too many login attempts" |
| 7 | Security headers | 7 header doğru değerle mevcut |
| 8 | Cookie flags | HttpOnly, Secure, SameSite=Strict, Path=/ |
| 9 | Input validation | Geçersiz input'lar uygun hata mesajları |

**RC-4 PASS koşulu:** Tüm 9 test senaryosu başarılı olmalı.
