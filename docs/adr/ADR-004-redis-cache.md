# ADR-004: Redis Cache Strategy

## Durum
✅ Kabul Edildi (Implementasyon M3 milestone'da)

## Bağlam
Destiny Rising Hub'da veritabanı sorgularını hızlandırmak ve external API çağrılarını azaltmak için cache gerekiyor.

**Karakteristikler:**
- Karakter listesi: Her sayfa yüklemesinde DB'ye sorgu → cache
- Karakter detay: Nispeten statik veri → uzun TTL
- AI önerileri: External API çağrısı → orta TTL
- Session data: Auth için hızlı erişim → kısa TTL

## Karar
**Redis** (v7 Alpine) kullanıyoruz.

### Cache Katmanları

```
┌─────────────────────────────────────────┐
│              Client (Browser)           │
├─────────────────────────────────────────┤
│         CDN / Edge Cache (opsiyonel)    │  TCD: 5dk
├─────────────────────────────────────────┤
│         Redis Cache Layer               │  TTL: varies
├─────────────────────────────────────────┤
│         PostgreSQL Database             │  Source of truth
└─────────────────────────────────────────┘
```

### Cache Stratejisi

| Veri Tipi | TTL | Invalidation | Key Pattern |
|-----------|-----|--------------|-------------|
| Karakter listesi | 5 dakika | Write-through | `char:list:{filters_hash}` |
| Karakter detay | 15 dakika | On-update | `char:detail:{slug}` |
| Search sonuçları | 2 dakika | On-write | `search:{query_hash}` |
| AI önerileri | 1 saat | TTL expiry | `ai:suggestions:{charId}` |
| Session data | 7 gün | On-logout | `session:{token}` |
| Rate limiting | 1 dakika | Sliding window | `rate:{userId}:{endpoint}` |

### Implementasyon Pattern

```typescript
// src/lib/cache.ts
class CacheService {
  async get<T>(key: string): Promise<T | null>
  async set<T>(key: string, value: T, ttl: number): Promise<void>
  async invalidate(pattern: string): Promise<void>
}

// Repository'de cache usage
class CharacterRepository {
  async findAll(): Promise<Character[]> {
    const cacheKey = 'char:list:all';
    const cached = await cache.get<Character[]>(cacheKey);
    if (cached) return cached;
    
    const characters = await this.prisma.character.findMany(...);
    await cache.set(cacheKey, characters, 300); // 5 dakika
    return characters;
  }
}
```

### Invalidation Stratejisi

- **Write-through:** Create/Update/Delete → ilgili cache key silinir
- **TTL expiry:** Tüm key'lerin TTL'i var, stale data maximum TTL kadar yaşayabilir
- **Manual invalidate:** Admin panel'den cache temizleme butonu

## Sonuçlar

### Olumlu
- ✅ Response time: Cache hit → <10ms (DB sorgusu ~50-200ms)
- ✅ DB load: Tekrarlayan sorgular DB'ye ulaşmaz
- ✅ Session management: Auth token doğrulama hızlı
- ✅ Rate limiting: Redis INCR atomik operasyon

### Olumsuz
- ⚠️ Consistency: Cache + DB arasında kısa süreli tutarsızlık olabilir
- ⚠️ Memory: Redis memory limits → eviction policy gerekli
- ⚠️ Complexity: Cache invalidation notoriously difficult

### Risk Yönetimi
- Eviction policy: `allkeys-lru` (least recently used)
- Max memory: 256MB (Docker compose)
- Cache miss monitoring: Hit rate < 80% → alert
- Fallback: Cache down → doğrudan DB (graceful degradation)

## Alternatifler Değerlendirilen

| Cache | Artı | Eksi | Karar |
|-------|------|------|-------|
| **Redis** | In-memory, versatile, pub/sub | Single node (sentinel needed for HA) | ✅ Seçildi |
| Memcached | Simple, fast | No data structures, no persistence | ❌ Reddedildi |
| Node-cache (in-process) | Zero dependency, fast | No sharing between processes | ❌ Reddedildi |
| PostgreSQL materialized views | No extra service | Refresh latency, storage | ❌ Reddedildi |
