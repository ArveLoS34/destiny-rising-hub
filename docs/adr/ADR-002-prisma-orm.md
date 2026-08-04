# ADR-002: Prisma ORM Seçimi

## Durum
✅ Kabul Edildi

## Bağlam
Destiny Rising Hub PostgreSQL veritabanı ile çalışıyor. ORM seçimi yapmamız gerekiyordu.

**Gereksinimler:**
- TypeScript-first (tip güvenliği)
- Migration yönetimi
- JSON alan desteği (karakter stats, skills, builds)
- Transaction desteği
- Connection pooling
- PostgreSQL uyumluluğu
- Active community & maintainance

## Karar
**Prisma ORM** kullanıyoruz (v7.9.1).

### Neden Prisma?

1. **Tip Güvenliği:** Schema'dan otomatik TypeScript tipleri üretilir
2. **Migration Yönetimi:** `prisma migrate dev` ile versiyonlu migration'lar
3. **JSON Desteği:** Karakter stats, skills, talents gibi kompleks veriler JSON alanlarda saklanır
4. **Declarative Schema:** Tek bir `.prisma` dosyasında tüm schema tanımı
5. **Prisma Client:** Runtime'da generate edilir, query builder API'si sunar

### Schema Yapısı

```prisma
model Character {
  id              String   @id @default(cuid())
  slug            String   @unique
  name            String
  element         String
  role            String
  rarity          String
  
  // Complex data stored as JSON
  stats           Json     // CharacterStats
  skills          Json     // CharacterSkill[]
  talents         Json     // CharacterTalent[]
  popularBuilds   Json     // CharacterBuild[]
  
  // Metrics
  popularity      Int      @default(0)
  winRate         Float    @default(0)
  
  // Indexes for query performance
  @@index([element])
  @@index([role])
  @@index([popularity])
}
```

### Prisma 7.x Migration

Prisma 7.x'te önemli değişiklikler oldu:
- `datasource.url` schema'dan kaldırıldı → `prisma.config.ts`'e taşındı
- Doğrudan bağlantı için adapter kullanımı zorunlu: `@prisma/adapter-pg`
- Connection pooling pg Pool üzerinden yönetiliyor

```typescript
// prisma.config.ts
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

// database.ts
const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

## Sonuçlar

### Olumlu
- ✅ Schema-first yaklaşım: Tek dosyada tüm veritabanı yapısı
- ✅ Otomatik tip üretimi: `prisma generate` sonrası tam TypeScript desteği
- ✅ Migration'lar: `prisma migrate dev/deploy` ile versiyonlu DB değişiklikleri
- ✅ Prisma Studio: Görsel DB management aracı

### Olumsuz
- ⚠️ JSON alanlar: JSON veri üzerinde SQL-level sorgulama sınırlı
- ⚠️ Complex query'ler: Raw SQL gerektiğinde `.$queryRaw` kullanmak gerekiyor
- ⚠️ v7.x breaking changes: Adapter zorunluluğu migration gerektirdi

### Risk Yönetimi
- JSON alanlar için service katmanında validation yapılıyor (Zod)
- Performans kritik sorgular için raw SQL kullanılabiliyor
- Index'ler schema'da tanımlanıyor, EXPLAIN ANALYZE ile doğrulanıyor

## Alternatifler Değerlendirilen

| ORM | Artı | Eksi | Karar |
|-----|------|------|-------|
| **Prisma** | Tip güvenliği, migration, schema-first | JSON sorgu limiti, v7 breaking | ✅ Seçildi |
| Drizzle | Lightweight, SQL-like | Migration olgunluk seviyesi, topluluk küçük | ❌ Reddedildi |
| TypeORM | Decorator pattern, mature | Complex, TypeScript-first değil | ❌ Reddedildi |
| Knex.js | Raw SQL control, flexible | Migration ayrı, tip güvenliği yok | ❌ Reddedildi |
