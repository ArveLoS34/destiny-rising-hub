# Architecture Decision Records (ADR)

> Bu klasör, proje boyunca alınan mimari kararların kalıcı kaydını tutar.
> Her karar, bağlamı, gerekçesi ve sonuçlarıyla belgelenir.
> Yeni geliştiriciler bu dosyaları okuyarak "neden bu teknoloji?" sorusunun cevabını bulabilir.

## Format

Her ADR [Michael Nygard'ın formatını](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) takip eder:

```
# ADR-NNN: Başlık

## Durum
Önerilen / Kabul Edildi / Deprecated / Superseded by ADR-NNN

## Bağlam
Bu kararı gerektiren durum nedir?

## Karar
Ne karar verildi?

## Sonuçlar
Bu kararın olumlu/olumsuz sonuçları nelerdir?
```

## Kayıt Listesi

| ADR | Başlık | Durum | Tarih |
|-----|--------|-------|-------|
| [ADR-001](./ADR-001-repository-pattern.md) | Repository Pattern Kullanımı | ✅ Kabul Edildi | 2026-08-04 |
| [ADR-002](./ADR-002-prisma-orm.md) | Prisma ORM Seçimi | ✅ Kabul Edildi | 2026-08-04 |
| [ADR-003](./ADR-003-bullmq.md) | BullMQ Job Queue | ✅ Kabul Edildi | 2026-08-05 |
| [ADR-004](./ADR-004-redis-cache.md) | Redis Cache Strategy | ✅ Kabul Edildi | 2026-08-05 |
| [ADR-005](./ADR-005-nextjs-standalone.md) | Next.js 16 Standalone Output | ✅ Kabul Edildi | 2026-08-05 |
| [ADR-006](./ADR-006-docker-compose.md) | Docker Compose Geliştirme Ortamı | ✅ Kabul Edildi | 2026-08-05 |
| [ADR-007](./ADR-007-milestone-workflow.md) | Milestone + RC Release Workflow | ✅ Kabul Edildi | 2026-08-05 |

## ADR Okuma Rehberi

- **Yeni geliştirici:** Önce ADR-001 ve ADR-002'yi okuyun — proje yapısının temelini anlarsınız.
- **Altyapı değişikliği planlayan:** ADR-003, ADR-004, ADR-006'yı inceleyin.
- **Release sürecine katılan:** ADR-007'yi okuyun — RC mantığını anlarsınız.
