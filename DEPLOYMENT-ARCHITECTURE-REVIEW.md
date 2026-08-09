# Deployment Architecture Decision Review
**Tarih:** 2026-08-09  
**Kapsam:** 4 deployment modeli karşılaştırması  
**Durum:** Review only (infrastructure provisioning yok, kod değişikliği yok)

---

## Repository Mevcut Yapısı

### Docker/Infrastructure
- **Dockerfile:** 5 aşamalı multi-stage build (deps → prisma → builder → development → runner)
- **docker-compose.yml:** Development (postgres, redis, minio, mailpit, app)
- **docker-compose.prod.yml:** Production (postgres, redis, app, backup)
- **Health checks:** App (/api/health), PostgreSQL (pg_isready), Redis (ping)
- **Backup service:** prodrigestivill/postgres-backup-local (daily pg_dump, retention)
- **Network:** destiny-prod-network (bridge)
- **Volumes:** postgres_prod_data, redis_prod_data, backup_prod_data
- **Resource limits:** Memory/CPU limits for all services

### CI/CD
- **GitHub Actions:** 12 job (lint, test, build, docker, trivy, sbom, deploy-staging [TODO], deploy-production [TODO])
- **Deploy jobs:** TODO comments — implement edilmemiş
- **Docker image build:** ✅ Tamamlandı (push: false, load: true)
- **Security scan:** Trivy + Gitleaks + SBOM

### Application
- **Framework:** Next.js 16.3 (App Router, standalone output)
- **Database:** PostgreSQL 16 (Prisma 7.x, pg adapter)
- **Cache:** Redis 7 (Better Auth rate limiting, @better-auth/redis-storage)
- **Auth:** Better Auth (email/password, session_token cookie)
- **Security:** 7 security header (HSTS, CSP, X-Frame-Options, vb.)

### Environment
- **Template:** .env.production.example (121 satır)
- **Critical secrets:** BETTER_AUTH_SECRET, DATABASE_URL, REDIS_URL
- **HTTPS:** HSTS header mevcut, secure cookies (NODE_ENV=production)

---

## Deployment Model Karşılaştırması

### 1. Tek VPS + Docker Compose

**Mimari:**
```
┌─────────────────────────────────────────┐
│  VPS (4GB RAM, 2 CPU, 80GB SSD)        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Docker Compose                   │ │
│  │                                   │ │
│  │  ┌─────────┐  ┌─────────┐       │ │
│  │  │ App     │  │ Backup  │       │ │
│  │  │ (Next)  │  │ (pg_dump│       │ │
│  │  └────┬────┘  └────┬────┘       │ │
│  │       │             │            │ │
│  │  ┌────┴────┐  ┌────┴────┐       │ │
│  │  │Postgres │  │ Redis   │       │ │
│  │  └─────────┘  └─────────┘       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Caddy (Reverse Proxy + SSL)      │ │
│  │  :80 → :3000, :443 → :3000       │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Uyum:** ⭐⭐⭐⭐⭐ (5/5)

**Mevcut yapıyla uyum:**
- ✅ docker-compose.prod.yml **değişiklik gerektirmez**
- ✅ Dockerfile **değişiklik gerektirmez**
- ✅ Health checks **olduğu gibi çalışır**
- ✅ Backup service **olduğu gibi çalışır**
- ✅ CI/CD pipeline **minimal değişiklik** (deploy script ekle)

**Maliyet/Operasyon:**
- **Maliyet:** $20-40/ay (VPS) + $10-15/ay (domain) = **~$30-55/ay**
- **Operasyon:** Orta (sunucu yönetimi, SSL yenileme, backup kontrolü)
- **Zaman:** 1-2 gün setup

**Avantajlar:**
- En düşük maliyet
- docker-compose.prod.yml **birebir kullanılabilir**
- Tam kontrol (root access)
- Basit mimari (tek nokta)
- Backup service otomatik çalışır
- Caddy otomatik SSL (Let's Encrypt)

**Dezavantajlar:**
- Single point of failure (VPS çökerse her şey çöker)
- Manuel scaling (dikey scaling sadece)
- PostgreSQL/Redis aynı sunucuda (resource contention)
- Backup'lar aynı sunucuda (disaster recovery zayıf)
- SSL yenileme otomatik ama DNS yönetimi manuel
- Monitoring kurulumu gerekli (Sentry, uptime monitoring)

**Production riskleri:**
- 🟡 VPS downtime = tüm sistem downtime
- 🟡 Resource contention (PostgreSQL + Redis + App aynı sunucuda)
- 🟡 Backup'lar aynı sunucuda (VPS kaybı = backup kaybı)
- 🟡 Manuel failover (otomatik değil)
- 🟢 Düşük trafik için yeterli (günlük 10K kullanıcıya kadar)

**Gereken değişiklikler:**
- docker-compose.prod.yml: **YOK**
- Dockerfile: **YOK**
- CI/CD: Deploy script ekle (SSH + docker compose pull + up)
- DNS: A record → VPS IP
- SSL: Caddy otomatik (Let's Encrypt)

**CI/CD deployment:**
```yaml
deploy-production:
  steps:
    - name: Deploy to VPS
      run: |
        ssh user@vps-ip "cd /app && \
          docker compose -f docker-compose.prod.yml pull && \
          docker compose -f docker-compose.prod.yml up -d"
```

---

### 2. VPS + Managed PostgreSQL + Managed Redis

**Mimari:**
```
┌─────────────────────────────────────────┐
│  VPS (2GB RAM, 1 CPU, 40GB SSD)        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Docker Compose                   │ │
│  │                                   │ │
│  │  ┌─────────┐                      │ │
│  │  │ App     │                      │ │
│  │  │ (Next)  │                      │ │
│  │  └────┬────┘                      │ │
│  │       │                            │ │
│  └───────┼────────────────────────────┘ │
│          │                              │
└──────────┼──────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───┴────┐  ┌────┴───┐
│Managed │  │Managed │
│Postgres│  │Redis   │
│(Neon)  │  │(Upstash│
│        │  │)       │
└────────┘  └────────┘
```

**Uyum:** ⭐⭐⭐⭐ (4/5)

**Mevcut yapıyla uyum:**
- ⚠️ docker-compose.prod.yml **değişiklik gerekli** (postgres, redis, backup kaldır)
- ✅ Dockerfile **değişiklik gerektirmez**
- ✅ Health checks **çalışır** (DATABASE_URL, REDIS_URL pointing to managed services)
- ❌ Backup service **kullanılamaz** (managed service kendi backup'ını yapar)
- ⚠️ CI/CD pipeline **değişiklik gerekli** (deploy script)

**Maliyet/Operasyon:**
- **Maliyet:** $15-25/ay (VPS) + $19/ay (Neon) + $10/ay (Upstash) + $10/ay (domain) = **~$54-64/ay**
- **Operasyon:** Düşük-Orta (managed DB'ler otomatik backup, scaling)
- **Zaman:** 2-3 gün setup

**Avantajlar:**
- PostgreSQL/Redis managed (otomatik backup, scaling, maintenance)
- VPS daha küçük/ucuz (sadece app)
- Better performance (dedicated DB resources)
- Otomatik failover (managed services)
- SSL/TLS otomatik (managed DB'ler)

**Dezavantajlar:**
- docker-compose.prod.yml **değişiklik gerekli** (postgres, redis, backup kaldır)
- Backup service **kullanılamaz** (managed service backup'ı farklı)
- Network latency (VPS ↔ managed DB)
- 3 ayrı fatura (VPS, Neon, Upstash)
- Managed service vendor lock-in

**Production riskleri:**
- 🟢 VPS downtime = app downtime ama DB/Redis ayakta
- 🟢 Managed DB'ler otomatik failover
- 🟢 Otomatik backup (managed service)
- 🟡 Network latency (VPS ↔ managed DB — aynı region'da minimal)
- 🟡 Vendor lock-in (Neon, Upstash)

**Gereken değişiklikler:**
- docker-compose.prod.yml: **postgres, redis, backup servislerini kaldır**
- Dockerfile: **YOK**
- CI/CD: Deploy script + environment variables (DATABASE_URL, REDIS_URL managed)
- DNS: A record → VPS IP
- SSL: Caddy/Nginx (Let's Encrypt)

**docker-compose.prod.yml değişikliği:**
```yaml
services:
  app:
    environment:
      DATABASE_URL: ${DATABASE_URL}  # Neon connection string
      REDIS_URL: ${REDIS_URL}        # Upstash connection string
    depends_on: []  # postgres, redis kaldırıldı
  # postgres: kaldırıldı
  # redis: kaldırıldı
  # backup: kaldırıldı
```

---

### 3. Cloud Managed Container Platform (AWS ECS/Fargate)

**Mimari:**
```
┌─────────────────────────────────────────────────┐
│  AWS Cloud                                      │
│                                                 │
│  ┌──────────────┐                              │
│  │  ALB         │                              │
│  │  (SSL term.) │                              │
│  └──────┬───────┘                              │
│         │                                       │
│  ┌──────┴───────┐                              │
│  │  ECS Fargate │                              │
│  │              │                              │
│  │  ┌────────┐ │                              │
│  │  │ App    │ │                              │
│  │  │(Next)  │ │                              │
│  │  └────────┘ │                              │
│  └──────────────┘                              │
│         │                                       │
│  ┌──────┴───────┐  ┌────────────┐             │
│  │  RDS         │  │  ElastiCache│             │
│  │  (Postgres)  │  │  (Redis)    │             │
│  └──────────────┘  └────────────┘             │
│                                                 │
│  ┌──────────────┐                              │
│  │  S3          │                              │
│  │  (Backups)   │                              │
│  └──────────────┘                              │
└─────────────────────────────────────────────────┘
```

**Uyum:** ⭐⭐⭐ (3/5)

**Mevcut yapıyla uyum:**
- ❌ docker-compose.prod.yml **kullanılamaz** (ECS task definition gerekli)
- ⚠️ Dockerfile **küçük değişiklik** (ECR için)
- ⚠️ Health checks **çalışır** (ALB health check)
- ❌ Backup service **kullanılamaz** (RDS otomatik backup)
- ❌ CI/CD pipeline **büyük değişiklik** (ECR push, ECS deploy)

**Maliyet/Operasyon:**
- **Maliyet:** $50-100/ay (ECS) + $50-100/ay (RDS) + $30-50/ay (ElastiCache) + $20/ay (ALB) + $10/ay (S3) = **~$160-280/ay**
- **Operasyon:** Yüksek (AWS knowledge gerekli, IAM, VPC, security groups)
- **Zaman:** 1-2 hafta setup

**Avantajlar:**
- Full managed (AWS bakımı)
- Otomatik scaling (horizontal + vertical)
- High availability (multi-AZ)
- Otomatik backup (RDS snapshots)
- Enterprise-grade security (IAM, VPC, KMS)
- Monitoring (CloudWatch)

**Dezavantajlar:**
- docker-compose.prod.yml **kullanılamaz** (ECS task definition yaz)
- Backup service **kullanılamaz** (RDS otomatik backup)
- CI/CD **büyük değişiklik** (ECR, ECS deploy)
- Yüksek maliyet (küçük proje için overkill)
- AWS knowledge gerekli (learning curve)
- Vendor lock-in (AWS)

**Production riskleri:**
- 🟢 High availability (multi-AZ)
- 🟢 Otomatik scaling
- 🟢 Managed services (AWS bakımı)
- 🟡 Yüksek maliyet
- 🟡 Karmaşık mimari (VPC, IAM, security groups)
- 🟡 AWS knowledge gerekli

**Gereken değişiklikler:**
- docker-compose.prod.yml: **KULLANILAMAZ** (ECS task definition yaz)
- Dockerfile: **ECR için small change**
- CI/CD: **BÜYÜK DEĞİŞİKLİK** (ECR push, ECS deploy, IAM roles)
- DNS: Route53 (ALB CNAME)
- SSL: ACM (ALB)

**Yeni infrastructure:**
- ECS Task Definition (app container)
- ECS Service (desired count, load balancer)
- RDS PostgreSQL (multi-AZ, backup)
- ElastiCache Redis (cluster mode)
- ALB (listener, target group)
- S3 (backups, assets)
- VPC, subnets, security groups
- IAM roles, policies

---

### 4. Vercel/benzeri Managed Next.js Platform

**Mimari:**
```
┌─────────────────────────────────────────────────┐
│  Vercel Platform                                │
│                                                 │
│  ┌──────────────┐                              │
│  │  Next.js App │                              │
│  │  (Serverless)│                              │
│  │              │                              │
│  │  ┌────────┐ │                              │
│  │  │ API    │ │                              │
│  │  │ Routes │ │                              │
│  │  └────────┘ │                              │
│  └──────────────┘                              │
│                                                 │
│  Edge Network (CDN)                            │
└─────────────────────────────────────────────────┘
         │
    ┌────┴────┐
    │         │
┌───┴───┐ ┌──┴───┐
│Neon   │ │Upstsh│
│(PG)   │ │(Redis│
└───────┘ └──────┘
```

**Uyum:** ⭐⭐ (2/5)

**Mevcut yapıyla uyum:**
- ❌ docker-compose.prod.yml **KULLANILAMAZ** (Vercel Docker kullanmaz)
- ❌ Dockerfile **KULLANILAMAZ** (Vercel kendi build sistemini kullanır)
- ⚠️ Health checks **farklı** (Vercel kendi health check'ini yapar)
- ❌ Backup service **KULLANILAMAZ** (Neon otomatik backup)
- ❌ CI/CD pipeline **farklı** (Vercel GitHub integration)
- ⚠️ next.config.ts **küçük değişiklik** (output: 'standalone' kaldır)

**Maliyet/Operasyon:**
- **Maliyet:** $20/ay (Vercel Pro) + $19/ay (Neon) + $10/ay (Upstash) + $10/ay (domain) = **~$59/ay**
- **Operasyon:** Çok düşük (Vercel her şeyi yönetir)
- **Zaman:** 1 gün setup

**Avantajlar:**
- En kolay setup (git push = deploy)
- Otomatik scaling (serverless)
- Global CDN (edge network)
- Otomatik SSL
- Zero-config deployment
- Preview deployments (PR'ler için)
- Analytics (built-in)

**Dezavantajlar:**
- docker-compose.prod.yml **KULLANILAMAZ**
- Dockerfile **KULLANILAMAZ**
- Backup service **KULLANILAMAZ**
- Redis **sınırlı** (Upstash serverless Redis — rate limiting için yeterli ama persistent connection yok)
- PostgreSQL **sınırlı** (Neon serverless — connection pooling farklı)
- Vendor lock-in (Vercel)
- Next.js dışındaki özellikler kullanılamaz
- Uzun vadesiz maliyet (serverless premium)
- Better Auth **sorunlu olabilir** (serverless environment'de session management)

**Production riskleri:**
- 🟢 Zero downtime deployments
- 🟢 Otomatik scaling
- 🟢 Global CDN
- 🟡 Better Auth serverless uyumluluğu (session_token cookie — test edilmeli)
- 🟡 Redis persistent connection yok (Upstash HTTP API)
- 🟡 Vendor lock-in (Vercel)
- 🔴 docker-compose.prod.yml **tamamen devre dışı**

**Gereken değişiklikler:**
- docker-compose.prod.yml: **KULLANILAMAZ** (sil)
- Dockerfile: **KULLANILAMAZ** (sil)
- CI/CD: **TAMAMEN FARKLI** (Vercel GitHub integration)
- DNS: Vercel nameservers
- SSL: Vercel otomatik (Let's Encrypt)
- next.config.ts: `output: 'standalone'` **kaldır**

**Yeni infrastructure:**
- Vercel project (GitHub integration)
- Neon PostgreSQL (serverless)
- Upstash Redis (serverless)
- Environment variables (Vercel dashboard)

---

## Karşılaştırma Tablosu

| Kriter | 1. Tek VPS | 2. VPS + Managed DB | 3. AWS ECS | 4. Vercel |
|--------|------------|---------------------|------------|-----------|
| **Uyum** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Maliyet/ay** | $30-55 | $54-64 | $160-280 | $59 |
| **Operasyon** | Orta | Düşük-Orta | Yüksek | Çok Düşük |
| **Setup süresi** | 1-2 gün | 2-3 gün | 1-2 hafta | 1 gün |
| **docker-compose.prod.yml** | ✅ Değişiklik yok | ⚠️ Değişiklik gerekli | ❌ Kullanılamaz | ❌ Kullanılamaz |
| **Dockerfile** | ✅ Değişiklik yok | ✅ Değişiklik yok | ⚠️ Küçük değişiklik | ❌ Kullanılamaz |
| **Health checks** | ✅ Olduğu gibi | ✅ Olduğu gibi | ⚠️ ALB health check | ⚠️ Farklı |
| **Backup service** | ✅ Olduğu gibi | ❌ Kullanılamaz | ❌ Kullanılamaz | ❌ Kullanılamaz |
| **CI/CD** | ⚠️ Deploy script ekle | ⚠️ Deploy script ekle | ❌ Büyük değişiklik | ❌ Tamamen farklı |
| **PostgreSQL** | ✅ Aynı VPS'de | ✅ Managed (Neon) | ✅ Managed (RDS) | ✅ Managed (Neon) |
| **Redis** | ✅ Aynı VPS'de | ✅ Managed (Upstash) | ✅ Managed (ElastiCache) | ⚠️ Managed (Upstash — sınırlı) |
| **HTTPS/SSL** | ✅ Caddy otomatik | ✅ Caddy/Nginx otomatik | ✅ ACM (ALB) | ✅ Vercel otomatik |
| **DNS** | ✅ A record | ✅ A record | ✅ Route53 | ✅ Vercel nameservers |
| **Monitoring** | ⚠️ Kurulum gerekli | ⚠️ Kurulum gerekli | ✅ CloudWatch | ✅ Vercel Analytics |
| **Ölçeklenebilirlik** | 🟡 Dikey scaling | 🟡 Dikey scaling | 🟢 Horizontal + vertical | 🟢 Serverless (otomatik) |
| **High availability** | 🔴 Single point | 🟡 Managed DB HA | 🟢 Multi-AZ | 🟢 Global CDN |
| **Vendor lock-in** | 🟢 Düşük | 🟡 Orta (Neon, Upstash) | 🔴 Yüksek (AWS) | 🔴 Yüksek (Vercel) |
| **Production riskleri** | 🟡 Orta | 🟢 Düşük | 🟢 Çok düşük | 🟡 Orta (Better Auth uyumluluğu) |

---

## Öneri

### Recommended: **2. VPS + Managed PostgreSQL + Managed Redis**

**Neden:**
1. **En iyi denge:** Maliyet ($54-64/ay) vs operasyon karmaşıklığı (düşük-orta)
2. **Minimal değişiklik:** docker-compose.prod.yml'de sadece postgres, redis, backup kaldır
3. **Managed DB avantajları:** Otomatik backup, scaling, maintenance, failover
4. **Repository yapısı korunur:** Dockerfile, health checks, app container aynı kalır
5. **Production-ready:** Managed DB'ler production-grade (Neon, Upstash)
6. **Vendor lock-in kabul edilebilir:** Neon/Upstash standard PostgreSQL/Redis (migrate edilebilir)

**Gereken değişiklikler:**
- docker-compose.prod.yml: postgres, redis, backup servislerini kaldır
- CI/CD: Deploy script ekle (SSH + docker compose pull + up)
- Environment variables: DATABASE_URL (Neon), REDIS_URL (Upstash) ekle
- DNS: A record → VPS IP
- SSL: Caddy veya Nginx (Let's Encrypt)

### Alternative: **1. Tek VPS + Docker Compose**

**Neden:**
1. **En düşük maliyet:** $30-55/ay
2. **Sıfır değişiklik:** docker-compose.prod.yml birebir kullanılır
3. **Basit mimari:** Tek sunucu, tek nokta
4. **Hızlı setup:** 1-2 gün

**Ama:**
- Single point of failure (VPS çökerse her şey çöker)
- Resource contention (PostgreSQL + Redis + App aynı sunucuda)
- Backup'lar aynı sunucuda (disaster recovery zayıf)
- Manuel scaling

**Kullanım senaryosu:** MVP, düşük trafik (günlük <10K kullanıcı), bütçe kısıtlı

---

## Gerekli Infrastructure (Recommended: Option 2)

### Required infrastructure:
- **VPS:** 2GB RAM, 1 CPU, 40GB SSD (Hetzner, DigitalOcean, Vultr)
- **Managed PostgreSQL:** Neon (serverless, otomatik scaling)
- **Managed Redis:** Upstash (serverless, otomatik scaling)
- **Domain:** destinyrisinghub.com (Namecheap, Cloudflare)
- **Reverse proxy:** Caddy (otomatik SSL) veya Nginx

### Required secrets:
```bash
# VPS
VPS_IP="x.x.x.x"
VPS_SSH_KEY="ssh-rsa ..."

# Database (Neon)
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Redis (Upstash)
REDIS_URL="rediss://default:password@host.upstash.io:6379"

# Auth
BETTER_AUTH_SECRET="openssl-rand-base64-48-output"

# App
NEXT_PUBLIC_APP_URL="https://destinyrisinghub.com"
BETTER_AUTH_URL="https://destinyrisinghub.com"
TRUSTED_ORIGINS="https://destinyrisinghub.com,https://www.destinyrisinghub.com"

# Optional
SENTRY_DSN="https://..."
SMTP_HOST="..."
S3_ACCESS_KEY="..."
```

### Required DNS:
```dns
destinyrisinghub.com.       A     x.x.x.x  (VPS IP)
www.destinyrisinghub.com.   CNAME destinyrisinghub.com.
```

### Required SSL:
- **Provider:** Let's Encrypt (Caddy otomatik)
- **Certificate:** Wildcard (*.destinyrisinghub.com) veya domain (destinyrisinghub.com)
- **Renewal:** Otomatik (Caddy)

### Required deployment target:
- **VPS:** Ubuntu 22.04 LTS
- **Docker:** 24.0+
- **Docker Compose:** 2.20+
- **Caddy:** 2.7+ (reverse proxy + SSL)
- **Firewall:** UFW (80, 443, 22)

### Required CI/CD changes:
```yaml
# .github/workflows/ci.yml — deploy-production job
deploy-production:
  name: 🚀 Deploy Production
  runs-on: ubuntu-latest
  needs: [docker-build, trivy-scan, sbom-generation]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  environment: production
  steps:
    - uses: actions/checkout@v4
    
    - name: Setup SSH
      run: |
        mkdir -p ~/.ssh
        echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
    
    - name: Deploy to VPS
      run: |
        ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no user@${{ secrets.VPS_IP }} << 'EOF'
          cd /app
          docker compose -f docker-compose.prod.yml pull
          docker compose -f docker-compose.prod.yml up -d
          docker system prune -f
        EOF
    
    - name: Health check
      run: |
        sleep 30
        curl -f https://destinyrisinghub.com/api/health || exit 1
```

---

## Sonuç

```
=== DEPLOYMENT ARCHITECTURE REVIEW ===

Recommended:
  2. VPS + Managed PostgreSQL + Managed Redis
  - Maliyet: $54-64/ay
  - Setup: 2-3 gün
  - Operasyon: Düşük-Orta
  - docker-compose.prod.yml: Değişiklik gerekli (postgres, redis, backup kaldır)
  - Production riskleri: Düşük

Alternative:
  1. Tek VPS + Docker Compose
  - Maliyet: $30-55/ay
  - Setup: 1-2 gün
  - Operasyon: Orta
  - docker-compose.prod.yml: Değişiklik YOK
  - Production riskleri: Orta (single point of failure)

Why:
  Option 2, managed DB avantajları (otomatik backup, scaling, failover) ile
  minimal repository değişikliği sunar. Option 1 daha ucuz ama single point
  of failure riski taşır. Option 3 (AWS) küçük proje için overkill.
  Option 4 (Vercel) docker-compose.prod.yml'i devre dışı bırakır.

Required infrastructure:
  - VPS (2GB RAM, 1 CPU, 40GB SSD — Hetzner, DigitalOcean, Vultr)
  - Managed PostgreSQL (Neon — serverless)
  - Managed Redis (Upstash — serverless)
  - Domain (destinyrisinghub.com)
  - Reverse proxy (Caddy — otomatik SSL)

Required secrets:
  - DATABASE_URL (Neon connection string — SSL/TLS)
  - REDIS_URL (Upstash connection string — SSL/TLS)
  - BETTER_AUTH_SECRET (openssl rand -base64 48)
  - VPS_SSH_KEY (deployment için)
  - VPS_IP (deployment için)

Required DNS:
  - destinyrisinghub.com → A record → VPS IP
  - www.destinyrisinghub.com → CNAME → destinyrisinghub.com

Required SSL:
  - Let's Encrypt (Caddy otomatik renewal)
  - Domain certificate (destinyrisinghub.com)

Required deployment target:
  - Ubuntu 22.04 LTS
  - Docker 24.0+
  - Docker Compose 2.20+
  - Caddy 2.7+ (reverse proxy + SSL)
  - Firewall (80, 443, 22)

Required CI/CD changes:
  - .github/workflows/ci.yml: deploy-production job implement et
  - GitHub Secrets: VPS_SSH_KEY, VPS_IP, DATABASE_URL, REDIS_URL, BETTER_AUTH_SECRET
  - Deploy script: SSH + docker compose pull + up

CODE CHANGES REQUIRED: YES (minimal)
  - docker-compose.prod.yml: postgres, redis, backup servislerini kaldır
  - .github/workflows/ci.yml: deploy-production job implement et

FINAL: ARCHITECTURE DECISION REQUIRED
```

---

## Detaylı Analiz

### Option 2 İçin docker-compose.prod.yml Değişikliği

**Mevcut:**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    # ... (50+ satır)
  
  redis:
    image: redis:7-alpine
    # ... (30+ satır)
  
  app:
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
  
  backup:
    image: prodrigestivill/postgres-backup-local
    # ... (20+ satır)
```

**Yeni:**
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}  # Neon connection string
      REDIS_URL: ${REDIS_URL}        # Upstash connection string
      # ... diğer environment variables
    ports:
      - "${APP_PORT:-3000}:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
    # depends_on kaldırıldı (managed DB'ler external)

networks:
  destiny-prod-network:
    driver: bridge
```

**Kaldırılan:**
- postgres service (50+ satır)
- redis service (30+ satır)
- backup service (20+ satır)
- postgres_prod_data volume
- redis_prod_data volume
- backup_prod_data volume

**Eklenen:**
- DATABASE_URL environment variable (Neon)
- REDIS_URL environment variable (Upstash)

**Sonuç:** ~100 satır azaltıldı, managed DB'ler external.

---

### Option 2 İçin Caddy Konfigürasyonu

**Caddyfile:**
```caddyfile
destinyrisinghub.com {
    reverse_proxy localhost:3000
    
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}

www.destinyrisinghub.com {
    redir https://destinyrisinghub.com{uri} permanent
}
```

**Otomatik SSL:** Caddy Let's Encrypt'ten otomatik certificate alır ve yeniler.

---

### Option 2 İçin Maliyet Analizi

**Aylık maliyet:**
- VPS (Hetzner CX21): €4.85/ay (~$5.30)
- Neon PostgreSQL (free tier → $19/ay): $19/ay
- Upstash Redis (free tier → $10/ay): $10/ay
- Domain (Namecheap): $10/yıl (~$0.83/ay)
- **Toplam: ~$35-36/ay**

**Yıllık maliyet: ~$420-432**

**Karşılaştırma:**
- Option 1 (Tek VPS): $30-55/ay → $360-660/yıl
- Option 3 (AWS ECS): $160-280/ay → $1920-3360/yıl
- Option 4 (Vercel): $59/ay → $708/yıl

**Sonuç:** Option 2 en iyi fiyat/performans dengesi.

---

**FINAL: ARCHITECTURE DECISION REQUIRED**

Onay sonrası infrastructure provisioning ve deployment automation implementasyonu yapılabilir.
