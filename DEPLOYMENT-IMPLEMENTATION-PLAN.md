# Deployment Implementation Plan
**Tarih:** 2026-08-09  
**Mimari:** Option 2 — VPS + Managed PostgreSQL (Neon) + Managed Redis (Upstash)  
**Durum:** Implementation Plan (henüz değişiklik yok)

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Actions CI/CD                                           │
│                                                                 │
│  Push to main → Lint/Test/Build → Trivy Scan → GHCR Push       │
│                                         │                       │
│                                         ↓                       │
│                              ghcr.io/org/repo:sha              │
└─────────────────────────────────────────┬───────────────────────┘
                                          │
                                          │ SSH Deploy
                                          ↓
┌─────────────────────────────────────────────────────────────────┐
│  Production VPS (Ubuntu 22.04)                                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Docker Compose (docker-compose.prod.yml)                 │ │
│  │                                                           │ │
│  │  ┌─────────────┐                                         │ │
│  │  │ App         │ ← image: ghcr.io/org/repo:sha          │ │
│  │  │ (Next.js)   │   (immutable, pre-built)                │ │
│  │  │ :3000       │                                         │ │
│  │  └──────┬──────┘                                         │ │
│  │         │                                                 │ │
│  └─────────┼─────────────────────────────────────────────────┘ │
│            │                                                    │
│  ┌─────────┴─────────────────────────────────────────────────┐ │
│  │  Caddy (Reverse Proxy)                                    │ │
│  │  :80 → redirect :443                                      │ │
│  │  :443 → proxy :3000 (app)                                 │ │
│  │  Automatic SSL (Let's Encrypt)                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────┴──────────┐       ┌─────────┴──────────┐
    │  Neon PostgreSQL   │       │  Upstash Redis     │
    │  (Serverless)      │       │  (Serverless)      │
    │                    │       │                    │
    │  - Auto backup     │       │  - Auto scaling    │
    │  - Auto scaling    │       │  - TLS enabled     │
    │  - TLS enabled     │       │  - REST API        │
    │  - Connection pool │       │                    │
    └────────────────────┘       └────────────────────┘
```

**Temel Prensip:** Production VPS'te source build yapılmaz. CI build eder, GHCR'a push eder, VPS sadece pull + up yapar.

---

## 2. Files to Modify

### 2.1 `docker-compose.prod.yml`

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
    build:
      context: .
      dockerfile: Dockerfile
      target: runner
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
    image: ghcr.io/${GITHUB_REPOSITORY}:${IMAGE_TAG}
    container_name: destiny-prod-app
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL}
      NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME}
      TRUSTED_ORIGINS: ${TRUSTED_ORIGINS}
      S3_ENDPOINT: ${S3_ENDPOINT}
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
      S3_BUCKET: ${S3_BUCKET}
      S3_REGION: ${S3_REGION}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
      SMTP_FROM: ${SMTP_FROM}
      SENTRY_DSN: ${SENTRY_DSN}
    ports:
      - "127.0.0.1:3000:3000"  # Sadece localhost'tan erişilebilir (Caddy arkasında)
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
    networks:
      - destiny-prod-network

  caddy:
    image: caddy:2-alpine
    container_name: destiny-prod-caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"  # HTTP/3
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      app:
        condition: service_healthy
    networks:
      - destiny-prod-network

networks:
  destiny-prod-network:
    driver: bridge

volumes:
  caddy_data:
  caddy_config:
```

**Değişiklikler:**
- ❌ postgres service kaldırıldı
- ❌ redis service kaldırıldı
- ❌ backup service kaldırıldı
- ❌ app `build:` → `image:` (GHCR'dan pull)
- ✅ DATABASE_URL: managed Neon connection string
- ✅ REDIS_URL: managed Upstash connection string
- ✅ BETTER_AUTH_SECRET eklendi
- ✅ BETTER_AUTH_URL eklendi
- ✅ TRUSTED_ORIGINS eklendi
- ✅ ports: `127.0.0.1:3000` (sadece localhost — Caddy arkasında)
- ✅ caddy service eklendi (reverse proxy + SSL)

---

### 2.2 `.github/workflows/ci.yml`

**Mevcut deploy-production (TODO):**
```yaml
deploy-production:
  name: 🚀 Deploy Production
  runs-on: ubuntu-latest
  needs: [docker-build, trivy-scan, sbom-generation]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  environment: production
  steps:
    - uses: actions/checkout@v4
    - name: Pre-deploy backup
      run: |
        echo "💾 Creating pre-deploy backup..."
        # TODO: pg_dump / volume snapshot
    - name: Deploy to production
      run: |
        echo "🚀 Deploying to production..."
        # TODO: docker compose -f docker-compose.prod.yml up -d
    - name: Post-deploy smoke tests
      run: |
        echo "🧪 Post-deploy smoke tests..."
        # TODO: curl -f https://destinyrisinghub.com/api/health
```

**Yeni deploy-production:**
```yaml
deploy-production:
  name: 🚀 Deploy Production
  runs-on: ubuntu-latest
  needs: [docker-build, trivy-scan, sbom-generation]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  environment: production
  steps:
    - uses: actions/checkout@v4
    
    - name: Log in to GHCR
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: |
          ghcr.io/${{ github.repository }}:${{ github.sha }}
          ghcr.io/${{ github.repository }}:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Setup SSH
      run: |
        mkdir -p ~/.ssh
        echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/deploy_key
        chmod 600 ~/.ssh/deploy_key
        ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts
    
    - name: Deploy to VPS
      run: |
        ssh -i ~/.ssh/deploy_key ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << 'ENDSSH'
          cd /opt/destiny-rising-hub
          
          # Pull latest docker-compose.prod.yml (repo güncellendiysе)
          git pull origin main || true
          
          # Set image tag
          echo "IMAGE_TAG=${{ github.sha }}" > .env
          
          # Pull new image
          docker compose -f docker-compose.prod.yml pull
          
          # Rolling update
          docker compose -f docker-compose.prod.yml up -d --remove-orphans
          
          # Cleanup old images
          docker image prune -f
        ENDSSH
    
    - name: Health check
      run: |
        echo "Waiting for deployment..."
        sleep 30
        
        echo "Running health check..."
        for i in {1..10}; do
          if curl -f -s https://destinyrisinghub.com/api/health > /dev/null; then
            echo "✅ Health check passed"
            exit 0
          fi
          echo "Attempt $i/10 failed, retrying in 10s..."
          sleep 10
        done
        
        echo "❌ Health check failed"
        exit 1
    
    - name: Rollback on failure
      if: failure()
      run: |
        echo "❌ Deployment failed, initiating rollback..."
        
        # Get previous image tag
        PREV_TAG=$(ssh -i ~/.ssh/deploy_key ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
          "cd /opt/destiny-rising-hub && docker compose -f docker-compose.prod.yml images app | tail -1 | awk '{print \$4}'")
        
        if [ -z "$PREV_TAG" ] || [ "$PREV_TAG" = "${{ github.sha }}" ]; then
          echo "No previous image available, skipping rollback"
          exit 1
        fi
        
        echo "Rolling back to $PREV_TAG..."
        ssh -i ~/.ssh/deploy_key ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} << ENDSSH
          cd /opt/destiny-rising-hub
          echo "IMAGE_TAG=$PREV_TAG" > .env
          docker compose -f docker-compose.prod.yml pull
          docker compose -f docker-compose.prod.yml up -d --remove-orphans
        ENDSSH
        
        echo "✅ Rollback complete"
```

**Değişiklikler:**
- ✅ GHCR login eklendi
- ✅ Docker build + push (GHCR'a)
- ✅ Immutable tag: `ghcr.io/repo:sha` + `latest`
- ✅ SSH deployment (VPS'e bağlanıp docker compose pull + up)
- ✅ Health check (10 deneme, 10'ar saniye aralık)
- ✅ Rollback on failure (önceki image tag'e geri dön)

---

## 3. Files to Create

### 3.1 `Caddyfile` (repository root)

```caddyfile
# Production Caddy Configuration
# Destiny Rising Hub

destinyrisinghub.com {
    # Reverse proxy to Next.js app
    reverse_proxy app:3000 {
        # Health check
        health_uri /api/health
    }
    
    # Security headers (Next.js zaten ekliyor ama Caddy de ekleyebilir)
    header {
        # HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        
        # Remove server header
        -Server
        
        # Remove X-Powered-By
        -X-Powered-By
    }
    
    # Logging
    log {
        output file /data/access.log {
            roll_size 100mb
            roll_keep 10
            roll_keep_for 720h
        }
        format json
        level INFO
    }
}

# WWW redirect
www.destinyrisinghub.com {
    redir https://destinyrisinghub.com{uri} permanent
}
```

**Konum:** Repository root (`/Caddyfile`)

**Neden repository'de:**
- Version control
- Review process
- Consistency across environments
- Easy rollback

---

### 3.2 `.github/workflows/deploy.yml` (opsiyonel — ayrı workflow)

Eğer CI'dan ayrı bir deployment workflow istenirse:

```yaml
name: Deploy to Production

on:
  workflow_run:
    workflows: ["CI/CD Pipeline"]
    types:
      - completed
    branches: [main]

jobs:
  deploy:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    environment: production
    steps:
      # ... deployment steps
```

**Ama:** Mevcut ci.yml'e deploy job eklemek daha basit (önerilen).

---

## 4. Files that Must NOT be Modified

### 4.1 `Dockerfile`
- ✅ Değişiklik YOK
- Multi-stage build zaten production-ready
- `runner` stage kullanılacak

### 4.2 `docker-compose.yml` (development)
- ✅ Değişiklik YOK
- Development ortamı için postgres/redis/minio/mailpit gerekli

### 4.3 `next.config.ts`
- ✅ Değişiklik YOK
- Security headers zaten mevcut (HSTS dahil)

### 4.4 `src/lib/auth/index.ts`
- ✅ Değişiklik YOK
- Better Auth config production-ready

### 4.5 `src/app/api/health/route.ts`
- ✅ Değişiklik YOK
- Health check endpoint production-ready

### 4.6 `prisma/schema.prisma`
- ✅ Değişiklik YOK
- Schema freeze korunuyor

### 4.7 `.env.production.example`
- ✅ Değişiklik YOK
- Template zaten oluşturuldu

---

## 5. GHCR Strategy

### 5.1 Registry

**GitHub Container Registry (GHCR):**
- URL: `ghcr.io`
- Authentication: `GITHUB_TOKEN` (otomatik)
- Visibility: Private (default) veya Public

### 5.2 Image Naming

```
ghcr.io/${{ github.repository }}:<tag>
```

**Örnek:**
```
ghcr.io/arvelos34/destiny-rising-hub:a6810a1f4a1c170634d89983c346c8edb83ce8ba
ghcr.io/arvelos34/destiny-rising-hub:latest
```

### 5.3 Authentication

**GitHub Actions (otomatik):**
```yaml
- name: Log in to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

**VPS (deployment sırasında):**
```bash
echo "${{ secrets.GHCR_PAT }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
```

**Gerekli Secret:**
- `GHCR_PAT` — GitHub Personal Access Token (scope: `read:packages`)

### 5.4 Permissions

**GitHub Repository Settings → Actions → General:**
- ✅ Allow GitHub Actions to create and approve pull requests
- ✅ Allow Actions to return and create secrets

**GitHub Repository Settings → Packages:**
- ✅ Inherit access from repository (default)

---

## 6. Docker Image Tagging Strategy

### 6.1 Tag Format

```yaml
tags: |
  ghcr.io/${{ github.repository }}:${{ github.sha }}
  ghcr.io/${{ github.repository }}:latest
```

**Immutable tag:** `github.sha` (commit hash)
- Değişmez
- Geriye dönük deploy/rollback için kullanılabilir
- Audit trail

**Mutable tag:** `latest`
- Her deploy'da güncellenir
- Convenience için

### 6.2 Örnek Tag'ler

```
ghcr.io/arvelos34/destiny-rising-hub:a6810a1f4a1c170634d89983c346c8edb83ce8ba
ghcr.io/arvelos34/destiny-rising-hub:befa1217359022c2887268bc555bd73d790343be
ghcr.io/arvelos34/destiny-rising-hub:latest
```

### 6.3 Retention Policy

**GHCR default:**
- Paketler silinmez (manuel veya GitHub Actions ile temizlenebilir)
- Last 100 version tutulabilir (opsiyonel cleanup workflow)

**Önerilen:**
- Son 30 günün image'larını tut
- Daha eski image'ları otomatik sil (cleanup workflow)

---

## 7. docker-compose.prod.yml Migration

### 7.1 Migration Adımları

**Step 1: docker-compose.prod.yml'i güncelle**
- postgres service kaldır
- redis service kaldır
- backup service kaldır
- app service'de `build:` → `image:`
- DATABASE_URL: managed Neon connection string
- REDIS_URL: managed Upstash connection string
- caddy service ekle

**Step 2: .env dosyası oluştur (VPS'te)**
```bash
cd /opt/destiny-rising-hub
cat > .env << 'EOF'
IMAGE_TAG=latest
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
REDIS_URL=rediss://default:password@host.upstash.io:6379
BETTER_AUTH_SECRET=generate-a-secure-random-64-char-string-here
BETTER_AUTH_URL=https://destinyrisinghub.com
NEXT_PUBLIC_APP_URL=https://destinyrisinghub.com
NEXT_PUBLIC_APP_NAME=Destiny Rising Hub
TRUSTED_ORIGINS=https://destinyrisinghub.com,https://www.destinyrisinghub.com
# ... diğer variables
EOF

chmod 600 .env
```

**Step 3: Caddyfile'i VPS'e kopyala**
```bash
# Repository'den Caddyfile'i çek
cd /opt/destiny-rising-hub
git pull origin main

# Veya manuel kopyala
scp Caddyfile user@vps:/opt/destiny-rising-hub/Caddyfile
```

**Step 4: İlk deployment**
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

**Step 5: Health check**
```bash
curl -f https://destinyrisinghub.com/api/health
```

### 7.2 Migration Riskleri

**Risk 1: İlk deployment sırasında downtime**
- **Çözüm:** Maintenance page göster veya gece geç saatte deploy et

**Risk 2: DNS propagation gecikmesi**
- **Çözüm:** DNS'i önceden ayarla, propagation bekle

**Risk 3: SSL certificate issuance**
- **Çözüm:** Caddy ilk启动'da otomatik certificate alır (birkaç saniye)

**Risk 4: Database migration**
- **Çözüm:** docker-entrypoint.sh zaten migration yapar (`prisma migrate deploy`)

---

## 8. Caddy Configuration

### 8.1 Caddyfile Konumu

**Repository:** `/Caddyfile` (root)

**VPS:** `/opt/destiny-rising-hub/Caddyfile`

**Docker volume mount:**
```yaml
volumes:
  - ./Caddyfile:/etc/caddy/Caddyfile:ro
  - caddy_data:/data
  - caddy_config:/config
```

### 8.2 Caddy Features

**Otomatik SSL:**
- Let's Encrypt'ten otomatik certificate
- Otomatik renewal (30 gün önceden)
- HTTP → HTTPS redirect

**Reverse Proxy:**
- `app:3000`'e proxy
- HTTP/2 support
- WebSocket support

**Security:**
- HSTS header
- Server header kaldırma
- X-Powered-By kaldırma

**Logging:**
- JSON format
- Log rotation (100MB, 10 dosya, 30 gün)

### 8.3 Caddy vs Nginx

**Neden Caddy?**
- ✅ Otomatik SSL (zero-config)
- ✅ HTTP/3 support
- ✅ Basit konfigürasyon
- ✅ Modern defaults
- ✅ Docker-friendly

**Neden Nginx değil?**
- ❌ Manuel SSL configuration (certbot)
- ❌ Daha karmaşık konfigürasyon
- ❌ HTTP/3 support eksik (yeni sürümlerde var ama ek setup gerekli)

---

## 9. VPS Directory Structure

```
/opt/destiny-rising-hub/
├── .env                          # Environment variables (gitignored)
├── .env.production.example       # Template (repository'den)
├── docker-compose.prod.yml       # Production compose (repository'den)
├── Caddyfile                     # Caddy config (repository'den)
├── .git/                         # Git repo
│   └── ...
└── [other repository files]      # Source code (image'de var, VPS'te kullanılmıyor)

Docker volumes:
├── /var/lib/docker/volumes/
│   ├── caddy_data/               # SSL certificates, logs
│   └── caddy_config/             # Caddy runtime config
```

**Önemli:**
- VPS'te source build yapılmaz
- Sadece docker-compose.prod.yml, .env, Caddyfile kullanılır
- Application image GHCR'dan pull edilir

---

## 10. GitHub Actions Deployment Flow

### 10.1 Full Pipeline

```
Push to main
    ↓
[Stage 1: Quality Gates]
    ├── Lint & Type Check
    ├── Dependency Audit
    ├── Secret Scan
    └── License Check
    ↓
[Stage 2: Tests]
    ├── Unit Tests
    └── Integration Tests (PostgreSQL service)
    ↓
[Stage 3: Build]
    └── Next.js Build
    ↓
[Stage 4: Docker + Security]
    ├── Docker Build (GHCR push)
    ├── Trivy Scan
    └── SBOM Generation
    ↓
[Stage 5: Deploy]
    ├── SSH Setup
    ├── VPS Deploy (docker compose pull + up)
    ├── Health Check
    └── Rollback on Failure
```

### 10.2 Deployment Job Detayları

```yaml
deploy-production:
  needs: [docker-build, trivy-scan, sbom-generation]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  environment: production  # Manual approval (opsiyonel)
  steps:
    - Checkout
    - Login to GHCR
    - Build and push Docker image
    - Setup SSH
    - Deploy to VPS (docker compose pull + up)
    - Health check (10 retries, 10s interval)
    - Rollback on failure
```

### 10.3 Environment Protection

**GitHub Repository → Environments → production:**
- ✅ Required reviewers (opsiyonel — manual approval)
- ✅ Wait timer (opsiyonel — 5 dakika bekleme)
- ✅ Deployment branches (sadece main)

---

## 11. Required GitHub Secrets

### 11.1 VPS Access

| Secret | Açıklama | Örnek |
|--------|----------|-------|
| `VPS_HOST` | VPS IP veya domain | `123.45.67.89` |
| `VPS_USER` | SSH username | `deploy` |
| `VPS_SSH_KEY` | SSH private key (ED25519) | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

### 11.2 GHCR Access

| Secret | Açıklama | Örnek |
|--------|----------|-------|
| `GHCR_PAT` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |
| `GITHUB_TOKEN` | Otomatik (sağlanır) | — |

### 11.3 Application Secrets

| Secret | Açıklama | Örnek |
|--------|----------|-------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host.neon.tech/db?sslmode=require` |
| `REDIS_URL` | Upstash Redis connection string | `rediss://default:pass@host.upstash.io:6379` |
| `BETTER_AUTH_SECRET` | Session signing secret (min 32 char) | `openssl-rand-base64-48-output` |

### 11.4 Optional Secrets

| Secret | Açıklama | Örnek |
|--------|----------|-------|
| `SENTRY_DSN` | Sentry error tracking | `https://xxx@sentry.io/xxx` |
| `SMTP_HOST` | SMTP server | `smtp.sendgrid.net` |
| `SMTP_USER` | SMTP username | `apikey` |
| `SMTP_PASSWORD` | SMTP password | `SG.xxxx` |
| `S3_ACCESS_KEY` | S3/R2 access key | `AKIA...` |
| `S3_SECRET_KEY` | S3/R2 secret key | `xxxx` |

### 11.5 Secret Oluşturma

**VPS SSH Key:**
```bash
# Local terminal
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
cat ~/.ssh/github_actions_deploy  # Private key → VPS_SSH_KEY
cat ~/.ssh/github_actions_deploy.pub  # Public key → VPS'e ekle
```

**BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 48
```

**GHCR_PAT:**
- GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Scope: `read:packages`, `write:packages`

---

## 12. Required VPS Environment Variables

### 12.1 VPS `.env` Dosyası

**Konum:** `/opt/destiny-rising-hub/.env`

**İçerik:**
```bash
# Docker Image
IMAGE_TAG=latest  # CI tarafından güncellenir

# Database (Neon)
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# Redis (Upstash)
REDIS_URL="rediss://default:password@host.upstash.io:6379"

# Authentication
BETTER_AUTH_SECRET="generate-a-secure-random-64-char-string-here"
BETTER_AUTH_URL="https://destinyrisinghub.com"

# Application
NEXT_PUBLIC_APP_URL="https://destinyrisinghub.com"
NEXT_PUBLIC_APP_NAME="Destiny Rising Hub"
TRUSTED_ORIGINS="https://destinyrisinghub.com,https://www.destinyrisinghub.com"

# Storage (S3/R2)
S3_ENDPOINT="https://account.r2.cloudflarestorage.com"
S3_ACCESS_KEY="access-key"
S3_SECRET_KEY="secret-key"
S3_BUCKET="destiny-assets"
S3_REGION="auto"

# Email (SMTP)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="SG.xxxx"
SMTP_FROM="noreply@destinyrisinghub.com"

# Monitoring
SENTRY_DSN="https://xxx@sentry.io/xxx"

# App Port
APP_PORT="3000"
```

**Permissions:**
```bash
chmod 600 .env
```

### 12.2 Environment Variable Injection

**docker-compose.prod.yml'de:**
```yaml
environment:
  DATABASE_URL: ${DATABASE_URL}  # .env'den okunur
  REDIS_URL: ${REDIS_URL}
  # ...
```

**CI deployment sırasında:**
```bash
echo "IMAGE_TAG=${{ github.sha }}" > .env  # CI tarafından güncellenir
```

---

## 13. Neon Configuration

### 13.1 Neon Setup

**Sign up:** https://neon.tech

**Create project:**
- Name: `destiny-rising-hub-production`
- Region: `eu-central` (veya VPS'e en yakın)
- PostgreSQL version: `16`

**Get connection string:**
```
postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 13.2 Neon Features

**Otomatik:**
- ✅ SSL/TLS (zorunlu)
- ✅ Otomatik backup (7 gün retention)
- ✅ Otomatik scaling (compute)
- ✅ Connection pooling
- ✅ Branching (opsiyonel — staging için)

**Manuel:**
- ⚙️ Point-in-time recovery (PITR)
- ⚙️ Read replicas (yüksek trafik için)

### 13.3 Migration

**İlk migration:**
```bash
# VPS'te
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

**Veya docker-entrypoint.sh otomatik yapar:**
```bash
npx prisma migrate deploy || npx prisma db push --accept-data-loss
```

### 13.4 Backup Strategy

**Neon otomatik backup:**
- 7 gün point-in-time recovery
- Dashboard'dan restore edilebilir

**Ek backup (opsiyonel):**
```bash
# VPS'te cron job
pg_dump $DATABASE_URL | gzip > /backups/neon-$(date +%Y%m%d).sql.gz
```

---

## 14. Upstash Configuration

### 14.1 Upstash Setup

**Sign up:** https://upstash.com

**Create Redis database:**
- Name: `destiny-rising-hub-production`
- Region: `eu-central` (VPS'e en yakın)
- TLS: Enabled

**Get connection string:**
```
rediss://default:password@host.upstash.io:6379
```

**Not:** `rediss://` = SSL/TLS enabled

### 14.2 Upstash Features

**Otomatik:**
- ✅ SSL/TLS (zorunlu)
- ✅ Otomatik scaling
- ✅ Persistence (AOF)
- ✅ Eviction policy (allkeys-lru)

**Manuel:**
- ⚙️ Max memory policy
- ⚙️ Memory limit

### 14.3 Better Auth Uyumluluğu

**Rate limiting:**
- Upstash Redis HTTP API kullanır (serverless)
- `@better-auth/redis-storage` uyumlu
- Atomic increment desteklenir

**Connection:**
- `ioredis` Upstash connection string'i kabul eder
- `rediss://` = SSL/TLS enabled

---

## 15. DNS

### 15.1 DNS Records

**Domain registrar'da (Namecheap, Cloudflare, vb.):**

```dns
# A record (VPS IP)
destinyrisinghub.com.       A     123.45.67.89

# CNAME (www redirect)
www.destinyrisinghub.com.   CNAME destinyrisinghub.com.
```

### 15.2 DNS Propagation

**Propagation süresi:** 5 dakika — 48 saat

**Kontrol:**
```bash
dig destinyrisinghub.com +short
# Beklenen: 123.45.67.89

dig www.destinyrisinghub.com +short
# Beklenen: destinyrisinghub.com
```

### 15.3 DNS Provider Önerileri

**Cloudflare (önerilen):**
- ✅ Ücretsiz DNS
- ✅ Otomatik SSL
- ✅ CDN (opsiyonel)
- ✅ DDoS protection
- ✅ Hızlı propagation

**Namecheap:**
- ✅ Ucuz domain
- ⚠️ DNS propagation yavaş olabilir

---

## 16. SSL

### 16.1 SSL Provider

**Caddy (otomatik):**
- ✅ Let's Encrypt (ücretsiz)
- ✅ Otomatik certificate issuance
- ✅ Otomatik renewal (30 gün önceden)
- ✅ Zero configuration

### 16.2 SSL Certificate

**Certificate type:**
- Domain: `destinyrisinghub.com`
- Wildcard: `*.destinyrisinghub.com` (opsiyonel)

**Issuance:**
- Caddy ilk启动'da otomatik certificate alır
- Let's Encrypt ACME challenge (HTTP-01 veya TLS-ALPN-01)

### 16.3 SSL Renewal

**Otomatik:**
- Caddy 30 gün önceden otomatik renewal yapar
- Manuel müdahale gerekmez

**Kontrol:**
```bash
echo | openssl s_client -connect destinyrisinghub.com:443 -servername destinyrisinghub.com 2>/dev/null | openssl x509 -noout -dates
```

---

## 17. Health Check

### 17.1 Application Health Check

**Endpoint:** `/api/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-08-09T12:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "application": "healthy"
  },
  "uptime": 3600
}
```

**HTTP status:**
- `200 OK` — healthy
- `503 Service Unavailable` — degraded

### 17.2 Docker Health Check

**docker-compose.prod.yml:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 40s
```

### 17.3 CI Health Check

**Deployment sonrası:**
```bash
for i in {1..10}; do
  if curl -f -s https://destinyrisinghub.com/api/health > /dev/null; then
    echo "✅ Health check passed"
    exit 0
  fi
  echo "Attempt $i/10 failed, retrying in 10s..."
  sleep 10
done

echo "❌ Health check failed"
exit 1
```

### 17.4 Monitoring Health Check

**Uptime monitoring (önerilen):**
- UptimeRobot (ücretsiz)
- Pingdom
- Datadog

**Alerting:**
- Email/Slack notification
- 5 dakika downtime → alert

---

## 18. Rollback Strategy

### 18.1 Rollback Senaryoları

**Senaryo 1: Health check başarısız**
- CI otomatik rollback yapar
- Önceki image tag'e geri döner

**Senaryo 2: Application crash**
- Docker otomatik restart (`restart: always`)
- 3 başarısız denemeden sonra container durur
- Manuel müdahale gerekli

**Senaryo 3: Database migration başarısız**
- docker-entrypoint.sh migration hatasını loglar
- Container başlamaz
- Manuel müdahale gerekli (migration düzelt veya rollback et)

### 18.2 Otomatik Rollback (CI)

**CI deploy-production job'da:**
```yaml
- name: Rollback on failure
  if: failure()
  run: |
    # Get previous image tag
    PREV_TAG=$(ssh user@vps "cd /app && docker compose images app | tail -1 | awk '{print \$4}'")
    
    # Rollback
    ssh user@vps "cd /app && echo IMAGE_TAG=$PREV_TAG > .env && docker compose pull && docker compose up -d"
```

### 18.3 Manuel Rollback

**VPS'te:**
```bash
cd /opt/destiny-rising-hub

# Önceki image tag'i bul
docker images ghcr.io/arvelos34/destiny-rising-hub

# .env'de IMAGE_TAG'i değiştir
echo "IMAGE_TAG=previous-commit-sha" > .env

# Rollback
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### 18.4 Database Rollback

**Migration rollback:**
```bash
# Prisma migration rollback (eğer support ediyorsa)
npx prisma migrate reset

# Veya Neon dashboard'dan point-in-time recovery
```

**Not:** Prisma migration rollback sınırlı. Neon PITR daha güvenli.

---

## 19. Backup/Recovery Strategy

### 19.1 PostgreSQL Backup (Neon)

**Otomatik:**
- ✅ 7 gün point-in-time recovery
- ✅ Dashboard'dan restore

**Manuel (opsiyonel):**
```bash
# VPS'te cron job
0 3 * * * pg_dump $DATABASE_URL | gzip > /backups/neon-$(date +\%Y\%m\%d).sql.gz
```

**Recovery:**
```bash
# Neon dashboard → Restore → Point-in-time
# Veya
psql $DATABASE_URL < backup.sql
```

### 19.2 Redis Backup (Upstash)

**Otomatik:**
- ✅ Persistence (AOF)
- ✅ Otomatik snapshot

**Manuel backup yok:**
- Upstash otomatik yönetir
- Manuel backup/restore desteklenmez

### 19.3 Media Assets Backup (S3/R2)

**Otomatik:**
- ✅ S3 versioning (opsiyonel)
- ✅ Cross-region replication (opsiyonel)

**Manuel (opsiyonel):**
```bash
# S3 → Local backup
aws s3 sync s3://destiny-assets /backups/s3-assets/
```

### 19.4 Disaster Recovery

**Senaryo: VPS çökerse**
1. Yeni VPS provision et
2. Docker + Docker Compose kur
3. Repository clone et
4. .env dosyasını geri yükle
5. `docker compose pull && docker compose up -d`
6. DNS'i yeni VPS IP'ye güncelle

**Senaryo: Neon çökerse**
1. Neon support ile iletişime geç
2. Point-in-time recovery yap
3. Veya backup'tan restore et

**Senaryo: Upstash çökerse**
1. Upstash support ile iletişime geç
2. Redis otomatik recovery yapar
3. Veri kaybı minimal (AOF persistence)

---

## 20. Security Considerations

### 20.1 Network Security

**VPS Firewall (UFW):**
```bash
# SSH
ufw allow 22/tcp

# HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp  # HTTP/3

# Enable
ufw enable
```

**Docker ports:**
- App: `127.0.0.1:3000` (sadece localhost — Caddy arkasında)
- Caddy: `0.0.0.0:80`, `0.0.0.0:443` (public)

### 20.2 SSH Security

**SSH key authentication:**
- ✅ ED25519 key (password authentication disabled)
- ✅ GitHub Actions deploy key (read-only)
- ✅ VPS access (restricted to deploy user)

**Fail2ban (önerilen):**
```bash
apt install fail2ban
systemctl enable fail2ban
```

### 20.3 Secrets Management

**GitHub Secrets:**
- ✅ Encrypted at rest
- ✅ Access control (repository admins only)
- ✅ Audit log

**VPS .env:**
- ✅ `chmod 600 .env` (sadece owner okuyabilir)
- ✅ `.gitignore`'a ekle (repository'ye commit etme)

### 20.4 Container Security

**Non-root user:**
- Dockerfile'da `USER nextjs:1001` (non-root)
- Container içinde root yetkisi yok

**Read-only filesystem (opsiyonel):**
```yaml
read_only: true
tmpfs:
  - /tmp
```

**Resource limits:**
```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '1.0'
```

### 20.5 Application Security

**Security headers:**
- ✅ HSTS (max-age=31536000)
- ✅ CSP (Content Security Policy)
- ✅ X-Frame-Options (DENY)
- ✅ X-Content-Type-Options (nosniff)
- ✅ Referrer-Policy (strict-origin-when-cross-origin)

**Authentication:**
- ✅ Better Auth (session_token cookie)
- ✅ httpOnly, secure, sameSite
- ✅ Rate limiting (Redis-backed)

**Database:**
- ✅ SSL/TLS connection (Neon)
- ✅ Connection pooling
- ✅ Parameterized queries (Prisma)

---

## 21. Implementation Order

### Phase 1: Infrastructure Setup (1-2 gün)

1. **VPS provision** (Hetzner, DigitalOcean, vb.)
   - Ubuntu 22.04 LTS
   - 2GB RAM, 1 CPU, 40GB SSD
   - SSH key setup

2. **Neon PostgreSQL**
   - Sign up
   - Create project
   - Get connection string
   - Test connection

3. **Upstash Redis**
   - Sign up
   - Create database
   - Get connection string
   - Test connection

4. **Domain + DNS**
   - Domain purchase (yoksa)
   - DNS records (A, CNAME)
   - Propagation bekle

### Phase 2: VPS Configuration (1 gün)

5. **VPS initial setup**
   ```bash
   apt update && apt upgrade
   apt install docker.io docker-compose-plugin ufw fail2ban
   systemctl enable docker
   ```

6. **Firewall setup**
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```

7. **Deploy user setup**
   ```bash
   useradd -m -s /bin/bash deploy
   usermod -aG docker deploy
   mkdir -p /opt/destiny-rising-hub
   chown deploy:deploy /opt/destiny-rising-hub
   ```

8. **SSH key setup**
   ```bash
   # VPS'te
   mkdir -p /home/deploy/.ssh
   echo "github-actions-public-key" >> /home/deploy/.ssh/authorized_keys
   chmod 600 /home/deploy/.ssh/authorized_keys
   ```

### Phase 3: Repository Preparation (1 gün)

9. **docker-compose.prod.yml güncelle**
   - postgres, redis, backup kaldır
   - app `build:` → `image:`
   - caddy service ekle
   - environment variables güncelle

10. **Caddyfile oluştur**
    - Reverse proxy configuration
    - Security headers
    - Logging

11. **CI/CD güncelle**
    - GHCR login ekle
    - Docker build + push
    - SSH deployment
    - Health check
    - Rollback on failure

12. **Commit + push**
    ```bash
    git add docker-compose.prod.yml Caddyfile .github/workflows/ci.yml
    git commit -m "feat: add production deployment configuration"
    git push origin feature/rc3-performance
    ```

### Phase 4: GitHub Secrets (30 dakika)

13. **GitHub Secrets ekle**
    - `VPS_HOST`
    - `VPS_USER`
    - `VPS_SSH_KEY`
    - `GHCR_PAT`
    - `DATABASE_URL`
    - `REDIS_URL`
    - `BETTER_AUTH_SECRET`
    - (Optional: SENTRY_DSN, SMTP_*, S3_*)

### Phase 5: First Deployment (1 gün)

14. **VPS'te initial setup**
    ```bash
    cd /opt/destiny-rising-hub
    git clone https://github.com/ArveLoS34/destiny-rising-hub.git .
    ```

15. **VPS .env oluştur**
    ```bash
    cat > .env << 'EOF'
    IMAGE_TAG=latest
    DATABASE_URL=...
    REDIS_URL=...
    BETTER_AUTH_SECRET=...
    # ... diğer variables
    EOF
    chmod 600 .env
    ```

16. **İlk deployment (manuel test)**
    ```bash
    docker compose -f docker-compose.prod.yml pull
    docker compose -f docker-compose.prod.yml up -d
    ```

17. **Health check**
    ```bash
    curl -f https://destinyrisinghub.com/api/health
    ```

18. **CI/CD test**
    - Push to main
    - GitHub Actions çalışsın
    - GHCR'a push etsin
    - VPS'e deploy etsin
    - Health check geçsin

### Phase 6: Post-Deployment (1 gün)

19. **Monitoring setup**
    - Sentry (error tracking)
    - Uptime monitoring (UptimeRobot)
    - Log aggregation (opsiyonel)

20. **Backup verification**
    - Neon backup kontrol
    - Upstash persistence kontrol
    - Recovery test (opsiyonel)

21. **Security audit**
    - SSL certificate kontrol
    - Firewall rules kontrol
    - SSH access kontrol
    - Secrets exposure kontrol

22. **Documentation**
    - Deployment guide
    - Runbook (incident response)
    - Disaster recovery plan

---

## 22. Validation Checklist

### Pre-Deployment

- [ ] VPS provision edildi
- [ ] Docker + Docker Compose kuruldu
- [ ] Firewall yapılandırıldı (22, 80, 443)
- [ ] SSH key setup yapıldı
- [ ] Neon PostgreSQL oluşturuldu
- [ ] Upstash Redis oluşturuldu
- [ ] Domain satın alındı
- [ ] DNS records eklendi (A, CNAME)
- [ ] DNS propagation tamamlandı

### Repository

- [ ] docker-compose.prod.yml güncellendi
- [ ] Caddyfile oluşturuldu
- [ ] CI/CD güncellendi (GHCR push, SSH deploy)
- [ ] Commit + push yapıldı
- [ ] GitHub Secrets eklendi
- [ ] Environment protection rules ayarlandı

### VPS

- [ ] Repository clone edildi
- [ ] .env dosyası oluşturuldu
- [ ] .env permissions (600)
- [ ] Docker image pull edildi
- [ ] Docker compose up yapıldı
- [ ] Health check geçti

### CI/CD

- [ ] GitHub Actions workflow çalıştı
- [ ] Docker image GHCR'a push edildi
- [ ] SSH deployment başarılı
- [ ] Health check başarılı
- [ ] Rollback test edildi (opsiyonel)

### Post-Deployment

- [ ] HTTPS çalışıyor
- [ ] SSL certificate geçerli
- [ ] Application erişilebilir
- [ ] Database bağlantısı başarılı
- [ ] Redis bağlantısı başarılı
- [ ] Authentication çalışıyor
- [ ] Health endpoint başarılı
- [ ] Monitoring kuruldu
- [ ] Backup strategy doğrulandı
- [ ] Security audit tamamlandı

---

## FINAL

```
DEPLOYMENT IMPLEMENTATION PLAN READY

Architecture: VPS + Managed Neon + Managed Upstash
Image Registry: GHCR (ghcr.io)
Image Tag: Immutable commit SHA
Reverse Proxy: Caddy (automatic SSL)
Deployment: SSH + docker compose pull + up
Rollback: Previous image tag
Backup: Neon PITR + Upstash persistence

CODE CHANGES REQUIRED: YES (minimal)
  - docker-compose.prod.yml: postgres/redis/backup kaldır, image: kullan
  - .github/workflows/ci.yml: GHCR push + SSH deploy ekle
  - Caddyfile: Yeni dosya oluştur

INFRASTRUCTURE REQUIRED:
  - VPS (Ubuntu 22.04, 2GB RAM, 1 CPU)
  - Neon PostgreSQL (serverless)
  - Upstash Redis (serverless)
  - Domain + DNS
  - GitHub Container Registry

SECRETS REQUIRED:
  - VPS_HOST, VPS_USER, VPS_SSH_KEY
  - GHCR_PAT
  - DATABASE_URL, REDIS_URL, BETTER_AUTH_SECRET
  - Optional: SENTRY_DSN, SMTP_*, S3_*

ESTIMATED TIME: 5-7 gün (infrastructure + setup + validation)
COST: ~$35-36/ay
```

---

**Onay sonrası implementasyona geçilebilir.**
