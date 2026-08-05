# RC-4: Security Validation

## Objective

Sistem güvenlik açıklarına karşı dayanıklı mı?
Authentication, authorization, ve veri koruması doğrulandı mı?

## Prerequisites

- ✅ RC-1 PASS
- ✅ RC-2 PASS

## Security Test Kategorileri

### 1. Authentication

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 1 | Brute force koruması | 5 başarısız deneme → lockout | ⬜ |
| 2 | Session fixation | Login sonrası session ID değişti | ⬜ |
| 3 | Session hijacking | HttpOnly + Secure cookie | ⬜ |
| 4 | Token expiry | Expired token → 401 | ⬜ |
| 5 | Token refresh | Refresh token çalışıyor | ⬜ |
| 6 | Logout invalidation | Logout sonrası token geçersiz | ⬜ |
| 7 | Concurrent sessions | Policy uygulandı | ⬜ |
| 8 | Password policy | Min length, complexity enforced | ⬜ |
| 9 | Password hashing | bcrypt/argon2 doğrulandı | ⬜ |

### 2. Authorization & RBAC

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 10 | Horizontal privilege escalation | User A, User B verisine erişemez | ⬜ |
| 11 | Vertical privilege escalation | Member, admin endpoint'e erişemez | ⬜ |
| 12 | IDOR (Insecure Direct Object Reference) | ID tahmin ile erişim engellendi | ⬜ |
| 13 | API endpoint protection | Tüm korumalı endpoint'ler auth istiyor | ⬜ |
| 14 | Admin-only operations | Sadece admin yapabilir | ⬜ |
| 15 | Soft-deleted data access | Silinmiş veri erişilemez | ⬜ |

### 3. Input Validation

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 16 | XSS (Stored) | Script tag'leri sanitize edildi | ⬜ |
| 17 | XSS (Reflected) | URL parametreleri sanitize | ⬜ |
| 18 | XSS (DOM-based) | Client-side sanitization | ⬜ |
| 19 | SQL Injection | Prisma parameterized queries | ⬜ |
| 20 | NoSQL Injection | JSON input validated | ⬜ |
| 21 | Command Injection | Shell injection engellendi | ⬜ |
| 22 | Path Traversal | `../../etc/passwd` engellendi | ⬜ |
| 23 | SSRF | Internal URL erişimi engellendi | ⬜ |
| 24 | XXE | XML entity injection engellendi | ⬜ |

### 4. CSRF & CORS

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 25 | CSRF token | Form submit'lerinde token gerekli | ⬜ |
| 26 | CORS policy | Sadece allowed origins | ⬜ |
| 27 | Pre-flight requests | OPTIONS doğru yanıt veriyor | ⬜ |
| 28 | Cookie SameSite | SameSite=Lax veya Strict | ⬜ |

### 5. File Upload Security

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 29 | File type validation | Sadece izin verilen tipler | ⬜ |
| 30 | File size limit | Max boyut aşılamaz | ⬜ |
| 31 | Malicious file upload | Executable upload engellendi | ⬜ |
| 32 | File name sanitization | Path injection engellendi | ⬜ |
| 33 | Image content validation | Magic bytes doğrulandı | ⬜ |

### 6. API Security

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 34 | Rate limiting | 100 req/min exceeded → 429 | ⬜ |
| 35 | API key validation | Geçersiz key → 401 | ⬜ |
| 36 | Request size limit | Payload > 1MB → 413 | ⬜ |
| 37 | GraphQL depth limit | N/A (REST API) | ⬜ |
| 38 | Mass assignment | Sadece izin verilen alanlar | ⬜ |
| 39 | Response data leaking | Hassas veri response'da yok | ⬜ |

### 7. Data Protection

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 40 | PII encryption | Hassas veri DB'de encrypted | ⬜ |
| 41 | Logs — no sensitive data | Password/token log'da yok | ⬜ |
| 42 | Error messages | Stack trace kullanıcıya gitmiyor | ⬜ |
| 43 | HTTPS enforcement | HTTP → HTTPS redirect | ⬜ |
| 44 | HSTS header | Strict-Transport-Security var | ⬜ |

### 8. Security Headers

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 45 | X-Frame-Options | DENY veya SAMEORIGIN | ⬜ |
| 46 | X-Content-Type-Options | nosniff | ⬜ |
| 47 | Content-Security-Policy | Policy tanımlı | ⬜ |
| 48 | Referrer-Policy | strict-origin-when-cross-origin | ⬜ |
| 49 | Permissions-Policy | Camera, mic vb. kısıtlı | ⬜ |

### 9. Dependency Security

| # | Test | Beklenen Sonuç | Durum |
|---|------|----------------|-------|
| 50 | npm audit | 0 high/critical vulnerability | ⬜ |
| 51 | Trivy container scan | 0 critical vulnerability | ⬜ |
| 52 | Gitleaks | 0 secret in codebase | ⬜ |
| 53 | License compliance | Yasaklı lisans yok | ⬜ |
| 54 | SBOM generated | CycloneDX oluşturuldu | ⬜ |

## Automated Security Scan

```bash
# npm audit
npm audit --audit-level=high

# Trivy container scan
trivy image destiny-rising-hub:latest

# Gitleaks
gitleaks detect --source . --verbose

# OWASP ZAP (optional)
zap-baseline.py -t http://localhost:3000
```

## Evidence

> **⏳ PENDING**
>
> - [ ] npm audit report
> - [ ] Trivy scan results (SARIF)
> - [ ] Gitleaks results
> - [ ] OWASP ZAP report
> - [ ] Manual penetration test notes
> - [ ] Security headers scan (securityheaders.com)

## Duration

> **⏳ PENDING**

## Issues Found

> **⏳ PENDING**

## Status

⏳ **PENDING** — RC-2 sonrası başlatılacak (RC-3 ile paralel olabilir)

---

### PASS Criteria

| Kontrol | Beklenen | Durum |
|---------|----------|-------|
| Authentication tests | 9/9 PASS | ⬜ |
| Authorization tests | 6/6 PASS | ⬜ |
| Input validation | 9/9 PASS | ⬜ |
| CSRF & CORS | 4/4 PASS | ⬜ |
| File upload security | 5/5 PASS | ⬜ |
| API security | 6/6 PASS | ⬜ |
| Data protection | 5/5 PASS | ⬜ |
| Security headers | 5/5 PASS | ⬜ |
| Dependency security | 5/5 PASS | ⬜ |
| **Genel** | **54/54 PASS** | ⬜ |
