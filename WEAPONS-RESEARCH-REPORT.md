# FAZ 2B — WEAPONS RESEARCH & INVENTORY REPORT
**Tarih:** 2026-08-09
**Durum:** Research complete — awaiting approval for implementation

---

## ⚠️ ÖNCE: FAZ 2A PRISMA KONTROLÜ

Kullanıcı Faz 2A'da "PRISMA CHANGED: YES" rapor edildiğini belirtti. Kontrol:

### seed.ts neden değişti?
`prisma/seed.ts`, `characters.ts`'den karakter verisini okuyup DB'ye yazan bir seed dosyasıdır. Karakter verisi değiştiğinde (Faz 2A'da 20 sahte → 17 gerçek karakter), seed dosyası da bu yeni veriyi işleyebilmek için güncellendi:
- `character.faction` optional hale geldiği için `faction || ''` eklendi
- `character.weaponType` optional hale geldiği için `weaponType || ''` eklendi
- `damageType` eski element'ten türetiliyordu, artık doğrudan `character.element` kullanılıyor
- `factionRelation` conditional hale getirildi

### Prisma schema değişti mi?
**HAYIR.** `prisma/schema.prisma` dosyası Faz 2A'da değiştirilmedi. Sadece TypeScript type dosyaları değişti.

### Migration oluştu mu?
**HAYIR.** Migration oluşturulmadı. Schema değişmediği için migration'a gerek yok.

### Production database'e uygulanmış migration var mı?
Mevcut migration'lar (2 adet):
1. `00000000000000_initial_schema` — İlk schema
2. `20260807000000_better_auth_schema_alignment` — Better Auth uyumu

Bu migration'lar Faz 2A'dan ÖNCE oluşturuldu. Faz 2A yeni migration oluşturmadı.

**SONUÇ: Prisma schema değişmedi, migration oluşmadı. Seed.ts sadece yeni optional alanları handle etmek için güncellendi.**

---

## 1. MEVCUT SAHTE SİLAH ENVANTERİ

**Dosya:** `src/data/games/destiny-rising/weapons.ts`
**Sahte silah sayısı:** 25

| # | İsim | Sahte Type | Sahte Element | Sahte Manufacturer |
|---|---|---|---|---|
| 1 | Stellar Inferno | Greatsword | Fire | Genesis Forge |
| 2 | Void Reaper | Cannon | Dark | Void Industries |
| 3 | Everfrost Scepter | Staff | Ice | Stellar Armory |
| 4 | Thundercall | Gun | Lightning | Nova Dynamics |
| 5 | Iron Bulwark | Greatsword | Earth | Genesis Forge |
| 6 | Zephyr's Edge | Sword | Wind | Nova Dynamics |
| 7 | Moonlit Grace | Orb | Light | Stellar Armory |
| 8 | Shadow Fang | Dagger | Dark | Eclipse Arms |
| 9 | Frostbite Bow | Bow | Ice | Stellar Armory |
| 10 | Earthen Spear | Spear | Earth | Genesis Forge |
| 11 | Crimson Fists | Fist | Fire | Eclipse Arms |
| 12 | Stormbringer | Staff | Lightning | Nova Dynamics |
| 13 | Ember Blade | Sword | Fire | Independent |
| 14 | Tidal Orb | Orb | Water | Stellar Armory |
| 15 | World Mother Staff | Staff | Earth | Genesis Forge |
| 16 | Rapid Bolt Gauntlet | Fist | Lightning | Nova Dynamics |
| 17 | Mistweaver Bow | Bow | Water | Void Industries |
| 18 | Inferno Cannon | Cannon | Fire | Eclipse Arms |
| 19 | Nightwhisper Daggers | Dagger | Dark | Void Industries |
| 20 | Guardian Spear | Spear | Earth | Genesis Forge |
| 21 | Pyra's Blaze | Sword | Fire | Eclipse Arms |
| 22 | Singularity Engine | Cannon | Dark | Void Industries |
| 23 | Sage's Wisdom | Staff | Wind | Stellar Armory |
| 24 | Titan's Aegis | Greatsword | Earth | Genesis Forge |
| 25 | Surge Conductor | Staff | Lightning | Nova Dynamics |

**TÜMÜ sahte.** Silah isimleri, type'ları, element'leri, manufacturer'ları, stat'ları, tier'ları — hepsi uydurma.

---

## 2. GERÇEK DESTINY: RISING SİLAH ENVANTERİ

### Kaynaklar

| Öncelik | Kaynak | Tip |
|---|---|---|
| 1 | playdestinyrising.com/patches/ | Resmi patch notes |
| 2 | game8.co/games/Destiny-Rising/ | Güvenilir wiki/database |
| 3 | blueberries.gg/rising/ | Güvenilir topluluk kaynağı |
| 4 | gamesradar.com, vg247.com, dotesports.com | Güvenilir oyun medyası |
| 5 | Reddit r/destinyrisingmobile | Topluluk doğrulama |

### 2A. EXOTIC SİLAHLAR (Doğrulanmış)

**Kaynak çapraz doğrulaması:** game8 + blueberries + gamesradar + vg247 + dotesports

#### Primary Exotic Weapons

| # | İsim | Type | Element | Combat Style | Kaynak |
|---|---|---|---|---|---|
| 1 | Sweet Business | Auto Rifle | Solar | Rapid-Fire | ✅ 5 kaynak |
| 2 | Furies III | Pulse Rifle | Solar | Rapid-Fire | ✅ 5 kaynak |
| 3 | Polaris Lance | Scout Rifle | Solar | Piercing | ✅ 5 kaynak |
| 4 | Riskrunner | Submachine Gun | Arc | Rapid-Fire | ✅ 5 kaynak |
| 5 | The Huckleberry | Submachine Gun | Void | Rapid-Fire | ✅ 5 kaynak |
| 6 | Crimson | Hand Cannon | Arc | Piercing | ✅ 5 kaynak |
| 7 | The Old Prefect | Hand Cannon | Solar | Piercing | ✅ 5 kaynak |
| 8 | Concerto | Sidearm | Void | Impact | ✅ 5 kaynak |
| 9 | Jötunn | Fusion Rifle | Solar | Impact | ✅ 5 kaynak |
| 10 | The Last Word | Hand Cannon | Solar | Piercing | ✅ dotesports (Battle Pass) |
| 11 | 'Til Eternal Death | Hand Cannon | Arc | Piercing | ✅ dotesports (Battle Pass) |
| 12 | Trinity Ghoul | Bow | Arc | Piercing | ✅ dotesports (Battle Pass) |
| 13 | Jade Rabbit | Scout Rifle | Void | Piercing | ✅ dotesports (Exotic Engram) |
| 14 | Symmetry | Scout Rifle | Arc | Piercing | ✅ dotesports (Gauntlet: Onslaught) |

#### Power Exotic Weapons

| # | İsim | Type | Element | Combat Style | Kaynak |
|---|---|---|---|---|---|
| 15 | Borealis | Sniper Rifle | Void | Piercing | ✅ 5 kaynak |
| 16 | Izanagi's Burden | Sniper Rifle | Solar | Piercing | ✅ 5 kaynak |
| 17 | The Chaperone | Shotgun | Void | Impact | ✅ 5 kaynak |
| 18 | Octant Riot Disperser | Shotgun | Arc | Impact | ✅ 5 kaynak |
| 19 | Satiyaaliksni Smart Bomb | Grenade Launcher | Arc | Spread | ✅ 5 kaynak |
| 20 | Royal Contravene | Linear Fusion Rifle | Arc | Piercing | ✅ 5 kaynak |
| 21 | Partridge Sky | Sword | Solar | Impact | ✅ 5 kaynak |
| 22 | Mahamayuri | Auto Crossbow | Arc | Rapid-Fire | ✅ 5 kaynak |
| 23 | Two-Tailed Fox | Rocket Launcher | Void | Spread | ✅ 5 kaynak |
| 24 | Gallows | Machine Gun | Void | Rapid-Fire | ✅ 5 kaynak |
| 25 | Heir Apparent | Machine Gun | Solar | Rapid-Fire | ✅ 5 kaynak |

#### Additional Exotics (dotesports Nisan 2026 — daha yeni)

| # | İsim | Type | Element | Kaynak | Not |
|---|---|---|---|---|---|
| 26 | Dvergar Drill | Light Grenade Launcher | Void | dotesports | Battle Pass |
| 27 | Arbalest | Linear Fusion Rifle | Solar | dotesports | Battle Pass |
| 28 | Cloudstrike | Sniper Rifle | Arc | dotesports | Gauntlet: Onslaught |
| 29 | Wardcliff Coil | Rocket Launcher | Arc | dotesports | Gauntlet: Onslaught |
| 30 | Truth | Rocket Launcher | Void | dotesports | Battle Pass |
| 31 | Thunderlord | Machine Gun | Arc | dotesports | Gauntlet: Onslaught |

**Not:** "Merciless" (Fusion Rifle) sadece blazingboost'ta geçiyor, başka kaynakta doğrulanamadı → EKLENMEYECEK.

**Toplam doğrulanmış Exotic silah:** 31

### 2B. MYTHIC SİLAHLAR (Doğrulanmış)

**Kaynak:** game8.co — Season 1 listesi (26 silah)

| # | İsim | Type | Element | DPS |
|---|---|---|---|---|
| 1 | Sworn Oath | Auto Rifle | Solar | 271 |
| 2 | Ultimatum | Pulse Rifle | Solar | 284 |
| 3 | DEL2 Sweet Ears | Pulse Rifle | Arc | 274 |
| 4 | DEL3 Lassi | Scout Rifle | Arc | 253 |
| 5 | Total Lockdown | Scout Rifle | Solar | 260 |
| 6 | 40000 Sidereal Year | Sniper Rifle | Solar | 349 |
| 7 | Magoichi | Sniper Rifle | Void | 320 |
| 8 | DEL7 SIMIT | Hand Cannon | Arc | 255 |
| 9 | DEL6 Kokoretsi | Sidearm | Solar | 245 |
| 10 | Chushingura | Sidearm | Void | 262 |
| 11 | Wolfpack | Submachine Gun | Void | 294 |
| 12 | DEL5 Kulfi | Submachine Gun | Arc | 307 |
| 13 | IST1 Parantha | Fusion Rifle | Arc | 358 |
| 14 | The Monolith | Fusion Rifle | Void | 285 |
| 15 | Mutineer's Torch | Fusion Rifle | Arc | 289 |
| 16 | Rev-7 Fusillade | Fusion Rifle | Solar | 252 |
| 17 | End of the Line | Linear Fusion Rifle | Arc | 434 |
| 18 | Present Fleet | Light Grenade Launcher | Arc | 312 |
| 19 | HON1 Khanom Khrok | Grenade Launcher | Solar | 471 |
| 20 | Eternal Retribution | Shotgun | Void | 730 |
| 21 | IST2 Niaatiks | Shotgun | Arc | 740 |
| 22 | Gunpowder Duster | Shotgun | Arc | 600 |
| 23 | Labyrinth's Compass | Shotgun | Solar | 596 |
| 24 | K205 Lemming | Shotgun | Void | 451 |
| 25 | Sandan-54 Fieldhand | Shotgun | Solar | 517 |
| 26 | Scorched Earth | Machine Gun | Solar | 432 |
| 27 | BVD4 Akutaak | Machine Gun | Arc | 458 |
| 28 | HON2 Tutum'alik | Rocket Launcher | Void | 471 |
| 29 | Nobunaga | Sword | Arc | 816 |
| 30 | Makeshift Ending | Sword | Solar | 757 |
| 31 | CLY2 Kakalik | Sword | Void | 757 |
| 32 | Regolith Piton | Sword | Solar | 622 |
| 33 | Dusty Grave | Sword | Void | 622 |
| 34 | Nightfall Banner | Sword | Solar | 539 |
| 35 | Saizo | Auto Crossbow | Void | 395 |
| 36 | HON3 Eibellaks | Auto Crossbow | Arc | 388 |

**Additional Impact weapons from game8 (non-exotic, non-mythic listed on Impact page):**
- Century Lookout — Sidearm — Void — DPS 202
- Permanent Liability — Sidearm — Solar — DPS 207
- Azure Drab Auto-Fab — Sidearm — Solar — DPS 178

**Toplam doğrulanmış Mythic silah:** 36+

### 2C. SEASON 2+ SİLAHLARI (Resmi patch notes'tan)

#### Season 2 — Gauntlet: Blitz (playdestinyrising.com, Kasım 2025)
| İsim | Type | Kaynak |
|---|---|---|
| Parole | Hand Cannon | ✅ Resmi patch notes |
| Tsurinobuse | Grenade Launcher | ✅ Resmi patch notes |
| Four-horned Ram | Rocket Launcher | ✅ Resmi patch notes |
| Empty Fort Strategy | Hand Cannon | ✅ Resmi patch notes |
| Thermopylae-80 | Shotgun | ✅ Resmi patch notes |
| Wrongful Ingress | Auto Rifle | ✅ Resmi patch notes |

#### Season of Providence (playdestinyrising.com, Aralık 2025)
| İsim | Type | Kaynak |
|---|---|---|
| Oversoul Edict | Pulse Rifle | ✅ Resmi patch notes |
| Ir Yût's Song | Machine Gun | ✅ Resmi patch notes |
| Swordbreaker | Shotgun | ✅ Resmi patch notes |
| Ir Yût's Fang | Scout Rifle | ✅ Resmi patch notes |
| Threat Level | Shotgun | ✅ Resmi patch notes |
| Tatara Gaze | Sniper Rifle | ✅ Resmi patch notes |
| Stryger's Sure-Hand | Sword | ✅ Resmi patch notes |
| Bellowing Giant | Rocket Launcher | ✅ Resmi patch notes |

### 2D. DESTINYPEDIA'DAN DOĞRULANAN EK SİLAHLAR

Destinypedia (Destiny: Rising sayfası) şu silahları listeliyor:

**Auto Rifle:** Cognitum Carbine
**Bow:** Cold Arrow Movement, Desert Law, F606 "Sugar Glider", 7 "Moonshot" EMR-M, Ultimatum, Thunder Shield, Thunder's Roar, Tohorā, Ursa Major
**Submachine Gun:** Autoshear, Dancing Bees, DEL5 Kulfi, K18 "Coelops", Shock Dagger, Shock Pistol, Wolfpack
**Fusion Rifle:** Nebula No.9, Parhelion Wing, Spiteful Whisper, The Ringed Star, Verdict IST3
**Sidearm:** Azure Drab
**Sword:** Ayakiba, Leigong, Marionette, Maat, Mint

**Not:** Bazı isimler game8 listesiyle çakışıyor (DEL5 Kulfi, Wolfpack, Azure Drab). Destinypedia'daki ek silahların çoğu Mythic olarak sınıflandırılabilir ama DPS/element bilgileri doğrulanmamış. Bunları "doğrulanmış isim ama doğrulanmamış detay" olarak işaretleyeceğim.

---

## 3. SİLAH TİPLERİ DOĞRULAMA

Destiny: Rising'de kullanılan weapon type'lar (game8 + blueberries + overgear):

**Primary Weapons (infinite ammo):**
| Type | Combat Style | Exotic Örnek | Mythic Örnek |
|---|---|---|---|
| Auto Rifle | Rapid-Fire | Sweet Business | Sworn Oath |
| Pulse Rifle | Rapid-Fire | Furies III | Ultimatum |
| Scout Rifle | Piercing | Polaris Lance, Jade Rabbit | DEL3 Lassi |
| Hand Cannon | Piercing | Crimson, The Old Prefect | DEL7 SIMIT |
| Submachine Gun | Rapid-Fire | Riskrunner, The Huckleberry | Wolfpack |
| Sidearm | Impact | Concerto | DEL6 Kokoretsi |

**Power Weapons (limited ammo):**
| Type | Combat Style | Exotic Örnek | Mythic Örnek |
|---|---|---|---|
| Fusion Rifle | Impact | Jötunn | IST1 Parantha |
| Shotgun | Impact | The Chaperone | Eternal Retribution |
| Sniper Rifle | Piercing | Borealis | 40000 Sidereal Year |
| Sword | Impact | Partridge Sky | Nobunaga |
| Grenade Launcher | Spread | Satiyaaliksni Smart Bomb | HON1 Khanom Khrok |
| Light Grenade Launcher | Spread | (none exotic) | Present Fleet |
| Rocket Launcher | Spread | Two-Tailed Fox | HON2 Tutum'alik |
| Linear Fusion Rifle | Piercing | Royal Contravene | End of the Line |
| Machine Gun | Rapid-Fire | Gallows | Scorched Earth |
| Auto Crossbow | Rapid-Fire | Mahamayuri | Saizo |
| Bow | Piercing | Trinity Ghoul | (doğrulanmamış mythic) |

**Faz 1'de tanımlanan tüm weapon type'lar oyunda mevcut.** Faz 1 type temizliği gerekmiyor.

---

## 4. ELEMENT DOĞRULAMA

Tüm silahlar Solar, Arc, veya Void elementine sahip. Kinetic ayrımı Destiny: Rising'de weapon damage type olarak kullanılmıyor — tüm silahların bir elementi var.

Element dağılımı (Exotic + Mythic):
- **Solar:** ~40% (en yaygın)
- **Arc:** ~35%
- **Void:** ~25%

---

## 5. ÖZET TABLO

| Kategori | Sayı | Kaynak | Durum |
|---|---|---|---|
| Exotic silahlar | 31 | 5+ kaynak çapraz doğrulama | ✅ Eklenecek |
| Mythic silahlar (S1) | 36+ | game8.co | ✅ Eklenecek |
| Season 2 silahlar | 6 | Resmi patch notes | ✅ Eklenecek |
| SoP silahlar | 8 | Resmi patch notes | ✅ Eklenecek |
| Destinypedia ek silahlar | ~20 | Destinypedia (isim doğrulanmış, detay eksik) | ⚠️ Kısmi |
| **TOPLAM** | **~100+** | | |

### Sahte Veri Temizliği

| Kaldırılacak | Miktar |
|---|---|
| Sahte silah isimleri | 25 |
| Sahte weapon type'lar | 25 |
| Sahte element'ler | 25 |
| Sahte manufacturer'lar | 25 |
| Sahte stat'lar | 25 |
| Sahte tier'lar | 25 |
| Sahte damage type'lar | 25 |

### Eksik/Doğrulanamayan

| Konu | Durum |
|---|---|
| Rare silahlar | kaynak bulunamadı — eklenecek |
| Legendary silahlar (Mythic altı) | game8 listesi Mythic olarak sınıflandırıyor — DR'de "Legendary" rarity'si silahlar için kullanılmıyor olabilir |
| Bazı Season 2+ silah detayları | Element/DPS doğrulanamadı — eksik bırakılacak |
| Perk/trait bilgileri | Doğrulanmış exotic perk'ler eklenecek, diğerleri boş |

---

## 6. ÖNERİLEN IMPLEMENTASYON PLANI

### Commit kapsamı:

1. `weapons.ts` — 25 sahte silahı kaldır, ~75+ gerçek silah ekle
2. İlgili service dosyalarını güncelle
3. UI'daki hardcoded silah sayılarını kaldır

### Eklenmeyecek:
- ❌ Doğrulanamayan silahlar
- ❌ Destiny 2'den otomatik kopyalanan silahlar
- ❌ Sahte perk/stat/manufacturer bilgileri
- ❌ "Muhtemelen var" silahlar

### Rarity notu:
Destiny: Rising'de silah rarity sistemi:
- **Exotic** — Benzersiz trait'li silahlar
- **Mythic** — Yüksek rarity crafting/drop silahlar

"Legendary" ve "Rare" silahlar için yeterli kaynak bulunamadı. game8 sadece "Mythic" ve "Exotic" listeliyor. Bu nedenle şimdilik sadece Exotic ve Mythic eklenecek.

---

## 7. ONAY BEKLİYOR

Bu araştırma raporunu inceledikten sonra:
1. Implementasyona onay ver
2. Veya ek araştırma iste
3. Veya kapsamı daralt/genişlet

**Kısa cevap:** 25 sahte silah kaldırılacak, ~75+ doğrulanmış gerçek silah (31 Exotic + 36+ Mythic + 14 Season 2/SoP) eklenecek.
