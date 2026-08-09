# RC-4 Step 2: Authentication & Authorization - Real Validation Guide

## Status: ⏳ REAL VALIDATION REQUIRED

**Date:** 2026-08-07  
**Environment:** Docker (your local environment)  
**Duration:** ~30-45 minutes

---

## Executive Summary

Bu doküman, Authentication & Authorization güvenlik doğrulamasını **gerçek uygulama üzerinde** nasıl yapacağınızı açıklar. Amaç API'nin nasıl davranacağını varsaymak değil, **gerçek davranışı gözlemlemek ve raporlamaktır**.

---

## Prensip

**"Güvenlik doğrulamasında varsayım değil, gözlem yapılır."**

- ❌ API'nin nasıl davranacağını **varsayma**
- ✅ API'nin **gerçek davranışını gözlemle**
- ✅ Beklenmeyen davranışları **raporla**
- ✅ Gerekirse **düzelt** ve **tekrar test et**

---

## Adım 1: Docker Ortamını Hazırla

```bash
# Docker'ı başlat
docker compose up -d

# Servislerin sağlıklı olduğunu doğrula
docker compose ps

# Uygulamanın hazır olduğunu kontrol et
curl http://localhost:3000/api/health
```

**Gözlem:**
- HTTP status code: [Kaydet]
- Response body: [Kaydet]
- Loglar: [Kaydet]

---

## Adım 2: Authentication Akışlarını Test Et

### Test 2.1: Health Endpoint Erişimi

**Komut:**
```bash
curl -i http://localhost:3000/api/health
```

**Gözlemlenecekler:**
- HTTP status code
- Response body
- Response headers
- Application logları

**Rapor:**
```
Test: Health Endpoint
Status Code: [___]
Response: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.2: Kimlik Doğrulama Olmadan Kullanıcı Bilgisi

**Komut:**
```bash
curl -i http://localhost:3000/api/auth
```

**Gözlemlenecekler:**
- HTTP status code
- Response body (user bilgisi var mı?)
- Davranış tutarlılığı

**Rapor:**
```
Test: Get User Without Auth
Status Code: [___]
Response: [___]
User Data: [Var/Yok]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.3: Kullanıcı Kaydı (Sign Up)

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User",
    "password": "TestPass123!"
  }'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body (user oluştu mu?)
- Database'de kullanıcı var mı?
- Session oluşturuldu mu?

**Rapor:**
```
Test: Sign Up
Status Code: [___]
Response: [___]
User Created: [Evet/Hayır]
Session Created: [Evet/Hayır]
Database Entry: [Var/Yok]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.4: Duplicate Email Kontrolü

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "test@example.com",
    "username": "testuser2",
    "displayName": "Test User 2",
    "password": "TestPass123!"
  }'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body (hata mesajı var mı?)
- Duplicate kayıt engellendi mi?

**Rapor:**
```
Test: Duplicate Email
Status Code: [___]
Response: [___]
Duplicate Prevented: [Evet/Hayır]
Error Message: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.5: Kullanıcı Girişi (Sign In)

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body (user bilgisi var mı?)
- Session oluşturuldu mu?

**Rapor:**
```
Test: Sign In (Valid)
Status Code: [___]
Response: [___]
User Returned: [Evet/Hayır]
Session Created: [Evet/Hayır]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.6: Geçersiz Kimlik Bilgileri

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "wrong@example.com",
    "password": "WrongPassword123!"
  }'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body (hata mesajı var mı?)
- Bilgi sızıntısı var mı? (kullanıcı var mı yok mu söylememeli)

**Rapor:**
```
Test: Sign In (Invalid)
Status Code: [___]
Response: [___]
Error Message: [___]
Information Leakage: [Var/Yok]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.7: Kullanıcı Çıkışı (Sign Out)

**Komut:**
```bash
# Önce giriş yap
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "sign-in", "email": "test@example.com", "password": "TestPass123!"}'

# Sonra çıkış yap
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "sign-out"}'

# Session kontrolü
curl -i http://localhost:3000/api/auth
```

**Gözlemlenecekler:**
- HTTP status code
- Session temizlendi mi?
- Çıkış sonrası user bilgisi null mu?

**Rapor:**
```
Test: Sign Out
Status Code: [___]
Response: [___]
Session Cleared: [Evet/Hayır]
User After Logout: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 2.8: Demo Login

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "demo-login"}'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body
- Demo user döndü mü?

**Rapor:**
```
Test: Demo Login
Status Code: [___]
Response: [___]
Demo User: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

## Adım 3: Authorization Testleri

### Test 3.1: Public Endpoint Erişimi

**Komut:**
```bash
curl -i http://localhost:3000/api/v1/characters
```

**Gözlemlenecekler:**
- HTTP status code
- Response body
- Authentication gerekli mi?

**Rapor:**
```
Test: Public API Access
Status Code: [___]
Response: [___]
Auth Required: [Evet/Hayır]
Data Returned: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 3.2: Geçersiz Action

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "invalid-action"}'
```

**Gözlemlenecekler:**
- HTTP status code
- Response body
- Hata mesajı

**Rapor:**
```
Test: Invalid Action
Status Code: [___]
Response: [___]
Error Message: [___]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

## Adım 4: Güvenlik Testleri

### Test 4.1: SQL Injection Koruması

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "\"'; DROP TABLE users; --",
    "password": "test"
  }'
```

**Gözlemlenecekler:**
- Uygulama çöktü mü?
- Database etkilendi mi?
- Beklenmeyen hata oluştu mu?
- Uygulama güvenli şekilde davrandı mı?

**Rapor:**
```
Test: SQL Injection
Status Code: [___]
Response: [___]
Application Crashed: [Evet/Hayır]
Database Affected: [Evet/Hayır]
Unexpected Error: [Evet/Hayır]
Safe Behavior: [Evet/Hayır]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

### Test 4.2: XSS Koruması

**Komut:**
```bash
curl -i -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "xss@example.com",
    "username": "<script>alert(1)</script>",
    "displayName": "XSS User",
    "password": "TestPass123!"
  }'
```

**Gözlemlenecekler:**
- Input sanitize edildi mi?
- Input reddedildi mi?
- XSS açığı var mı?

**Rapor:**
```
Test: XSS Attempt
Status Code: [___]
Response: [___]
Input Sanitized: [Evet/Hayır]
Input Rejected: [Evet/Hayır]
XSS Vulnerability: [Var/Yok]
Behavior: [Normal/Anormal]
Notes: [___]
```

---

## Adım 5: Sonuçları Raporla

Tüm testleri tamamladıktan sonra aşağıdaki formatta rapor oluşturun:

```markdown
# RC-4 Step 2: Authentication & Authorization Test Report

## Test Date: [Tarih]
## Tester: [İsim]
## Environment: Docker (localhost:3000)

## Test Results

| # | Test | Status Code | Result | PASS/FAIL | Notes |
|---|------|-------------|--------|-----------|-------|
| 1 | Health Endpoint | [___] | [___] | [___] | [___] |
| 2 | Get User (No Auth) | [___] | [___] | [___] | [___] |
| 3 | Sign Up (Valid) | [___] | [___] | [___] | [___] |
| 4 | Sign Up (Duplicate) | [___] | [___] | [___] | [___] |
| 5 | Sign In (Valid) | [___] | [___] | [___] | [___] |
| 6 | Sign In (Invalid) | [___] | [___] | [___] | [___] |
| 7 | Sign Out | [___] | [___] | [___] | [___] |
| 8 | Demo Login | [___] | [___] | [___] | [___] |
| 9 | Public API | [___] | [___] | [___] | [___] |
| 10 | Invalid Action | [___] | [___] | [___] | [___] |
| 11 | SQL Injection | [___] | [___] | [___] | [___] |
| 12 | XSS Attempt | [___] | [___] | [___] | [___] |

## Summary

- Total Tests: 12
- Passed: [___]
- Failed: [___]
- Critical Issues: [___]
- High Issues: [___]

## Issues Found

### Issue 1: [Başlık]
- Severity: [Critical/High/Medium/Low]
- Description: [Açıklama]
- Evidence: [Kanıt]
- Recommendation: [Öneri]

## Conclusion

[Genel değerlendirme]
```

---

## Adım 6: Sorunları Düzelt ve Tekrar Test Et

Eğer herhangi bir test FAIL olursa:

1. ✅ Sorunu analiz et
2. ✅ Gerekli düzeltmeyi yap
3. ✅ Uygulamayı yeniden başlat
4. ✅ **Aynı testi tekrar çalıştır**
5. ✅ Sonucu raporla

---

## Adım 7: RC-4 Step 2'yi PASS Yap

**Yalnızca以下条件 sağlandığında PASS olarak işaretle:**

- ✅ Tüm kritik testler geçti
- ✅ Kritik güvenlik açığı yok
- ✅ Yüksek öncelikli sorunlar giderildi
- ✅ Tüm testler tekrar çalıştırıldı ve geçti
- ✅ Rapor tamamlandı

---

## Önemli Notlar

### ❌ Yapılmaması Gerekenler

- API'nin nasıl davranacağını **varsayma**
- Test sonuçlarını **uydurma**
- Başarısız testleri **göz ardı etme**
- Güvenlik sorunlarını **küçümseme**

### ✅ Yapılması Gerekenler

- Gerçek davranışı **gözlemle**
- Tüm sonuçları **kaydet**
- Beklenmeyen davranışları **raporla**
- Sorunları **düzelt** ve **tekrar test et**
- Kanıtları **dokümante et**

---

## Sonraki Adım

Step 2 tamamlandıktan sonra:

1. ✅ Raporu kaydet
2. ✅ Step 3'e geç (API Security)
3. ✅ Aynı yöntemle devam et

---

**Testleri çalıştırın, gözlemleyin, raporlayın!** 🔍
