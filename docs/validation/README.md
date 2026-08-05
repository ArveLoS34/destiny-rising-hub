# RC Validation Reports

> Bu klasör, her Release Candidate'ın doğrulama kanıtlarını içerir.
> Her RC tamamlandığında, gerçek ortam çıktısı bu klasörde saklanır.
>
> **Amaç:** "Production ready" iddiasının geriye dönük izlenebilir kanıtları.

## Dosya Formatı

Her RC raporu şu bölümleri içerir:

```markdown
# RC-N: Başlık

## Objective
Bu RC'nin amacı nedir?

## Environment
Hangi ortamda doğrulama yapıldı?

## Commands
Hangi komutlar çalıştırıldı?

## Expected Result
Beklenen sonuç ne?

## Actual Result
Gerçek sonuç ne? (komut çıktısı)

## Evidence
Ekran görüntüleri, loglar, metrikler.

## Status
✅ PASS / ❌ FAIL / ⏳ PENDING
```

## RC Durumları

| RC | Başlık | Durum | Tarih | Rapor |
|----|--------|-------|-------|-------|
| RC-1 | Infrastructure Validation | ⏳ Pending | — | [RC-1.md](./RC-1.md) |
| RC-2 | Database Validation | ⏳ Pending | — | [RC-2.md](./RC-2.md) |
| RC-3 | Identity Validation | ⏳ Pending | — | [RC-3.md](./RC-3.md) |
| RC-4 | Storage Validation | ⏳ Pending | — | [RC-4.md](./RC-4.md) |
| RC-5 | Queue Validation | ⏳ Pending | — | [RC-5.md](./RC-5.md) |
| RC-6 | Full Workflow Validation | ⏳ Pending | — | [RC-6.md](./RC-6.md) |

## İlk RC Hangisi?

**RC-1 — Infrastructure Validation** ile başlanır.
Boş bir ortamda `docker compose up` çalıştırılır ve tüm servislerin healthy olduğu doğrulanır.
