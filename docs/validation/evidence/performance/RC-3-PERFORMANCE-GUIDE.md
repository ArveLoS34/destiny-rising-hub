# RC-3 Performans Testi Çalıştırma Kılavuzu

## Sorun

Önceki testlerde rate limiter, gerçek uygulama performansını ölçmemizi engelliyordu:
- 11,817 istekten 1,817'i rate limit tarafından engellendi (%15.4)
- NODE_ENV="test" container'a geçmiyordu
- Rate limit 10,000 olarak ayarlanmıştı ama yine de yetmiyordu

## Çözüm

Performance mode eklendi. Bu modda:
- ✅ Rate limiting tamamen devre dışı bırakılır
- ✅ Gerçek uygulama performansı ölçülür
- ✅ Rate limiter'ın etkisi sıfırlanır

---

## Yeni Environment Variable'lar

### PERFORMANCE_MODE
```bash
PERFORMANCE_MODE=true
```
- Rate limiting'i tamamen devre dışı bırakır
- Performance testleri için kullanılır
- Production'da KULLANMAYIN!

### RATE_LIMIT_ENABLED
```bash
RATE_LIMIT_ENABLED=false
```
- Rate limiting'i açık/kapalı yapar
- `false` olarak ayarlanırsa rate limiting devre dışı kalır
- Default: `true`

---

## Test Çalıştırma Adımları

### Adım 1: Son Değişiklikleri Çekin

```bash
git fetch origin
git checkout feature/rc3-performance
git pull origin feature/rc3-performance
```

### Adım 2: Docker'ı Performance Mode'da Başlatın

**PowerShell (Windows):**
```powershell
# Docker'ı durdurun
docker compose down

# Performance mode'u aktif edin
$env:PERFORMANCE_MODE="true"
$env:RATE_LIMIT_ENABLED="false"
$env:NODE_ENV="test"

# Docker'ı yeniden başlatın
docker compose up -d --build

# 2-3 dakika bekleyin
Start-Sleep -Seconds 180
```

**Linux/Mac:**
```bash
docker compose down

PERFORMANCE_MODE=true \
RATE_LIMIT_ENABLED=false \
NODE_ENV=test \
docker compose up -d --build

sleep 180
```

### Adım 3: Performance Mode'un Aktif Olduğunu Doğrulayın

```bash
curl http://localhost:3000/api/debug/performance
```

**Beklenen yanıt:**
```json
{
  "success": true,
  "data": {
    "application": {
      "nodeEnv": "test",
      "performanceMode": true,
      "rateLimitEnabled": false,
      ...
    }
  }
}
```

**Kontrol edilecekler:**
- ✅ `nodeEnv: "test"` olmalı
- ✅ `performanceMode: true` olmalı
- ✅ `rateLimitEnabled: false` olmalı

### Adım 4: Diagnostic Stress Testini Çalıştırın

```powershell
.\tests\performance\run-stress-diagnostic.ps1
```

### Adım 5: Sonuçları Analiz Edin

**stress-diagnostic-report.json** dosyasını kontrol edin:

```json
{
  "initial": {
    "data": {
      "application": {
        "nodeEnv": "test",
        "performanceMode": true,
        "rateLimitEnabled": false
      },
      "rateLimit": {
        "totalBlocked": 0,
        "totalKeys": 0
      }
    }
  },
  "final": {
    "data": {
      "application": {
        "nodeEnv": "test",
        "performanceMode": true,
        "rateLimitEnabled": false
      },
      "rateLimit": {
        "totalBlocked": 0,  ← Rate limit devre dışı olduğu için 0 olmalı
        "totalKeys": 0
      }
    }
  }
}
```

---

## Beklenen Sonuçlar

### Rate Limiting Devre Dışı
- ✅ `totalBlocked: 0` olmalı
- ✅ Hiçbir 429 yanıtı olmamalı
- ✅ Tüm istekler 200 OK dönmeli

### Gerçek Performans
- ✅ Latency: 5-50ms (p95)
- ✅ Error rate: %0-1
- ✅ Throughput: Yüksek

### Veritabanı
- ✅ `connected: true` olmalı
- ✅ Query süreleri: 0.5-3ms

---

## Sorun Giderme

### Sorun 1: Performance Mode Aktif Değil

**Belirti:** `performanceMode: false` görünüyor

**Çözüm:**
```powershell
# PowerShell'de environment variable'ı kontrol edin
$env:PERFORMANCE_MODE

# Eğer boşsa veya yanlışsa yeniden ayarlayın
$env:PERFORMANCE_MODE="true"

# Docker'ı yeniden başlatın
docker compose down
docker compose up -d --build
```

### Sorun 2: Rate Limit Hâlâ Aktif

**Belirti:** `rateLimitEnabled: true` görünüyor

**Çözüm:**
```powershell
# Her iki variable'ı da ayarlayın
$env:RATE_LIMIT_ENABLED="false"
$env:PERFORMANCE_MODE="true"

# Docker'ı yeniden başlatın
docker compose down
docker compose up -d --build
```

### Sorun 3: NODE_ENV Hâlâ "development"

**Belirti:** `nodeEnv: "development"` görünüyor

**Çözüm:**
```powershell
# NODE_ENV'i ayarlayın
$env:NODE_ENV="test"

# Docker'ı yeniden başlatın
docker compose down
docker compose up -d --build
```

---

## Test Senaryoları

### Senaryo 1: Baseline Test

```bash
k6 run tests/performance/scripts/baseline.js
```

**Beklenen:**
- Duration: 30s
- VUs: 1
- Error rate: %0
- p95 latency: <10ms

### Senaryo 2: Moderate Load

```bash
k6 run tests/performance/scripts/moderate-load.js
```

**Beklenen:**
- Duration: 2m
- VUs: 10
- Error rate: %0-1
- p95 latency: <50ms

### Senaryo 3: Peak Load

```bash
k6 run tests/performance/scripts/peak-load.js
```

**Beklenen:**
- Duration: 3m
- VUs: 50
- Error rate: %0-5
- p95 latency: <200ms

### Senaryo 4: Stress Test

```bash
k6 run tests/performance/scripts/stress-test.js
```

**Beklenen:**
- Duration: 4.5m
- VUs: 100
- Error rate: %0-10
- p95 latency: <500ms

---

## RC-3 Başarı Kriterleri

RC-3'ün PASS sayılması için:

### 1. Rate Limiting Devre Dışı
- [ ] `rateLimitEnabled: false`
- [ ] `totalBlocked: 0`
- [ ] Hiç 429 yanıtı yok

### 2. Uygulama Performansı
- [ ] Baseline: p95 <10ms, error %0
- [ ] Moderate: p95 <50ms, error <%1
- [ ] Peak: p95 <200ms, error <%5
- [ ] Stress: p95 <500ms, error <%10

### 3. Veritabanı
- [ ] `connected: true`
- [ ] Query süreleri <5ms

### 4. Genel
- [ ] `performanceMode: true`
- [ ] `nodeEnv: "test"`
- [ ] Tüm diagnostic dosyaları oluşturuldu

---

## Önemli Notlar

⚠️ **PERFORMANCE_MODE PRODUCTION'DA KULLANILMAMALI!**

Bu mod:
- Rate limiting'i devre dışı bırakır
- Güvenlik önlemlerini kaldırır
- Sadece test ortamında kullanılmalıdır

Production'da her zaman:
```bash
PERFORMANCE_MODE=false
RATE_LIMIT_ENABLED=true
NODE_ENV=production
```

---

## Özet

**Önceki durum:**
- ❌ Rate limiter testleri engelliyordu
- ❌ %15.4 istek engelleniyordu
- ❌ Gerçek performans ölçülemiyordu

**Şimdiki durum:**
- ✅ Performance mode eklendi
- ✅ Rate limiting devre dışı bırakılabilir
- ✅ Gerçek uygulama performansı ölçülebilir
- ✅ RC-3 geçerli sonuçlar verecek

**Sonraki adım:**
Performance mode'da testleri çalıştırın ve sonuçları paylaşın.
