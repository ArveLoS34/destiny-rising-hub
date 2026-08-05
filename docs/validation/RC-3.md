# RC-3: Identity Validation

## Objective

OAuth authentication gerçek çalışıyor mu? Session yönetimi fonksiyonel mu?
RBAC middleware korumalı route'ları koruyor mu?

## Environment

- **OAuth Providers:** Google, GitHub, Discord
- **Session Store:** Redis
- **Tarih:** [Doğrulama tarihi]

## Prerequisites

- ✅ RC-1 PASS
- ✅ RC-2 PASS
- OAuth Client ID/Secret'lar konfigüre edilmiş

## Commands

### 1. OAuth Login Flow

```bash
# Google OAuth başlat
curl -v http://localhost:3000/api/auth/signin/google

# GitHub OAuth başlat
curl -v http://localhost:3000/api/auth/signin/github

# Discord OAuth başlat
curl -v http://localhost:3000/api/auth/signin/discord
```

### 2. Session Management

```bash
# Session oluşturuldu mu?
docker compose exec redis redis-cli keys "session:*"

# Session içeriği
docker compose exec redis redis-cli get "session:{token}"

# Session TTL
docker compose exec redis redis-cli ttl "session:{token}"
```

### 3. Logout

```bash
# Logout
curl -v -X POST http://localhost:3000/api/auth/signout

# Session silindi mi?
docker compose exec redis redis-cli keys "session:*"
```

### 4. RBAC

```bash
# Korumalı route (auth gerekli)
curl -sf http://localhost:3000/api/user/profile
# Beklenen: 401 Unauthorized (token yok)

# Admin route
curl -sf http://localhost:3000/api/admin/users
# Beklenen: 403 Forbidden (normal user)
```

## Expected Results

| Kontrol | Beklenen Sonuç |
|---------|----------------|
| Google OAuth redirect | Consent screen'e yönlendirme |
| Google OAuth callback | Session token oluşturuldu |
| GitHub OAuth | Aynı akış |
| Discord OAuth | Aynı akış |
| Session Redis'te | Key mevcut, TTL > 0 |
| Logout | Session Redis'ten silindi |
| 401 Unauthorized | Token olmadan korumalı route |
| 403 Forbidden | Yetkisiz kullanıcı admin route |

## Actual Results

> **⏳ PENDING**

## Evidence

> **⏳ PENDING**

## Status

⏳ **PENDING**

---

### Checklist

- [ ] Google OAuth ile giriş yapılıyor
- [ ] GitHub OAuth ile giriş yapılıyor
- [ ] Discord OAuth ile giriş yapılıyor
- [ ] Session Redis'te saklanıyor
- [ ] Session TTL > 0
- [ ] Logout session'ı siliyor
- [ ] 401: Token olmadan erişim engelleniyor
- [ ] 403: Yetkisiz rol engelleniyor
- [ ] 200: Yetkili kullanıcı erişebiliyor
- [ ] Auth integration testler PASS
