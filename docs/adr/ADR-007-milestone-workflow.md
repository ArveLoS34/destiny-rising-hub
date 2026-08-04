# ADR-007: Milestone + RC Release Workflow

## Durum
✅ Kabul Edildi (2026-08-05)

## Bağlam
Proje geliştirme sürecinde "Sprint" ve "Wave" terminolojileri kullanılıyordu. Ancak proje olgunlaştıkça, özellik geliştirmeden **doğrulama ve kararlılık** aşamasına geçildi.

**Sorunlar:**
- "Sprint 16" gibi numaralandırma ilerleme hakkında bilgi vermiyor
- "Wave 1" ne zaman biter, ne zaman production'a geçer belirsiz
- "Kod yazıldı" ile "Production'da doğrulandı" aynı anda raporlanıyor
- Release kriterleri net değil

## Karar
**Milestone + Release Candidate (RC)** modeline geçiyoruz.

### Model

```
Milestone (Kapsam)
  └── RC (Release Candidate — Doğrulama)
        └── Release (Production Deploy)
```

### Milestone Yapısı

| Milestone | Kapsam | Durum |
|-----------|--------|-------|
| **M1** | Database + Repository + Service + Tests | 🔨 Dev complete |
| **M2** | Identity + OAuth + RBAC + Session | ⏳ Schema ready |
| **M3** | Infrastructure (Redis + BullMQ + Storage + SMTP) | ⏳ Planned |
| **M4** | Production Validation + CI/CD + Beta | 🔨 Partially started |

### Release Candidate Yapısı

Her milestone için RC'ler oluşturulur. RC'nin amacı: **kanıt üretmek**.

```
RC-1: Infrastructure Validation
  docker compose up → Tüm servisler healthy → PASS

RC-2: Database Validation
  migrate → seed → 20 karakter → API → Frontend → PASS

RC-3: Identity Validation
  Google/GitHub/Discord OAuth → Session → Logout → PASS

RC-4: Storage Validation
  Upload → Delete → Resize → WebP/AVIF → PASS

RC-5: Queue Validation
  Import → Worker → Validation → Publish → Complete → PASS

RC-6: Full Workflow Validation
  CMS → Validation → Review → Publish → Queue → 
  Search Index → AI Refresh → Notification → Frontend → PASS
```

### "Kod Yazıldı" vs "Production Doğrulandı" Ayrımı

Her bileşen için iki durum:

```
┌─────────────────────┬─────────────────┬─────────────────────┐
│ Bileşen             │ Development     │ Production          │
│                     │ (kod yazıldı)   │ (doğrulandı)        │
├─────────────────────┼─────────────────┼─────────────────────┤
│ Prisma Schema       │ ✅              │ ⏳ Migration bekleniyor│
│ Repository          │ ✅              │ ⏳ DB testi bekleniyor │
│ Docker Compose      │ ✅              │ ⏳ `docker compose up` │
│ Integration Tests   │ ✅ Yazıldı      │ ⏳ `npm test` bekleniyor│
│ OAuth               │ ⏳ Schema       │ ⏳ İmplementasyon       │
└─────────────────────┴─────────────────┴─────────────────────┘
```

### Release Criteria

Bir RC'nin "passed" sayılması için:

1. Tüm health check'ler PASS
2. Tüm integration testler PASS (0 failure)
3. Response time p95 < hedef
4. Error rate < 0.1%
5. Memory usage < limit
6. Zero data loss test geçildi

### Release Checklist (`RELEASE_CHECKLIST.md`)

Her release'te doldurulur:
- [ ] Database migration applied
- [ ] Seed data verified
- [ ] Integration tests PASS
- [ ] E2E tests PASS
- [ ] Lighthouse score met
- [ ] Security scan clean
- [ ] Performance test PASS
- [ ] Backup verified
- [ ] Rollback plan ready
- [ ] Monitoring active
- [ ] Release notes published
- [ ] Git tag created

## Sonuçlar

### Olumlu
- ✅ Net kriterler: RC ya PASS ya FAIL — gri alan yok
- ✅ "Kod yazıldı" ≠ "Doğrulandı" ayrımı net
- ✅ Milestone kapsamlı, RC spesifik — hem stratejik hem taktik
- ✅ Yeni geliştirici: ADR-007'yi okuyarak süreci anlar
- ✅ Stakeholder iletişimi: "RC-3'teyiz" → herkes ne anladığını bilir

### Olumsuz
- ⚠️ RC süreci zaman alır — her doğrulama manual testing gerektirir
- ⚠️ Dokümantasyon yükü: ADR + MILESTONES + RELEASE_CHECKLIST güncel tutmak gerekir
- ⚠️ Küçük değişiklikler için bile RC süreci ağır olabilir

### Karar Kuralları
1. Her milestone en az 1 RC geçmeden production'a deploy edilmez
2. RC sonuçları GitHub Issues'da track edilir
3. Failed RC → root cause analysis → fix → re-run
4. Release notes her release'te yayınlanır
5. ADR'ler karar değiştiğinde güncellenir (eski ADR superseded olarak işaretlenir)

## Değişiklik Günlüğü

| Tarih | Değişiklik |
|-------|-----------|
| 2026-08-05 | Sprint/Wave → Milestone/RC geçişi |
| 2026-08-05 | "Kod yazıldı" vs "Production doğrulandı" ayrımı eklendi |
| 2026-08-05 | RC-1 through RC-6 tanımlandı |
