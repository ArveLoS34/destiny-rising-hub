# ADR-006: Docker Compose Geliştirme Ortamı

## Durum
✅ Kabul Edildi

## Bağlam
Destiny Rising Hub birden fazla servis kullanıyor: PostgreSQL, Redis, MinIO, Mailpit. Her geliştiricinin bu servisleri lokal makinesinde kurması zor ve tutarsız sonuçlar üretiyor.

**Sorunlar:**
- "Benim makinemde çalışıyor" problemi
- Yeni geliştirici setup süresi > 1 saat
- Servis versiyonları geliştiriciden geliştiriciye farklı
- CI/CD ile local ortam tutarsızlığı

## Karar
**Docker Compose** ile tek komutla tam geliştirme ortamı sağlıyoruz.

### Servis Topolojisi

```
┌──────────────────────────────────────────────────────┐
│                    Docker Network                     │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐ │
│  │PostgreSQL│  │  Redis  │  │  MinIO  │  │Mailpit │ │
│  │   5432  │  │   6379  │  │9000/9001│  │1025/8025│ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └───┬────┘ │
│       │             │             │            │      │
│       └─────────────┼─────────────┼────────────┘      │
│                     │             │                    │
│              ┌──────┴──────┐     │                    │
│              │ Application │◄────┘                    │
│              │    3000     │                          │
│              └─────────────┘                          │
│                                                      │
│  ┌─────────────┐  (opsiyonel — tools profile)        │
│  │Redis Commander│                                    │
│  │    8081      │                                    │
│  └─────────────┘                                     │
└──────────────────────────────────────────────────────┘
```

### Kurulum Akışı

```bash
# 1. Klonla
git clone https://github.com/ArveLoS34/destiny-rising-hub.git

# 2. Environment hazırla
cp .env.docker .env

# 3. Başlat (tek komut)
docker compose up -d

# 4. 10 dakika sonra her şey hazır:
# ✅ PostgreSQL: Migration applied, seed data loaded
# ✅ Redis: Running
# ✅ MinIO: Running (S3-compatible)
# ✅ Mailpit: Running (email testing)
# ✅ Application: http://localhost:3000
```

### Makefile ile Kolay Kullanım

```bash
make setup     # İlk kurulum
make dev       # Tüm servisleri başlat
make dev-tools # Redis GUI ile başlat
make test      # Integration testleri
make db-studio # Prisma Studio aç
make db-reset  # DB sıfırla + re-seed
make logs      # App loglarını takip et
make stop      # Tüm servisleri durdur
make clean     # Container + volume temizle
```

### Dev vs Prod Ayrımı

| Özellik | Dev (docker-compose.yml) | Prod (docker-compose.prod.yml) |
|---------|--------------------------|-------------------------------|
| Hot reload | ✅ Volume mount | ❌ Built image |
| Seed data | ✅ Otomatik | ❌ Manuel kontrol |
| Mailpit | ✅ Email capture | ❌ Gerçek SMTP |
| Backup | ❌ Yok | ✅ Günlük otomatik |
| Resource limits | ❌ Yok | ✅ Memory/CPU limits |
| Health checks | Temel | ✅ Detaylı + start_period |
| MinIO | ✅ Local S3 | ❌ Gerçek S3/R2 |

## Sonuçlar

### Olumlu
- ✅ Setup süresi: 10 dakika (önceden 1+ saat)
- ✅ Tutarlılık: Her geliştiricide aynı versiyonlar
- ✅ CI/CD uyumu: Aynı compose dosyası test ortamında kullanılabilir
- ✅ Service isolation: Network seviyesinde ayrım
- ✅ Volume persistence: `docker compose down` → data korunur

### Olumsuz
- ⚠️ Docker gereksinimi: Docker Desktop kurulu olmalı
- ⚠️ Resource kullanımı: 4+ servis → ~2GB RAM
- ⚠️ Debugging: Container içinde debug zor (VS Code Remote Containers çözüm)
- ⚠️ MacOS/Windows: Docker Desktop performans overhead'i

### Platform Notları
- **Linux:** Native Docker, en iyi performans
- **macOS:** Docker Desktop / OrbStack, ~10% overhead
- **Windows:** Docker Desktop (WSL2 backend), iyi performans

## Alternatifler Değerlendirilen

| Yaklaşım | Artı | Eksi | Karar |
|----------|------|------|-------|
| **Docker Compose** | Tek komut, tutarlı, portable | Docker gereksinimi | ✅ Seçildi |
| Lokal kurulum | Docker yok, en hızlı | "Bende çalışıyor" problemi | ❌ Reddedildi |
| Vagrant/VirtualBox | Tam izolasyon | Ağır, yavaş, eski teknoloji | ❌ Reddedildi |
| Nix/Direnv | Reproducible | Steep learning curve, topluluk küçük | ❌ Reddedildi |
| Gitpod/Codespaces | Zero setup | Maliyet, vendor bağımlılığı | ❌ Reddedildi |
