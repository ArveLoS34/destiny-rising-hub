# ADR-001: Repository Pattern Kullanımı

## Durum
✅ Kabul Edildi

## Bağlam
Destiny Rising Hub'da karakter verisine erişim için doğrudan Prisma client kullanmak yerine, bir Repository Pattern implement etmemiz gerekiyordu.

**Sorunlar:**
- Business logic'in data access ile iç içe geçmesi
- Test edilebilirlik zorluğu
- Veri kaynağı değiştiğinde (örn: SQLite → PostgreSQL) tüm kodu değiştirmek zorunda kalmak
- Domain model ile database model arasındaki mapping'in dağınık olması

## Karar
Repository Pattern kullanıyoruz:

```
src/
├── repositories/       # Data access layer
│   └── character-repository.ts
├── services/           # Business logic layer
│   └── character-service.ts
├── types/
│   └── domain/         # Domain models (DB'den bağımsız)
└── lib/
    └── database.ts     # Database connection management
```

**Kurallar:**
1. Repository'ler sadece CRUD + query operasyonları yapar
2. Business logic Service katmanında yaşar
3. Domain tipleri Prisma tiplerinden bağımsızdır
4. Repository'ler domain tipini döndürür, Prisma tipini değil

```typescript
// Repository: Sadece data access
class CharacterRepository {
  async findById(id: string): Promise<Character | null>
  async create(data: CreateCharacterInput): Promise<Character>
  async search(query: string): Promise<Character[]>
}

// Service: Business logic
class CharacterService {
  async getCharacter(id: string): Promise<Character> {
    // View tracking, permission checks, caching, etc.
    const character = await this.repository.findById(id);
    await this.trackView(id);
    return character;
  }
}
```

## Sonuçlar

### Olumlu
- ✅ Test edilebilirlik: Repository mock'lanabilir
- ✅ Veri kaynağı bağımsızlığı: Prisma → Drizzle geçişi sadece Repository'yi etkiler
- ✅ Business logic izolasyonu: Service katmanı saf iş mantığı içerir
- ✅ Domain model bağımsızlığı: Frontend domain tiplerini kullanır, Prisma detaylarını bilmez

### Olumsuz
- ⚠️ Ekstra katman: Basit CRUD için bile Repository + Service yazmak gerekir
- ⚠️ Type mapping: Prisma tipi ↔ Domain tipi dönüşümü gerekiyor (`as unknown as Character`)
- ⚠️ Boilerplate: Her model için Repository + Service dosyası

### Nötr
- Performans etkisi yok — sadece fonksiyon çağrı overhead'i

## Alternatifler Değerlendirilen

1. **Doğrudan Prisma kullanımı** → Reject: Test edilemez, tight coupling
2. **GraphQL resolver pattern** → Reject: Overkill, REST API yeterli
3. **Active Record (Sequelize-style)** → Reject: Domain model ile çakışır
