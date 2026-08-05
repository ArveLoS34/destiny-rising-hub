# RC Validation Reports

> Bu klasör, her Release Candidate'ın doğrulama kanıtlarını içerir.
> Her RC tamamlandığında, gerçek ortam çıktısı bu klasörde saklanır.
>
> **Amaç:** "Production ready" iddiasının geriye dönük izlenebilir kanıtları.

## RC Yapısı

Kalite niteliği odaklı release süreci:

```
RC-1  Infrastructure          → Altyapı ayağa kalkıyor mu?
  ↓
RC-2  Functional Validation   → Kullanıcı akışları çalışıyor mu?
  ↓
RC-3  Performance Validation  → Yük altında performans yeterli mi?
  ↓
RC-4  Security Validation     → Güvenlik açıkları temiz mi?
  ↓
RC-5  Production Rehearsal    → Production provası başarılı mı?
  ↓
RC-6  Launch Approval         → v1.0 release onayı
```

## Evidence Klasörü

Her RC, somut kanıtlarını `evidence/` altında saklar:

```
docs/validation/
├── README.md
├── RC-1.md          → Infrastructure
├── RC-2.md          → Functional
├── RC-3.md          → Performance
├── RC-4.md          → Security
├── RC-5.md          → Production Rehearsal
├── RC-6.md          → Launch Approval
└── evidence/
    ├── screenshots/ → UI, dashboard, test sonuçları
    ├── logs/        → Docker logs, API logs, DB logs
    └── reports/     → k6, Lighthouse, Trivy, ZAP raporları
```

## RC Durumları

| RC | Başlık | Durum | Tarih | Rapor |
|----|--------|-------|-------|-------|
| RC-1 | Infrastructure Validation | 🟡 Ready (pre-flight ✅) | — | [RC-1.md](./RC-1.md) |
| RC-2 | Functional Validation | ⏳ Pending | — | [RC-2.md](./RC-2.md) |
| RC-3 | Performance Validation | ⏳ Pending | — | [RC-3.md](./RC-3.md) |
| RC-4 | Security Validation | ⏳ Pending | — | [RC-4.md](./RC-4.md) |
| RC-5 | Production Rehearsal | ⏳ Pending | — | [RC-5.md](./RC-5.md) |
| RC-6 | Launch Approval | ⏳ Pending | — | [RC-6.md](./RC-6.md) |

## Dosya Formatı

Her RC raporu şu bölümleri içerir:

```markdown
# RC-N: Başlık

## Objective
Bu RC'nin amacı nedir?

## Prerequisites
Hangi RC'lerin geçmesi gerekiyor?

## Test Senaryoları
Hangi senaryolar test edilecek? (tablo formatında)

## Evidence
Hangi kanıtlar toplanacak?

## Duration
Ne kadar sürdü?

## Issues Found
Hangi sorunlar bulundu?

## Status
✅ PASS / ❌ FAIL / ⏳ PENDING / 🟡 READY
```

## PASS Kriteri

Bir RC'nin "PASS" sayılması için:

1. Tüm test senaryoları başarılı olmalı
2. Kanıtlar `evidence/` klasörüne kaydedilmeli
3. Manuel müdahale gerekmemeli
4. Tekrarlanabilir olmalı (aynı adımlarla tekrar PASS)
5. `PROJECT-ASSESSMENT.md` güncellenmeli
6. Git commit: `rc(rc-N): ...`

## İlk RC Hangisi?

**RC-1 — Infrastructure Validation** ile başlanır.
Pre-flight 14/14 PASS. Gerçek Docker doğrulaması bekleniyor.
