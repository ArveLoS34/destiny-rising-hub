# RC-1: Infrastructure Validation

## Objective

Docker Compose ile tam geliştirme/production ortamı tek komutla ayağa kalkıyor mu?
Tüm servisler (PostgreSQL, Redis, MinIO, Mailpit, Application) healthy durumda mı?

## Environment

- **OS:** [Doldurulacak — doğrulama yapılan işletim sistemi]
- **Docker:** [Versiyon]
- **Docker Compose:** [Versiyon]
- **RAM:** [Sistem RAM]
- **CPU:** [Çekirdek sayısı]
- **Tarih:** [Doğrulama tarihi]

## Commands

Aşağıdaki komutlar sırayla çalıştırılır:

### 1. Ortam Hazırlığı

```bash
# Environment dosyasını kopyala
cp .env.docker .env

# Tüm servisleri başlat
docker compose up -d
```

### 2. Servis Durumu

```bash
# Tüm servislerin durumunu kontrol et
docker compose ps

# Her servisin health check'ini ayrı ayrı kontrol et
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"
```

### 3. PostgreSQL Bağlantısı

```bash
# PostgreSQL'e bağlan
docker compose exec postgres pg_isready -U destiny_user

# Veritabanı listesini kontrol et
docker compose exec postgres psql -U destiny_user -d destiny_rising_hub -c "\dt"
```

### 4. Redis Bağlantısı

```bash
# Redis ping
docker compose exec redis redis-cli ping

# Redis info
docker compose exec redis redis-cli info server | head -20
```

### 5. MinIO Erişimi

```bash
# MinIO health check
curl -sf http://localhost:9000/minio/health/live

# MinIO Console erişimi
curl -sf -o /dev/null -w "%{http_code}" http://localhost:9001
```

### 6. Mailpit Erişimi

```bash
# Mailpit UI
curl -sf -o /dev/null -w "%{http_code}" http://localhost:8025

# SMTP port
docker compose exec mailpit netstat -tlnp | grep 1025 || echo "Port 1025 listening"
```

### 7. Application

```bash
# Application health check
curl -sf http://localhost:3000/api/health | jq .

# Application ana sayfa
curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000
```

### 8. Application Logları

```bash
# Son 50 satır log
docker compose logs --tail=50 app
```

### 9. Network

```bash
# Docker network bilgisi
docker compose config --services

# Port mapping
docker compose port app 3000
```

## Expected Results

| Kontrol | Beklenen Sonuç |
|---------|----------------|
| `docker compose ps` | 5 servis: all Up (healthy) |
| PostgreSQL `pg_isready` | `accepting connections` |
| Redis `ping` | `PONG` |
| MinIO health | HTTP 200 |
| Mailpit UI | HTTP 200 |
| App `/api/health` | `{"status": "healthy"}` |
| App ana sayfa | HTTP 200 |

## Actual Results

> **⏳ PENDING — Doğrulama bekleniyor**
>
> Bu bölüm, gerçek doğrulama yapıldığında komut çıktılarının kaydedileceği alandır.
>
> Örnek format:
> ```
> $ docker compose ps
> NAME                IMAGE               STATUS              PORTS
> destiny-postgres    postgres:16-alpine  Up 2 minutes (healthy)   0.0.0.0:5432->5432/tcp
> destiny-redis       redis:7-alpine      Up 2 minutes (healthy)   0.0.0.0:6379->6379/tcp
> destiny-minio       minio/minio:latest  Up 2 minutes (healthy)   0.0.0.0:9000-9001->9000-9001/tcp
> destiny-mailpit     axllent/mailpit     Up 2 minutes             0.0.0.0:1025->1025/tcp, 0.0.0.0:8025->8025/tcp
> destiny-app         destiny-app         Up 1 minute              0.0.0.0:3000->3000/tcp
> ```

## Evidence

> **⏳ PENDING**
>
> - [ ] docker compose ps çıktısı
> - [ ] pg_isready çıktısı
> - [ ] redis-cli ping çıktısı
> - [ ] curl health check çıktısı
> - [ ] Application logları (ilk 50 satır)
> - [ ] Port mapping doğrulaması

## Performance Notes

| Metrik | Hedef | Gerçek |
|--------|-------|--------|
| docker compose up süresi | < 60s | — |
| PostgreSQL startup | < 10s | — |
| Redis startup | < 5s | — |
| Application startup | < 30s | — |
| Toplam RAM kullanımı | < 2GB | — |

## Status

⏳ **PENDING** — Doğrulama yapılmadı

---

### Checklist

- [ ] `cp .env.docker .env` başarılı
- [ ] `docker compose up -d` → 5 servis Up
- [ ] PostgreSQL accepting connections
- [ ] Redis PONG
- [ ] MinIO health 200
- [ ] Mailpit UI accessible
- [ ] Application /api/health → healthy
- [ ] Application ana sayfa → 200
- [ ] Loglar temiz (fatal error yok)
- [ ] `docker compose down` → temiz shutdown
- [ ] `docker compose up -d` → tekrar başarılı (persistence)
