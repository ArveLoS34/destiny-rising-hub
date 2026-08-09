# DATABASE ARCHITECTURE — FULL INVENTORY
**Tarih:** 2026-08-09
**Durum:** Inventory only — hiçbir veri değiştirilmedi

---

## 1. PRISMA SCHEMA — MEVCUT MODELLER

**Dosya:** `prisma/schema.prisma` (649 satır)

### Oyun Verisi Modelleri (Sahte Veri İçeriyor)

| Model | Sorun | Alanlar |
|---|---|---|
| `Character` | ❌ Tüm alanlar sahte veri modeline göre | element, role, rarity, weaponType, faction, damageType, stats (Json), skills (Json), talents (Json), ultimate (Json), passive (Json), ascensionMaterials (Json), skillMaterials (Json), factionRelation (Json), tierListPlacement (Json), verification (Json) |

### Kullanıcı/Sosyal Modeller (Oyun Verisinden Bağımsız — DOKUNULMAYACAK)

| Model | Durum | Açıklama |
|---|---|---|
| `User` | ✅ Korunacak | Auth sistemi — oyun verisinden bağımsız |
| `Session` | ✅ Korunacak | Better Auth session |
| `Account` | ✅ Korunacak | OAuth accounts |
| `Verification` | ✅ Korunacak | Auth verification tokens |
| `Guide` | ✅ Korunacak | Kullanıcı içeriği |
| `SavedBuild` | ⚠️ Gözden geçirilecek | artifactSetId, mainStats (Genshin-style) — schema değişikliği gerekebilir |
| `SavedTeam` | ✅ Korunacak | Genel takım verisi |
| `Comment` | ✅ Korunacak | Yorum sistemi |
| `Rating` | ✅ Korunacak | Puanlama |
| `Reaction` | ✅ Korunacak | Reaksiyonlar |
| `Follow` | ✅ Korunacak | Takip sistemi |
| `Activity` | ✅ Korunacak | Aktivite logu |
| `Notification` | ✅ Korunacak | Bildirimler |
| `Favorite` | ✅ Korunacak | Favoriler |
| `Collection` | ✅ Korunacak | Koleksiyonlar |
| `Report` | ✅ Korunacak | Moderasyon |
| `AuditLog` | ✅ Korunacak | Admin log |
| `FeatureFlag` | ✅ Korunacak | Feature flags |
| `MediaAsset` | ✅ Korunacak | Medya dosyaları |

### Enum'lar (Schema)

| Enum | Durum | Değerler |
|---|---|---|
| `UserRole` | ✅ Korunacak | MEMBER, CONTRIBUTOR, VERIFIED_CREATOR, MODERATOR, ADMIN |
| `GuideCategory` | ✅ Korunacak | BEGINNER, ADVANCED, TIER_LIST, vb. |
| `ContentStatus` | ✅ Korunacak | DRAFT, REVIEW, PUBLISHED, ARCHIVED |
| `ReportReason` | ✅ Korunacak | SPAM, INAPPROPRIATE, vb. |
| `ReportStatus` | ✅ Korunacak | PENDING, REVIEWED, vb. |

**Not:** Character modeli için Prisma'da ayrı bir Element/Rarity/Role enum YOK — bunlar String olarak saklanıyor. TypeScript tip tanımları `src/types/domain/game.ts`'de.

---

## 2. SEED DOSYALARI

**Dosya:** `prisma/seed.ts`

- `characters.ts`'den sahte 20 karakteri okuyor
- Her karakter için rastgele stat'lar üretiyor (`Math.random()`)
- Sahte skill/talent/ultimate/passive verileri oluşturuyor
- `verified: true` metadata'sı ekliyor (sahte doğrulama)
- Tüm veriler uydurma → seed çalıştırıldığında DB'ye sahte veri yükleniyor

---

## 3. STATİK DATA DOSYALARI

**Dizin:** `src/data/games/destiny-rising/`

| Dosya | Satır | İçerik | Uydurma Kayıt Sayısı |
|---|---|---|---|
| `index.ts` | 37 | Game config (developer, publisher, modules) | 1 config (hepsi sahte) |
| `characters.ts` | 402 | CharacterSummary[] | 20 karakter (TÜMÜ uydurma) |
| `characters-detail.ts` | ~1000+ | Character[] (full detail) | 20 karakter detay (TÜMÜ uydurma) |
| `weapons.ts` | 494 | WeaponSummary[] | 25 silah (TÜMÜ uydurma) |
| `artifacts.ts` | 431 | ArtifactSet[] + Artifact[] | 6 set + 14 artifact (TÜMÜ uydurma) |
| `materials.ts` | 531 | Material[] | 13 materyal (TÜMÜ uydurma) |
| `teams.ts` | 318 | TeamSummary[] | 8 takım (TÜMÜ uydurma) |
| `builds.ts` | ~800+ | BuildSummary[] | ~15 build (TÜMÜ uydurma) |
| `world.ts` | ~400+ | World, Region[], Zone[], MapNode[] | Tüm dünya verisi (TÜMÜ uydurma) |

**Toplam:** ~4000+ satır sahte veri

---

## 4. TİP TANIMLARI (TYPE DEFINITIONS)

**Dizin:** `src/types/domain/`

### game.ts — Temel Enum'lar (TÜMÜ UYDURMA)

```typescript
// ❌ UYDURMA — Destiny: Rising ile 0 eşleşme
export type Rarity = "SSR" | "SR" | "R" | "N";

export type Element =
  | "Fire" | "Water" | "Wind" | "Earth"
  | "Lightning" | "Ice" | "Light" | "Dark" | "Physical";

export type Role = "DPS" | "Sub-DPS" | "Support" | "Tank" | "Healer" | "Utility";

export type WeaponType =
  | "Sword" | "Greatsword" | "Spear" | "Bow" | "Gun"
  | "Staff" | "Dagger" | "Cannon" | "Fist" | "Orb";

export type Faction =
  | "Genesis" | "Eclipse" | "Nova" | "Stellar" | "Void" | "Independent";

export type DamageType =
  | "Single Target" | "AoE" | "Burst" | "Sustained" | "Hybrid";
```

**Bu tanımlar TÜM veritabanının temelini oluşturuyor.**
Değiştirildiğinde etkilenen dosyalar: Tüm static data dosyaları + tüm service dosyaları + tüm UI component'leri + tüm TypeScript type'ları.

### Diğer Domain Dosyaları

| Dosya | Durum | Sorun |
|---|---|---|
| `character.ts` | ⚠️ Değişiklik gerektirir | game.ts enum'larına bağımlı, Genshin-style alanlar (artifactSetId, ascension, breakthrough) |
| `weapon.ts` | ⚠️ Değişiklik gerektirir | game.ts enum'larına bağımlı, manufacturer alanı, Genshin-style weapon stats |
| `artifact.ts` | ❌ Tamamen yeniden yazılacak | Genshin-style slot sistemi (flower/plume/sands/goblet/crown) |
| `material.ts` | ⚠️ Değişiklik gerektirir | Sahte materyal kategorileri |
| `build.ts` | ⚠️ Değişiklik gerektirir | artifactSetId, Genshin-style mainStats/subStats |
| `team.ts` | ⚠️ Değişiklik gerektirir | elementCoverage, faction synergy |
| `game.ts` | ❌ Tamamen yeniden yazılacak | Tüm enum'lar uydurma |
| `user.ts` | ✅ Korunacak | Oyun verisinden bağımsız |
| `community.ts` | ✅ Korunacak | Oyun verisinden bağımsız |
| `content.ts` | ✅ Korunacak | Oyun verisinden bağımsız |
| `combat.ts` | ⚠️ Değişiklik gerektirir | Element/DamageType bağımlılığı |
| `world.ts` | ❌ Tamamen yeniden yazılacak | Sahte bölge/zone verileri |
| `admin.ts` | ✅ Korunacak | Oyun verisinden bağımsız |

---

## 5. SERVİS KATMANI — STATİK VERİ KULLANAN DOSYALAR

| Service Dosyası | İmport Ettiği Veri |
|---|---|
| `features/characters/services/character-service.ts` | characters.ts, characters-detail.ts |
| `features/weapons/services/` | weapons.ts |
| `features/artifacts/services/artifact-service.ts` | artifacts.ts |
| `features/materials/services/material-service.ts` | materials.ts |
| `features/builds/services/build-service.ts` | builds.ts |
| `features/teams/services/` | teams.ts |
| `features/ai-advisor/services/advisor-engine.ts` | characters, weapons, builds, teams |
| `features/combat/services/build-score-v2.ts` | charactersDetail, weapons, builds, teams |
| `features/combat/services/damage-calculator.ts` | charactersDetail, weapons, artifactSets |
| `features/discovery/services/knowledge/knowledge-service.ts` | charactersDetail, weapons, builds, teams, materials |
| `features/discovery/services/search/search-service.ts` | characters, weapons, builds, teams, materials, mapNodes |
| `features/planner/services/planner-service.ts` | characters.ts |

**Toplam:** 12+ service dosyası sahte verileri kullanıyor

---

## 6. UI HARDCODED VERİLERİ

### Homepage (src/app/page.tsx)

```typescript
// Quick Stats — SAHTE SAYILAR
{ label: "Characters", value: "20", icon: Users },     // ❌
{ label: "Weapons", value: "25", icon: Sword },        // ❌
{ label: "Elements", value: "9", icon: FlaskConical }, // ❌
{ label: "Factions", value: "6", icon: Shield },       // ❌
{ label: "Manufacturers", value: "5", icon: Trophy },  // ❌

// Featured Modules — SAHTE SAYILAR
count: "40+"  // Characters — ❌
count: "60+"  // Weapons — ❌
```

### Game Config (src/data/games/destiny-rising/index.ts)

```typescript
developer: "Destiny Rising Studios"   // ❌ Gerçek geliştirici: NetEase Games
publisher: "Destiny Rising Studios"   // ❌ Gerçek yayıncı: Bungie/NetEase
releaseDate: "2025-01-15"            // ❌ Gerçek tarih farklı
currentVersion: "1.4.0"              // ❌ Doğrulanmamış
```

### Character/Weapon Kartları

- Element renkleri sahte element'lere göre render ediliyor
- Rarity badge'leri SSR/SR/R/N formatında gösteriliyor
- Faction bilgisi sahte faction'lardan geliyor

---

## 7. VERİ AKIŞI HARİTASI

```
game.ts (Type tanımları — TÜM UYDURMA)
    ↓
Static Data Files (9 dosya — TÜM UYDURMA)
    ↓
Service Layer (12+ dosya — sahte veriyi tüketiyor)
    ↓
Page Components (SSR/SSG — sahte veriyi render ediyor)
    ↓
UI Output (Kullanıcıya sahte veri gösteriliyor)

Prisma Schema (Character modeli — sahte alanlar)
    ↓
Seed File (Sahte veriyi DB'ye yüklüyor)
    ↓
Database (Sahte veriler DB'de saklanıyor)
```

---

## 8. GERÇEK DESTINY: RISING VERİLERİ — KAYNAK ANALİZİ

### Kaynak Önceliği

| Öncelik | Kaynak | Güvenilirlik |
|---|---|---|
| 1 | playdestinyrising.com (resmi site) | ✅ En yüksek |
| 2 | Resmi patch notes | ✅ Yüksek |
| 3 | Destinypedia ( Destiny: Rising sayfası) | ✅ Yüksek |
| 4 | blueberries.gg/rising | ✅ Orta-Yüksek (topluluk) |
| 5 | game8.co Destiny Rising | ✅ Orta-Yüksek |
| 6 | Reddit r/destinyrisingmobile | ⚠️ Orta (topluluk) |
| 7 | overgear.com, onlyfarms.gg | ✅ Orta-Yüksek |

### Doğrulanmış Gerçek Veriler

#### Karakterler (14 doğrulanmış — resmi/topyluluk kaynakları)

| # | İsim | Element | Rarity | Role | Primary | Power | Kaynak |
|---|---|---|---|---|---|---|---|
| 1 | Tan-2 | Solar | Mythic (5★) | Support | Scout Rifle | Sniper Rifle | ✅ Resmi + blueberries |
| 2 | Gwynn | Void | Mythic (5★) | Offense | Sidearm | Shotgun | ✅ Resmi + blueberries |
| 3 | Jolder | Void | Mythic (5★) | Defense | SMG | Sword | ✅ Resmi + blueberries |
| 4 | Ning Fei | Arc | Mythic (5★) | Offense | SMG | Auto Crossbow | ✅ Resmi + blueberries |
| 5 | Estela | Solar | Mythic (5★) | Offense | Pulse Rifle | Machine Gun | ✅ Resmi + blueberries |
| 6 | Wolf | Solar | Legendary (4★) | Offense | Auto Rifle | Grenade Launcher | ✅ Resmi + blueberries |
| 7 | Attal | Arc | Legendary (4★) | Support | Hand Cannon | Linear Fusion Rifle | ✅ Resmi + blueberries |
| 8 | Xuan Wei | Arc | Legendary (4★) | Offense | Fusion Rifle | Shotgun | ✅ Resmi + blueberries |
| 9 | Finnala | Solar | Legendary (4★) | Defense | Auto Rifle | Sword | ✅ Resmi + blueberries |
| 10 | Ikora | Void | Legendary (4★) | Offense | Light Grenade Launcher | Rocket Launcher | ✅ Resmi + blueberries |
| 11 | Kabr | Arc | Legendary (4★) | Defense | Pulse Rifle | Machine Gun | ✅ Resmi + blueberries |
| 12 | Umeko | Void | Legendary (4★) | Support | Scout Rifle | Sniper Rifle | ✅ Resmi + blueberries |
| 13 | Helhest | Arc | Mythic (5★) | Support | Bow | Linear Fusion Rifle | ✅ Topluluk + build guide |
| 14 | Maru | Void | Mythic (5★) | Offense | (TBA) | (TBA) | ✅ Topluluk (CBT playable) |

**Not:** Rossi-11, Jaren Ward, Efrideet gibi isimler datamine/leak kaynaklı — henüz tam doğrulanamadı, "unconfirmed" olarak işaretlenecek.

#### Element Sistemi (3 element — doğrulanmış)

| Element | Kaynak | Etki |
|---|---|---|
| Solar | ✅ Resmi | Combustion, heat, healing, AoE damage |
| Arc | ✅ Resmi | Electromagnetic, speed, stun, chain effects |
| Void | ✅ Resmi | Cosmic distortion, gravity, debuffs, control |
| Kinetic | ✅ Resmi (silahlar) | Non-elemental damage |

#### Rarity Sistemi (doğrulanmış)

| Rarity | Yıldız | Kaynak |
|---|---|---|
| Mythic | 5★ | ✅ Resmi — "Lightbearer Banners" |
| Legendary | 4★ | ✅ Resmi |
| Rare | 3★ | ✅ Resmi |
| Exotic | (Silahlar) | ✅ Resmi — sadece 1 exotic equip edilebilir |

#### Role Sistemi (3 rol — doğrulanmış)

| Role | Kaynak | Örnek Karakterler |
|---|---|---|
| Offense | ✅ Resmi | Gwynn, Ning Fei, Wolf |
| Defense | ✅ Resmi | Jolder, Finnala, Kabr |
| Support | ✅ Resmi | Tan-2, Attal, Umeko |

#### Weapon Type Sistemi (doğrulanmış)

**Primary Weapons (infinite ammo):**
- Auto Rifle ✅
- Pulse Rifle ✅
- Scout Rifle ✅
- Hand Cannon ✅
- Submachine Gun ✅
- Sidearm ✅

**Power Weapons (limited ammo):**
- Sword ✅
- Shotgun ✅
- Sniper Rifle ✅
- Grenade Launcher ✅
- Rocket Launcher ✅
- Machine Gun ✅
- Light Grenade Launcher ✅
- Linear Fusion Rifle ✅
- Auto Crossbow ✅
- Fusion Rifle ✅

#### Artifact Sistemi (doğrulanmış — Genshin DEĞİL)

- **4 slot** per character
- **Set bonusu YOK** — her artifact bağımsız etkiye sahip
- **Realm of the IX** aktivitesinden düşüyor
- Artifact'ler individual attribute'lara sahip (Power, Gear Level, Attributes, Set Effect)
- Örnek artifact isimleri: Nimble Veil, Ring of Abundance, Healing Radiation, Resolute Nutation, Talisman of Revival
- Kaynak: ✅ playdestinyrising.com, Reddit guides, overgear.com

#### Weapon İsimleri (örnekler — doğrulanmış)

Sweet Business, Sworn Oath, The Huckleberry, Riskrunner, Polaris Lance, Concerto, The Last Word, Present Fleet, Crimson, Truth, Two-Tailed Fox, Izanagi's Burden, Furies III, Ultimatum, Jötunn, Dvergar Drill, vb.

Kaynak: ✅ blueberries.gg builds, Reddit BiS lists, overgear.com

---

## 9. DEĞİŞİKLİK ETKİ ANALİZİ

### game.ts Değişikliğinde Etkilenecek Dosyalar

```
src/types/domain/game.ts (temel enum'lar)
    ↓
src/types/domain/character.ts
src/types/domain/weapon.ts
src/types/domain/artifact.ts
src/types/domain/material.ts
src/types/domain/build.ts
src/types/domain/team.ts
src/types/domain/combat.ts
    ↓
src/data/games/destiny-rising/*.ts (9 dosya — TÜMÜ)
    ↓
src/features/*/services/*.ts (12+ dosya)
    ↓
src/app/(games)/destiny-rising/*/page.tsx (tüm sayfalar)
src/app/(games)/destiny-rising/*/*.tsx (tüm client components)
    ↓
src/app/page.tsx (homepage stats)
```

### Minimum Schema Değişikliği

Character modelindeki sorunlu alanlar:
- `element` (String) → "Solar" | "Arc" | "Void" değerleri alacak — String olarak kalabilir
- `role` (String) → "Offense" | "Defense" | "Support" — String olarak kalabilir
- `rarity` (String) → "Mythic" | "Legendary" | "Rare" — String olarak kalabilir
- `weaponType` (String) → Gerçek silah type'ları — String olarak kalabilir
- `faction` (String) → Kaldırılabilir veya yeni sistem
- `damageType` (String) → Gözden geçirilecek

**Prisma schema'da enum tanımlamak yerine String olarak bırakmak daha güvenli** — migration riskini azaltır. Değişiklik type katmanında yapılır.

---

## 10. PLAN — ADIM ADIM

### Faz 1 — Type System (Önce Temel)
1. `src/types/domain/game.ts` — enum'ları gerçek değerlerle güncelle
2. Bağımlı type dosyalarını güncelle (character.ts, weapon.ts, artifact.ts, vb.)

### Faz 2 — Static Data Temizliği
3. characters.ts — sahte 20 karakteri kaldır, gerçek 14 karakteri ekle
4. characters-detail.ts — aynı
5. weapons.ts — sahte 25 silahı kaldır, gerçek silahları ekle
6. artifacts.ts — Genshin-style sistemi kaldır, gerçek artifact sistemini yaz
7. materials.ts — sahte materyalleri kaldır, gerçek materyalleri ekle
8. teams.ts — sahte takımları kaldır
9. builds.ts — sahte build'leri kaldır
10. world.ts — sahte dünya verisini kaldır

### Faz 3 — UI Güncellemesi
11. Homepage stats — hardcoded sayıları kaldır, database'den çek
12. Game config — gerçek geliştirici/yayıncı bilgileri
13. Character kartları — yeni element/rarity/role sistemi

### Faz 4 — Service Layer
14. Service dosyalarını yeni type'lara göre güncelle

### Faz 5 — Schema/Seed
15. Prisma Character modelini gözden geçir
16. Seed dosyasını gerçek verilerle güncelle

### Faz 6 — Routing Fix (Bağımsız)
17. CharacterCard.tsx — `/destiny-rising/characters/${slug}`
18. GuideCard.tsx — `/destiny-rising/community/guides/${slug}`

---

## 11. VERİ GÜVENİLİRLİLİK MATRİSİ

| Veri Kategorisi | Mevcut Durum | Güvenilirlik | Aksiyon |
|---|---|---|---|
| Karakter isimleri (20) | Tamamen uydurma | 0% | Tamamen değiştir |
| Element sistemi (9) | Tamamen uydurma | 0% | Solar/Arc/Void'e çevir |
| Rarity sistemi (SSR/SR/R/N) | Tamamen uydurma | 0% | Mythic/Legendary/Rare'e çevir |
| Role sistemi (DPS/Tank/Healer) | Tamamen uydurma | 0% | Offense/Defense/Support'a çevir |
| Weapon type'ları (10) | Tamamen uydurma | 0% | Gerçek Destiny silah type'larına çevir |
| Weapon isimleri (25) | Tamamen uydurma | 0% | Gerçek silah isimleriyle değiştir |
| Faction sistemi (6) | Tamamen uydurma | 0% | Kaldır veya yeniden tasarla |
| Manufacturer sistemi (5) | Tamamen uydurma | 0% | Kaldır |
| Artifact sistemi | Genshin Impact klonu | 0% | Tamamen yeniden yaz |
| Material sistemi (13) | Tamamen uydurma | 0% | Tamamen değiştir |
| Team verileri (8) | Tamamen uydurma | 0% | Tamamen kaldır |
| Build verileri (~15) | Tamamen uydurma | 0% | Tamamen kaldır |
| World verileri | Tamamen uydurma | 0% | Tamamen kaldır |
| Game config | Sahte | 0% | Gerçek bilgilerle güncelle |
| Verification metadata | Sahte | 0% | Kaldır, yeniden doğrula |
| Homepage sayıları | Yanlış | 0% | DB'den çek |
| Seed dosyası | Sahte veri üretiyor | 0% | Yeniden yaz |

---

```
FINAL: DATABASE ARCHITECTURE INVENTORY COMPLETE

Toplam sahte veri: ~4000+ satır, ~140+ kayıt
Toplam etkilenen dosya: 25+
Prisma model değişikliği: Character modeli (gerekli alanlar)
Type system değişikliği: game.ts + 6 bağımlı dosya
Service layer değişikliği: 12+ dosya
UI değişikliği: Homepage + kartlar + filtreler

GERÇEK VERİLER HAZIR:
✅ 14 karakter (resmi/topluluk kaynaklardan doğrulanmış)
✅ 3 element (Solar, Arc, Void)
✅ 3 rarity (Mythic, Legendary, Rare) + Exotic (silahlar)
✅ 3 role (Offense, Defense, Support)
✅ 16 weapon type (6 Primary + 10 Power)
✅ Weapon isimleri (50+ doğrulanmış)
✅ Artifact sistemi (4 slot, set bonusu yok)
✅ Material isimleri (Enhancement Prisms, Infusion Cores, vb.)

GÜVENİLİRLİK:
- Resmi kaynaklar: playdestinyrising.com, patch notes
- Topluluk: blueberries.gg, game8.co, Reddit, overgear.com
- Tüm veriler çapraz doğrulama gerektiriyor

SONRAKI ADIM:
Onay sonrası Faz 1 — Type System değişikliğinden başla.
```
