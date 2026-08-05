# ADR-008: OpenTelemetry Observability

## Durum
✅ Kabul Edildi (v1.0 öncesi son teknik hedef)

## Bağlam
Destiny Rising Hub'da health check, CI/CD, monitoring altyapısı var. Ancak modern SaaS'ta yeterli olan sadece "CPU %80" görmek değil — **distributed tracing** ile bir request'in tüm servislerdeki yolculuğunu takip edebilmek.

**Sorun Senaryosu:**
```
Kullanıcı "Publish" butonuna basıyor
  ↓
  5 saniye sonra sayfa yükleniyor
  ↓
  Nerede yavaşladı?
  → API? BullMQ? Redis? PostgreSQL? Search Index? AI? Notification?
  → Bunu görebilmek için distributed tracing gerekli.
```

## Karar
**OpenTelemetry** ile observability katmanı ekliyoruz.

### Mimari

```
┌─────────────────────────────────────────────────────────┐
│                    Application                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐ │
│  │  Next.js │  │  BullMQ │  │  Prisma │  │  Redis   │ │
│  │  (HTTP)  │  │ (Queue) │  │  (DB)   │  │ (Cache)  │ │
│  └────┬─────┘  └────┬────┘  └────┬────┘  └────┬─────┘ │
│       │              │             │             │       │
│       └──────────────┼─────────────┼─────────────┘       │
│                      │             │                     │
│               ┌──────┴──────┐     │                     │
│               │OpenTelemetry│◄────┘                     │
│               │  Collector  │                           │
│               └──────┬──────┘                           │
│                      │                                   │
└──────────────────────┼───────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
    ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
    │  Metrics  │ │ Logs  │ │  Traces   │
    │ (Prometheus│ │(Loki) │ │ (Jaeger)  │
    └─────┬─────┘ └───┬───┘ └─────┬─────┘
          │            │            │
          └────────────┼────────────┘
                       │
                ┌──────┴──────┐
                │   Grafana   │
                │ (Dashboard) │
                └─────────────┘
```

### Signal Tipleri

| Signal | Açıklama | Araç |
|--------|----------|------|
| **Traces** | Request yolculuğu (span tree) | Jaeger / Tempo |
| **Metrics** | Sayısal ölçümler (latency, error rate) | Prometheus |
| **Logs** | Structured log mesajları | Loki |

### Trace Örneği: Character Publish

```
[PUBLISH] POST /api/characters/nova/publish          2.3s
  ├── [AUTH] Verify session token                     5ms
  ├── [DB] Update character status → PUBLISHED        12ms
  ├── [QUEUE] Enqueue publish-job                      3ms
  │     └── [WORKER] Process publish-job              2.1s
  │           ├── [SEARCH] Update search index        450ms
  │           ├── [AI] Generate suggestions           1200ms
  │           ├── [IMAGE] Process thumbnails          300ms
  │           └── [NOTIFY] Send notifications         150ms
  └── [CACHE] Invalidate character cache              2ms
```

Bu trace ile tam olarak nerede yavaşladığı görülür: AI suggestion generation (1200ms).

### Implementasyon Planı

```typescript
// src/lib/observability.ts
import { trace, SpanStatusCode } from '@opentelemetry/api';

class ObservabilityService {
  // Span oluştur
  startSpan(name: string, attributes?: Record<string, any>) { ... }

  // Mevcut span'a event ekle
  addEvent(name: string, attributes?: Record<string, any>) { ... }

  // Hata kaydet
  recordError(error: Error) { ... }

  // Metric kaydet
  recordMetric(name: string, value: number) { ... }
}

// Kullanım
async function publishCharacter(id: string) {
  const span = observability.startSpan('character.publish', {
    'character.id': id,
    'character.slug': slug,
  });

  try {
    await updateStatus(id, 'PUBLISHED');
    await enqueuePublishJob(id);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    observability.recordError(error);
    span.setStatus({ code: SpanStatusCode.ERROR });
    throw error;
  } finally {
    span.end();
  }
}
```

### Docker Compose Entegrasyonu

```yaml
# docker-compose.yml'e eklenecek servisler:
otel-collector:
  image: otel/opentelemetry-collector:latest
  ports:
    - "4317:4317"  # gRPC
    - "4318:4318"  # HTTP

jaeger:
  image: jaegertracing/all-in-one:latest
  ports:
    - "16686:16686"  # Jaeger UI

prometheus:
  image: prom/prometheus:latest
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana:latest
  ports:
    - "3001:3000"  # Grafana UI
```

## Sonuçlar

### Olumlu
- ✅ Request bazında debugging: "Nerede yavaşladı?" sorusu saniyeler içinde cevaplanır
- ✅ Service dependency map: Hangi servis hangisine bağımlı otomatik görünür
- ✅ Performance bottleneck detection: AI mı, DB mi, Queue mu yavaş?
- ✅ Error correlation: Bir hata tüm trace'de görülür
- ✅ Capacity planning: Hangi endpoint ne kadar kaynak kullanıyor?

### Olumsuz
- ⚠️ Overhead: %2-5 performans etkisi (kabul edilebilir)
- ⚠️ Storage: Trace data çok yer kaplayabilir → sampling gerekli
- ⚠️ Complexity: 3 yeni servis (Collector + Jaeger + Grafana)
- ⚠️ Learning curve: Ekip OpenTelemetry concept'lerini öğrenmeli

### Risk Yönetimi
- Sampling: %10 trace kaydedilir (production), %100 (development)
- Retention: 7 gün trace, 30 gün metrics
- Resource limits: Jaeger 256MB, Prometheus 512MB, Grafana 128MB

## Alternatifler Değerlendirilen

| Araç | Artı | Eksi | Karar |
|------|------|------|-------|
| **OpenTelemetry** | Vendor-agnostic, standard, geniş ekosistem | Öğrenme eğrisi | ✅ Seçildi |
| Datadog | Managed, kolay | Vendor lock-in, pahalı | ❌ Reddedildi |
| New Relic | Full-stack | Vendor lock-in | ❌ Reddedildi |
| Custom logging | Tam kontrol | Scale edilmez, correlation yok | ❌ Reddedildi |

## Zero Manual Operation Vizyonu

OpenTelemetry, **Zero Manual Operation** hedefinin temel taşıdır:

```
Yeni oyun patch'i geldi
  ↓
CMS → Patch data girişi
  ↓
Review → Admin onayı
  ↓
Release → Queue tetiklenir
  ↓
Queue → Import, validation, transform
  ↓
Publish → Search index, AI refresh, notification
  ↓
Notify → Kullanıcılara bildirim
  ↓
Monitor → Grafana dashboard'da her şey yeşil ✅
  ↓
✅ Kimse SSH, terminal, SQL kullanmadı.
```

Bu gerçekleştiğinde platform **operasyonel olarak olgunlaşmış** demektir.
