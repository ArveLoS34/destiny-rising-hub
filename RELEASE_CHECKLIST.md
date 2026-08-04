# Release Checklist

> Her release öncesi bu checklist doldurulur.
> Tüm maddeler işaretlenmeden production deploy yapılmaz.
>
> **Sorumlu:** [İlgili kişi]
> **Release Versiyonu:** v0.0.0
> **Release Tarihi:** YYYY-MM-DD
> **RC Durumu:** RC-X (PASS/FAIL)

---

## 1. Kod & Build

- [ ] Tüm branch'ler merge edildi
- [ ] TypeScript: 0 error (`npx tsc --noEmit`)
- [ ] ESLint: 0 error (`npm run lint`)
- [ ] Build başarılı (`npm run build`)
- [ ] Docker image build edildi
- [ ] Docker image test edildi

## 2. Database

- [ ] Migration dosyaları hazır
- [ ] Migration production'da uygulandı (`prisma migrate deploy`)
- [ ] Migration rollback planı hazır
- [ ] Seed data doğrulandı (beklenen kayıt sayısı)
- [ ] Backup alındı (migration öncesi)
- [ ] Index performansı doğrulandı (`EXPLAIN ANALYZE`)

## 3. Testing

- [ ] Unit testler: PASS (`npm test -- --testPathPattern=unit`)
- [ ] Integration testler: PASS (`npm test -- --testPathPattern=integration`)
- [ ] E2E testler: PASS (Playwright / Cypress)
- [ ] Smoke testler: PASS (temel user flow'lar)
- [ ] Regression testler: PASS (önceki release'lerin bug fix'leri)
- [ ] Test coverage: > %70

## 4. Performance

- [ ] Lighthouse Performance: > 90
- [ ] Lighthouse Accessibility: > 95
- [ ] Lighthouse Best Practices: > 90
- [ ] Lighthouse SEO: > 90
- [ ] API response time p95: < 500ms
- [ ] API response time p99: < 1000ms
- [ ] DB query time (slow queries): < 100ms
- [ ] Static asset load: < 1s
- [ ] First Contentful Paint: < 2s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Cumulative Layout Shift: < 0.1

## 5. Security

- [ ] `npm audit` — 0 high/critical vulnerability
- [ ] Security headers doğrulandı (X-Frame-Options, CSP, etc.)
- [ ] OAuth flow test edildi
- [ ] Session management test edildi
- [ ] Rate limiting aktif
- [ ] Input validation doğrulandı (XSS, SQL injection)
- [ ] Secrets production environment variables'ta (hardcoded değil)
- [ ] HTTPS enforced
- [ ] CORS policy doğrulandı

## 6. Infrastructure

- [ ] Docker Compose ile tam ortam ayağa kalktı
- [ ] Health check endpoint'ler PASS (`/api/health`)
- [ ] PostgreSQL bağlantısı sağlıklı
- [ ] Redis bağlantısı sağlıklı
- [ ] Storage (MinIO/S3) erişilebilir
- [ ] SMTP (Mailpit) email gönderebiliyor
- [ ] Backup stratejisi aktif
- [ ] Backup restore testi yapıldı
- [ ] Log sistemi aktif (structured logging)

## 7. Monitoring

- [ ] Error tracking aktif (Sentry / equivalent)
- [ ] Performance monitoring aktif
- [ ] Uptime monitoring aktif
- [ ] Alerting kuralları tanımlı
- [ ] Dashboard erişilebilir
- [ ] Log aggregation aktif

## 8. Deployment

- [ ] CI/CD pipeline PASS
- [ ] Staging deploy başarılı
- [ ] Staging smoke testler PASS
- [ ] Production deploy planı hazır
- [ ] Rollback planı hazır ve test edildi
- [ ] Deploy zamanı belirlendi (düşük traffic window)
- [ ] Deploy comunicasyonu yapıldı (ekip bilgilendirildi)
- [ ] Feature flags ayarlandı (gerekirse)

## 9. Content & Data

- [ ] Seed data güncel (son oyun patch'i ile uyumlu)
- [ ] Static content (images, icons) doğrulandı
- [ ] Localization content güncel (i18n)
- [ ] Meta tags ve SEO content güncel

## 10. Documentation

- [ ] Release notes hazırlandı
- [ ] CHANGELOG güncellendi
- [ ] API documentation güncel
- [ ] ADR'ler güncel (yeni karar varsa)
- [ ] MILESTONES.md güncel
- [ ] README.md güncel (gerekirse)

## 11. Post-Release

- [ ] Production smoke testler PASS
- [ ] Error rate < 0.1% (ilk 1 saat)
- [ ] Performance metrikler normal (ilk 1 saat)
- [ ] User feedback monitoring aktif
- [ ] Rollback gerekip gerekmediği değerlendirildi (ilk 24 saat)
- [ ] Release announcement yayınlandı
- [ ] Git tag oluşturuldu (`vX.Y.Z`)

---

## Sign-off

| Rol | İsim | Tarih | Onay |
|-----|------|-------|------|
| Tech Lead | | | ☐ |
| DevOps | | | ☐ |
| QA | | | ☐ |
| Product Owner | | | ☐ |

---

## Release Notes Template

```markdown
# Release v0.0.0 — YYYY-MM-DD

## What's New
- [Feature 1]
- [Feature 2]

## Improvements
- [Improvement 1]

## Bug Fixes
- [Bug fix 1]

## Breaking Changes
- None / [Breaking change description]

## Known Issues
- [Known issue 1]

## Migration Notes
- [Migration steps if any]

## Full Changelog
[GitHub compare link]
```
