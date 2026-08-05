# RC-5: Queue Validation

## Objective

BullMQ job queue end-to-end çalışıyor mu? Job enqueue, processing, retry, ve dead letter queue
fonksiyonel mu?

## Environment

- **Queue:** BullMQ
- **Redis:** 7 Alpine (Docker)
- **Tarih:** [Doğrulama tarihi]

## Prerequisites

- ✅ RC-1 PASS (Redis servisi running)

## Commands

### 1. Queue Connectivity

```bash
# Redis bağlantısı
docker compose exec redis redis-cli ping

# Queue key'leri
docker compose exec redis redis-cli keys "bull:*"
```

### 2. Job Enqueue

```bash
# Test job ekle (API veya script ile)
# curl -X POST http://localhost:3000/api/queue/test

# Queue'da job var mı?
docker compose exec redis redis-cli keys "bull:character-import:*"
```

### 3. Job Processing

```bash
# Worker logları
docker compose logs --tail=20 worker

# Job tamamlandı mı?
docker compose exec redis redis-cli keys "bull:character-import:completed"
```

### 4. Retry Mechanism

```bash
# Başarısız job ekle (hata tetikleyecek data ile)
# Retry gerçekleşti mi?
docker compose exec redis redis-cli keys "bull:character-import:wait"

# Retry count
docker compose exec redis redis-cli hgetall "bull:character-import:{jobId}"
```

### 5. Dead Letter Queue

```bash
# Kalıcı başarısız job'lar
docker compose exec redis redis-cli keys "bull:character-import:failed"

# Failed job detayları
docker compose exec redis redis-cli lrange "bull:character-import:failed" 0 -1
```

### 6. Bull Board (Monitoring UI)

```bash
# Bull Board erişilebilir mi?
curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/admin/queue
```

## Expected Results

| Kontrol | Beklenen Sonuç |
|---------|----------------|
| Queue connectivity | Redis bull:* keys mevcut |
| Job enqueue | Job queue'da görünüyor |
| Job processing | Worker completes job |
| Job completion | Completed key'lerde |
| Retry (attempt 1 fail) | Otomatik retry |
| Retry (attempt 3 fail) | Dead letter queue |
| Bull Board UI | Dashboard erişilebilir |
| Concurrent jobs | Parallel processing |

## Actual Results

> **⏳ PENDING**

## Evidence

> **⏳ PENDING**

## Status

⏳ **PENDING**

---

### Checklist

- [ ] Redis queue bağlantısı
- [ ] Job enqueue başarılı
- [ ] Worker job alıyor
- [ ] Job processing tamamlanıyor
- [ ] Başarılı job → completed
- [ ] Başarısız job → retry (3 deneme)
- [ ] Kalıcı başarısız → dead letter queue
- [ ] Concurrent jobs çalışıyor
- [ ] Bull Board dashboard erişilebilir
- [ ] Queue monitoring testler PASS
