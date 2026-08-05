# RC-2: Functional Validation

## Exit Criteria

- [ ] 43/43 kullanıcı akışı PASS
- [ ] Kanıt `docs/validation/evidence/` altına kaydedildi
- [ ] `PROJECT-ASSESSMENT.md` güncellendi
- [ ] RC-1 etkilenmedi (altyapı hâlâ sağlıklı)
- [ ] Rollback planı doğrulandı
- [ ] Tekrarlanabilir: Aynı senaryolar ikinci kez de PASS

**Status:** ⬜ NOT STARTED

---

## Objective

Tüm kritik kullanıcı akışları uçtan uca çalışıyor mu?
Gerçek kullanıcı senaryoları hiçbir manuel müdahale olmadan tamamlanabiliyor mu?

## Prerequisites

- ✅ RC-1 PASS (Infrastructure doğrulandı)

## Test Senaryoları

### Authentication & Authorization

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 1 | Kullanıcı kayıt (email/password) | Hesap oluşturuldu, email doğrulama | ⬜ |
| 2 | Google OAuth ile giriş | Redirect → consent → session | ⬜ |
| 3 | GitHub OAuth ile giriş | Redirect → consent → session | ⬜ |
| 4 | Discord OAuth ile giriş | Redirect → consent → session | ⬜ |
| 5 | Logout | Session sonlandı, redirect | ⬜ |
| 6 | Yetkisiz erişim → 401 | Korumalı route engellendi | ⬜ |
| 7 | Yetkisiz rol → 403 | Admin route engellendi | ⬜ |

### User Profile

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 8 | Profil görüntüleme | Kullanıcı bilgileri doğru | ⬜ |
| 9 | Profil düzenleme | Değişiklikler kaydedildi | ⬜ |
| 10 | Avatar yükleme | Image upload + resize başarılı | ⬜ |
| 11 | Şifre değiştirme | Eski şifre doğrulandı, yeni aktif | ⬜ |

### Character Operations

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 12 | Karakter listesi | 20 karakter render edildi | ⬜ |
| 13 | Karakter detay | Tüm alanlar doğru | ⬜ |
| 14 | Karakter arama | Sonuçlar doğru, <200ms | ⬜ |
| 15 | Karakter filtreleme | Element/Role/Rarity çalışıyor | ⬜ |
| 16 | Karakter sıralama | Popularity/Name sıralaması | ⬜ |

### Content: Builds & Teams

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 17 | Build oluşturma | Kaydedildi, slug oluşturuldu | ⬜ |
| 18 | Build düzenleme | Değişiklikler yansıdı | ⬜ |
| 19 | Build silme | Soft delete, artık görünmüyor | ⬜ |
| 20 | Team oluşturma | Üyeler doğru bağlandı | ⬜ |
| 21 | Team paylaşma | Public link erişilebilir | ⬜ |

### Content: Guides

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 22 | Guide oluşturma (DRAFT) | DRAFT olarak kaydedildi | ⬜ |
| 23 | Guide düzenleme | Markdown render doğru | ⬜ |
| 24 | Guide publish | PUBLISHED, listede görünüyor | ⬜ |
| 25 | Guide archive | ARCHIVED, listeden kaldırıldı | ⬜ |

### Social Features

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 26 | Yorum yazma | Kaydedildi, listelendi | ⬜ |
| 27 | Yorum yanıtlama | Thread oluştu | ⬜ |
| 28 | Like/Reaction | Sayı arttı, toggle çalıştı | ⬜ |
| 29 | Favori ekleme | Favoriler listesine eklendi | ⬜ |
| 30 | Follow/Unfollow | Takip ilişkisi oluştu/kalktı | ⬜ |

### AI Features

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 31 | AI Advisor — Build önerisi | Öneri <5sn, geçerli içerik | ⬜ |
| 32 | AI Advisor — Team önerisi | Öneri <5sn, geçerli içerik | ⬜ |
| 33 | AI Counter-pick | Counter karakter listesi doğru | ⬜ |

### Admin Operations

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 34 | Admin — Karakter oluştur | DB'ye yazıldı, listede | ⬜ |
| 35 | Admin — Karakter güncelle | Değişiklikler yansıdı | ⬜ |
| 36 | Admin — Guide onaylama | DRAFT → PUBLISHED | ⬜ |
| 37 | Admin — Kullanıcı ban | Kullanıcı erişimi kesildi | ⬜ |
| 38 | Admin — Rapor inceleme | PENDING → RESOLVED | ⬜ |

### Navigation & Search

| # | Senaryo | Beklenen Sonuç | Durum |
|---|---------|----------------|-------|
| 39 | Global search | Sonuçlar <500ms | ⬜ |
| 40 | Filter + Sort kombinasyonu | Doğru sonuç kümesi | ⬜ |
| 41 | Pagination | Sayfalama çalışıyor | ⬜ |
| 42 | Deep link | URL'den doğru sayfa açıldı | ⬜ |
| 43 | 404 handling | Geçerli 404 sayfası | ⬜ |

## Evidence

> **⏳ PENDING**
>
> - [ ] Her senaryo için screenshot
> - [ ] API response logları
> - [ ] Database state doğrulama
> - [ ] Response time ölçümleri

## Duration

> **⏳ PENDING**

## Issues Found

> **⏳ PENDING**

## Status

⏳ **PENDING** — RC-1 sonrası başlatılacak

---

### PASS Criteria

| Kontrol | Beklenen | Durum |
|---------|----------|-------|
| Tüm auth akışları | ✅ | ⬜ |
| Tüm CRUD operasyonları | ✅ | ⬜ |
| Tüm social features | ✅ | ⬜ |
| AI features | ✅ | ⬜ |
| Admin operations | ✅ | ⬜ |
| Navigation & Search | ✅ | ⬜ |
| Manual intervention | 0 | ⬜ |
| **Genel** | **43/43 PASS** | ⬜ |
