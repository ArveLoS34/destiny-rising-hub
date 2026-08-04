# ADR-003: BullMQ Job Queue

## Durum
✅ Kabul Edildi (Planlama aşamasında — M3 milestone)

## Bağlam
Destiny Rising Hub'da asenkron işlemler gerekiyor:

- Karakter import işlemi (CSV/JSON → DB)
- Image upload & processing (resize, WebP/AVIF convert)
- AI content refresh (periyodik veri güncelleme)
- Notification gönderimi (batch email, push)
- Search index güncelleme

Bu işlemler HTTP request-response döngüsünde yapılamaz — kullanıcı bekleyemez.

## Karar
**BullMQ** (Redis-based job queue) kullanıyoruz.

### Neden BullMQ?

1. **Redis Altyapısı:** Zaten Redis cache için kullanılacak — ekstra servis yok
2. **Dahili Özellikler:** Retry, delay, priority, repeat, rate limiting built-in
3. **Dashboard:** Bull Board ile job monitoring UI
4. **TypeScript:** Native TypeScript desteği
5. **Atomic Jobs:** Transactional job processing

### Queue Yapısı

```typescript
// src/queues/import-queue.ts
const importQueue = new Queue('character-import', { connection: redis });

// Worker
const importWorker = new Worker('character-import', async (job) => {
  const { fileUrl, userId } = job.data;
  
  // 1. Download file
  // 2. Validate schema
  // 3. Transform data
  // 4. Insert to database
  // 5. Update search index
  
  return { imported: count, errors: errorCount };
}, { connection: redis });

// Retry strategy
{
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 }
}
```

### Job Tipleri

| Queue | Purpose | Retry | Priority |
|-------|---------|-------|----------|
| `character-import` | Karakter data import | 3x | High |
| `image-process` | Resize, WebP/AVIF | 2x | Medium |
| `notification` | Email/push gönderimi | 5x | Low |
| `ai-refresh` | AI content update | 1x | Low |
| `search-index` | Search index güncelleme | 2x | Medium |

## Sonuçlar

### Olumlu
- ✅ Asenkron processing: HTTP response time etkilenmez
- ✅ Retry mekanizması: Geçici hatalarda otomatik tekrar
- ✅ Rate limiting: External API'leri overload etmez
- ✅ Monitoring: Bull Board ile job durumu görülebilir
- ✅ Redis reuse: Cache için kurulan Redis üzerinde çalışır

### Olumsuz
- ⚠️ Redis bağımlılığı: Redis down → queue down
- ⚠️ Debugging zorluğu: Asenkron hata takibi log/monitoring gerektirir
- ⚠️ Memory kullanımı: Büyük payload'lar Redis memory'yi tüketir

### Risk Yönetimi
- Job payload'ları minimal tutulur (ID + reference, data değil)
- Dead letter queue: Başarısız job'lar ayrı queue'ya taşınır
- Health check: Worker liveness monitoring
- Alerting: Job failure rate > threshold → notification

## Alternatifler Değerlendirilen

| Queue | Artı | Eksi | Karar |
|-------|------|------|-------|
| **BullMQ** | Redis-based, retry, dashboard | Redis bağımlılığı | ✅ Seçildi |
| RabbitMQ | Robust, protocol-based | Extra servis, operational overhead | ❌ Reddedildi |
| AWS SQS | Managed, scalable | Vendor lock-in, local dev zor | ❌ Reddedildi |
| Cron + DB polling | Basit | Scalable değil, latency yüksek | ❌ Reddedildi |
