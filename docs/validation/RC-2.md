# RC-2: Functional Validation

## Status: ⏳ NOT STARTED

**Target Date:** TBD  
**Estimated Duration:** 2-3 days  
**Commit:** TBD

---

## RC-2 Objective

Kullanıcı akışlarının uçtan uca çalıştığını kanıta dayalı testlerle doğrulamak.

**RC-1 vs RC-2:**
- RC-1: Altyapı çalışıyor mu? (Infrastructure)
- RC-2: Ürün kullanılabilir mi? (Functional)

---

## Test Stratejisi

### Test Tipleri

1. **API Integration Tests (Jest)**
   - Otomatik, tekrarlanabilir
   - Hızlı geri bildirim
   - CI/CD entegrasyonu

2. **E2E Tests (Playwright)**
   - Gerçek kullanıcı akışları
   - Sayfa erişilebilirliği
   - UI etkileşimleri

3. **Manual Smoke Tests**
   - Kritik akışlar
   - Görsel doğrulama
   - Edge case'ler

---

## Test Senaryoları

### Kategori 1: API Endpoints (Otomatik Test - Jest)

#### 1.1 Health Check API
| # | Test Senaryosu | Beklenen Sonuç | Otomasyon |
|---|----------------|----------------|-----------|
| 1.1.1 | GET /api/health | 200 OK, status: healthy | ✅ Jest |
| 1.1.2 | Health check database kontrolü | database: healthy | ✅ Jest |
| 1.1.3 | Health check application kontrolü | application: healthy | ✅ Jest |

**Kanıt:** Jest test çıktısı  
**PASS Kriteri:** Tüm testler PASS

---

#### 1.2 Characters API
| # | Test Senaryosu | Beklenen Sonuç | Otomasyon |
|---|----------------|----------------|-----------|
| 1.2.1 | GET /api/v1/characters | 200 OK, 20 karakter | ✅ Jest |
| 1.2.2 | GET /api/v1/characters/nova | 200 OK, character data | ✅ Jest |
| 1.2.3 | GET /api/v1/characters?element=Fire | 200 OK, filtered results | ✅ Jest |
| 1.2.4 | GET /api/v1/characters?search=nova | 200 OK, search results | ✅ Jest |
| 1.2.5 | GET /api/v1/characters/invalid | 404 Not Found | ✅ Jest |

**Kanıt:** Jest test çıktısı  
**PASS Kriteri:** Tüm testler PASS

---

#### 1.3 Authentication API (Mevcut ise)
| # | Test Senaryosu | Beklenen Sonuç | Otomasyon |
|---|----------------|----------------|-----------|
| 1.3.1 | POST /api/auth/signup | 200 OK, user created | ✅ Jest |
| 1.3.2 | POST /api/auth/signin | 200 OK, session created | ✅ Jest |
| 1.3.3 | POST /api/auth/signout | 200 OK, session destroyed | ✅ Jest |
| 1.3.4 | GET /api/auth/session | 200 OK, valid session | ✅ Jest |

**Kanıt:** Jest test çıktısı  
**PASS Kriteri:** Tüm testler PASS (veya N/A eğer auth sistemi yoksa)

---

### Kategori 2: Page Accessibility (Otomatik Test - Playwright)

#### 2.1 Public Pages
| # | Sayfa | Beklenen Sonuç | Otomasyon |
|---|-------|----------------|-----------|
| 2.1.1 | / | 200 OK, homepage loads | ✅ Playwright |
| 2.1.2 | /destiny-rising/characters | 200 OK, character list | ✅ Playwright |
| 2.1.3 | /destiny-rising/characters/nova | 200 OK, character detail | ✅ Playwright |
| 2.1.4 | /destiny-rising/weapons | 200 OK, weapon list | ✅ Playwright |
| 2.1.5 | /destiny-rising/materials | 200 OK, material list | ✅ Playwright |
| 2.1.6 | /destiny-rising/teams | 200 OK, team compositions | ✅ Playwright |
| 2.1.7 | /destiny-rising/build-lab | 200 OK, build lab | ✅ Playwright |
| 2.1.8 | /destiny-rising/combat-lab | 200 OK, combat lab | ✅ Playwright |
| 2.1.9 | /destiny-rising/ai-advisor | 200 OK, AI advisor | ✅ Playwright |
| 2.1.10 | /destiny-rising/planner | 200 OK, resource planner | ✅ Playwright |
| 2.1.11 | /destiny-rising/world | 200 OK, world map | ✅ Playwright |
| 2.1.12 | /destiny-rising/community | 200 OK, community page | ✅ Playwright |

**Kanıt:** Playwright test raporu  
**PASS Kriteri:** Tüm sayfalar 200 OK

---

#### 2.2 Dynamic Pages (Seed Data)
| # | Sayfa | Beklenen Sonuç | Otomasyon |
|---|-------|----------------|-----------|
| 2.2.1 | /destiny-rising/characters/[slug] | 200 OK for all 20 characters | ✅ Playwright |
| 2.2.2 | /destiny-rising/weapons/[slug] | 200 OK for seeded weapons | ✅ Playwright |
| 2.2.3 | /destiny-rising/materials/[slug] | 200 OK for seeded materials | ✅ Playwright |

**Kanıt:** Playwright test raporu  
**PASS Kriteri:** Tüm dynamic sayfalar 200 OK

---

#### 2.3 Admin Pages
| # | Sayfa | Beklenen Sonuç | Otomasyon |
|---|-------|----------------|-----------|
| 2.3.1 | /admin | 200 OK, admin dashboard | ✅ Playwright |
| 2.3.2 | /admin/dashboard | 200 OK, dashboard | ✅ Playwright |
| 2.3.3 | /admin/characters | 200 OK, character management | ✅ Playwright |
| 2.3.4 | /admin/weapons | 200 OK, weapon management | ✅ Playwright |
| 2.3.5 | /admin/materials | 200 OK, material management | ✅ Playwright |
| 2.3.6 | /admin/builds | 200 OK, build management | ✅ Playwright |
| 2.3.7 | /admin/teams | 200 OK, team management | ✅ Playwright |
| 2.3.8 | /admin/imports | 200 OK, import interface | ✅ Playwright |
| 2.3.9 | /admin/jobs | 200 OK, job queue | ✅ Playwright |
| 2.3.10 | /admin/monitor | 200 OK, monitoring | ✅ Playwright |

**Kanıt:** Playwright test raporu  
**PASS Kriteri:** Tüm admin sayfalar 200 OK

---

### Kategori 3: Content Verification (Manuel Smoke Test)

#### 3.1 Character Data
| # | Kontrol | Beklenen Sonuç | Kanıt |
|---|---------|----------------|-------|
| 3.1.1 | Karakter listesi | 20 karakter görünüyor | Screenshot |
| 3.1.2 | Karakter detay | Tüm alanlar dolu | Screenshot |
| 3.1.3 | Karakter arama | Arama çalışıyor | Screenshot |
| 3.1.4 | Karakter filtreleme | Filtreler çalışıyor | Screenshot |

**PASS Kriteri:** Tüm kontroller başarılı

---

#### 3.2 Navigation
| # | Kontrol | Beklenen Sonuç | Kanıt |
|---|---------|----------------|-------|
| 3.2.1 | Ana menü | Tüm linkler çalışıyor | Screenshot |
| 3.2.2 | Breadcrumb | Doğru navigasyon | Screenshot |
| 3.2.3 | Back button | Tarayıcı geri butonu çalışıyor | Screenshot |
| 3.2.4 | 404 handling | 404 sayfası gösteriliyor | Screenshot |

**PASS Kriteri:** Tüm navigasyon çalışıyor

---

## Test Implementation Plan

### Aşama 1: Jest Integration Tests (API)

**Dosya:** `src/__tests__/integration/rc2-api.test.ts`

```typescript
describe('RC-2: API Integration Tests', () => {
  describe('Health API', () => {
    it('should return healthy status', async () => {
      // Test implementation
    });
  });

  describe('Characters API', () => {
    it('should return all characters', async () => {
      // Test implementation
    });
  });
});
```

**Expected Output:**
```
PASS src/__tests__/integration/rc2-api.test.ts
  RC-2: API Integration Tests
    Health API
      ✓ should return healthy status (50 ms)
    Characters API
      ✓ should return all characters (120 ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

---

### Aşama 2: Playwright E2E Tests (Pages)

**Dosya:** `e2e/rc2-pages.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('RC-2: Page Accessibility', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Destiny Rising Hub/);
  });

  test('characters page should load', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await expect(page.locator('h1')).toContainText('Characters');
  });
});
```

**Expected Output:**
```
Running 12 tests using 4 workers

  ✓ [chromium] › e2e/rc2-pages.spec.ts:3:5 › homepage should load (2.5s)
  ✓ [chromium] › e2e/rc2-pages.spec.ts:8:5 › characters page should load (1.8s)

  12 passed (45s)
```

---

### Aşama 3: Manual Smoke Tests

**Dosya:** `docs/validation/evidence/screenshots/RC-2-manual/`

Her kontrol için:
1. Ekran görüntüsü al
2. Kontrol listesini işaretle
3. Sorun varsa not ekle

---

## RC-2 Exit Criteria

### Must Have (PASS için zorunlu)

- [ ] Tüm API integration testler PASS (Jest)
- [ ] Tüm public sayfalar erişilebilir (Playwright)
- [ ] Tüm admin sayfalar erişilebilir (Playwright)
- [ ] 20 karakter seed data doğrulandı
- [ ] Health endpoint çalışıyor
- [ ] Character listesi ve detayları görüntüleniyor

### Should Have (Önerilen)

- [ ] Authentication akışı çalışıyor (varsa)
- [ ] Search ve filtreleme çalışıyor
- [ ] Navigation düzgün çalışıyor
- [ ] 404 handling doğru
- [ ] Responsive design (mobile)

### Nice to Have (İsteğe bağlı)

- [ ] Performance metrikleri (Lighthouse)
- [ ] Accessibility skorları
- [ ] Browser compatibility (Chrome, Firefox, Safari)

---

## Evidence Requirements

### Jest Test Kanıtları

```bash
# API testlerini çalıştır
npm test -- rc2-api

# Output:
# PASS src/__tests__/integration/rc2-api.test.ts
# Test Suites: 1 passed, 1 total
# Tests:       10 passed, 10 total
```

**Kanıt dosyası:** `docs/validation/evidence/reports/RC-2-jest-results.txt`

---

### Playwright Test Kanıtları

```bash
# E2E testlerini çalıştır
npm run test:e2e -- rc2-pages

# Output:
# Running 12 tests using 4 workers
# 12 passed (45s)
```

**Kanıt dosyası:** `docs/validation/evidence/reports/RC-2-playwright-results.txt`

---

### Manual Test Kanıtları

Her manuel test için:
1. Ekran görüntüsü: `docs/validation/evidence/screenshots/RC-2-manual/01-characters.png`
2. Kontrol listesi: `docs/validation/evidence/reports/RC-2-manual-checklist.md`

---

## RC-2 PASS Kararı

**RC-2 PASS sayılması için:**

1. ✅ Tüm Jest integration testler PASS
2. ✅ Tüm Playwright E2E testler PASS
3. ✅ Manuel smoke testler başarılı
4. ✅ Evidence dosyaları tamam
5. ✅ Kritik bug yok

**RC-2 FAIL sayılması için:**

1. ❌ Herhangi bir Jest testi FAIL
2. ❌ Herhangi bir Playwright testi FAIL
3. ❌ Kritik sayfa erişilemiyor
4. ❌ Seed data eksik

---

## Test Dosyaları

### Oluşturulacak Dosyalar

```
src/__tests__/integration/
└── rc2-api.test.ts              # API integration tests

e2e/
└── rc2-pages.spec.ts            # Page accessibility tests

docs/validation/evidence/
├── reports/
│   ├── RC-2-jest-results.txt
│   ├── RC-2-playwright-results.txt
│   └── RC-2-manual-checklist.md
└── screenshots/
    └── RC-2-manual/
        ├── 01-characters-list.png
        ├── 02-character-detail.png
        ├── 03-search.png
        └── ...
```

---

## Estimated Timeline

| Aşama | Süre | Çıktı |
|-------|------|-------|
| Jest test yazımı | 4-6 saat | rc2-api.test.ts |
| Playwright test yazımı | 6-8 saat | rc2-pages.spec.ts |
| Test çalıştırma | 1-2 saat | Test raporları |
| Manuel testler | 2-3 saat | Ekran görüntüleri |
| Dokümantasyon | 2-3 saat | RC-2.md güncelleme |
| **Toplam** | **15-22 saat** | **RC-2 PASS** |

---

## Success Metrics

**RC-2 tamamlandığında:**

```
✅ API Integration Tests: 10/10 PASS
✅ E2E Tests: 30/30 PASS
✅ Manual Tests: 15/15 PASS
✅ Evidence: 50+ files
✅ Critical Bugs: 0
✅ RC-2 Status: PASSED
```

---

## Next Steps

1. Jest integration testlerini yaz
2. Playwright E2E testlerini yaz
3. Testleri çalıştır ve kanıt topla
4. Manuel smoke testleri yap
5. RC-2.md'yi güncelle
6. PROJECT-ASSESSMENT.md'yi güncelle (1/6 → 2/6)
7. `rc(rc-2): mark RC-2 as PASSED` commit'i oluştur

---

**Status:** ⏳ NOT STARTED  
**Ready to Start:** Yes  
**Dependencies:** RC-1 PASSED ✅
