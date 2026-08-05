# RC-5: Production Rehearsal

## Objective

Gerçek production ortamının tam provası yapılabiliyor mu?
Sıfırdan production stack ayağa kaldırılıp, backup/restore/rollback/deploy senaryoları
başarıyla tamamlanabiliyor mu?

## Prerequisites

- ✅ RC-1 PASS
- ✅ RC-2 PASS
- ✅ RC-3 PASS (hedeflenen)
- ✅ RC-4 PASS (hedeflenen)

## Prova Senaryoları

### Scenario 1: Cold Start — Sıfırdan Production

```bash
# Temiz makine
ssh production-server

# Clone
git clone https://github.com/ArveLoS34/destiny-rising-hub.git
cd destiny-rising-hub

# Production environment
cp .env.production.template .env
# Edit .env with production secrets

# Start production stack
docker compose -f docker-compose.prod.yml up -d

# Wait for all services
# Expected: ~5-10 minutes
```

| Adım | Beklenen | Süre | Durum |
|------|----------|------|-------|
| PostgreSQL start + healthy | accepting connections | <30sn | ⬜ |
| Redis start + healthy | PONG | <10sn | ⬜ |
| Application start + healthy | /api/health → healthy | <60sn | ⬜ |
| Migration applied | All migrations applied | <30sn | ⬜ |
| Seed data loaded | 20 characters | <30sn | ⬜ |
| Backup service running | Cron scheduled | <10sn | ⬜ |

### Scenario 2: Backup & Restore

```bash
# Backup
docker compose exec postgres pg_dump -U destiny_user destiny_rising_hub > backup.sql

# Simulate data loss
docker compose exec postgres psql -U destiny_user -c "DROP TABLE \"Character\";"

# Restore
cat backup.sql | docker compose exec -T postgres psql -U destiny_user destiny_rising_hub

# Verify
docker compose exec postgres psql -U destiny_user -c "SELECT COUNT(*) FROM \"Character\";"
# Expected: 20
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Backup oluşturuldu | backup.sql > 0 bytes | ⬜ |
| Data loss simülasyonu | Table dropped | ⬜ |
| Restore başarılı | 20 characters geri geldi | ⬜ |
| Veri bütünlüğü | Tüm ilişkiler doğru | ⬜ |
| Restore süresi | < 2 dakika | ⬜ |

### Scenario 3: Rollback

```bash
# Current version
git rev-parse HEAD  # abc123

# Deploy new version
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

#发现问题 → rollback
git checkout abc123
docker compose -f docker-compose.prod.yml up -d --build

# Verify
curl -s http://localhost:3000/api/health | jq .status
# Expected: "healthy"
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Deploy başarılı | Yeni version running | ⬜ |
| Rollback tetiklendi | Eski version'a dönüldü | ⬜ |
| Rollback başarılı | Health check PASS | ⬜ |
| Data integrity | Veri kaybı yok | ⬜ |
| Rollback süresi | < 5 dakika | ⬜ |

### Scenario 4: Scaling

```bash
# Scale application
docker compose -f docker-compose.prod.yml up -d --scale app=3

# Verify load distribution
for i in {1..10}; do curl -s http://localhost:3000/api/health; done

# Scale down
docker compose -f docker-compose.prod.yml up -d --scale app=1
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Scale up | 3 instance running | ⬜ |
| Load distribution | Requests dağıtılıyor | ⬜ |
| Scale down | 1 instance kaldı | ⬜ |
| No data loss | Session/data korundu | ⬜ |

### Scenario 5: Disaster Recovery

```bash
# Simulate complete failure
docker compose -f docker-compose.prod.yml down -v

# Restore from backup
docker compose -f docker-compose.prod.yml up -d
# Wait for services
# Apply backup
cat latest-backup.sql | docker compose exec -T postgres psql -U destiny_user destiny_rising_hub

# Verify full recovery
curl -s http://localhost:3000/api/characters | jq length
# Expected: 20
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Complete failure | Tüm servisler durdu | ⬜ |
| Recovery başlatıldı | Servisler yeniden oluşturuldu | ⬜ |
| Backup restore | Veriler geri yüklendi | ⬜ |
| Full recovery | Tüm data + servisler çalışıyor | ⬜ |
| Recovery süresi | < 15 dakika | ⬜ |

### Scenario 6: Monitoring & Alerting

```bash
# Trigger alert condition
# (e.g., high CPU, high error rate)

# Verify alert fired
# Check monitoring dashboard
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Metrics collection | Prometheus scraping | ⬜ |
| Dashboard accessible | Grafana running | ⬜ |
| Alert rules | Kurallar tanımlı | ⬜ |
| Alert firing | Test alert tetiklendi | ⬜ |
| Alert notification | Email/Slack bildirimi | ⬜ |

### Scenario 7: Zero-Downtime Deploy

```bash
# Rolling update
docker compose -f docker-compose.prod.yml up -d --no-deps --build app

# Verify during deploy
while true; do
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
  echo "$(date): $STATUS"
  sleep 2
done
# Expected: All 200, no 502/503
```

| Adım | Beklenen | Durum |
|------|----------|-------|
| Rolling update başladı | Eski instance çalışıyor | ⬜ |
| Yeni instance hazır | Health check PASS | ⬜ |
| Traffic switch | Zero downtime | ⬜ |
| Eski instance kapandı | Clean shutdown | ⬜ |
| No failed requests | 0 error during deploy | ⬜ |

## Production Checklist

- [ ] Production secrets yönetimi (env vars / secrets manager)
- [ ] HTTPS certificate (Let's Encrypt / managed)
- [ ] Domain DNS configured
- [ ] Firewall rules (only 80, 443 open)
- [ ] Backup cron active
- [ ] Log rotation configured
- [ ] Monitoring active
- [ ] Alerting configured
- [ ] Runbook documented

## Evidence

> **⏳ PENDING**
>
> - [ ] Cold start timing
> - [ ] Backup/restore logs
> - [ ] Rollback logs
> - [ ] Scaling test results
> - [ ] Disaster recovery timing
> - [ ] Monitoring screenshots
> - [ ] Zero-downtime deploy logs

## Duration

> **⏳ PENDING**

## Issues Found

> **⏳ PENDING**

## Status

⏳ **PENDING** — RC-3 ve RC-4 sonrası başlatılacak

---

### PASS Criteria

| Kontrol | Beklenen | Durum |
|---------|----------|-------|
| Cold start | < 10 dakika | ⬜ |
| Backup & restore | Veri kaybı yok | ⬜ |
| Rollback | < 5 dakika | ⬜ |
| Scaling | Lineer performans | ⬜ |
| Disaster recovery | < 15 dakika | ⬜ |
| Monitoring | Tüm metrikler görünür | ⬜ |
| Zero-downtime deploy | 0 failed request | ⬜ |
| **Genel** | **7/7 senaryo PASS** | ⬜ |
