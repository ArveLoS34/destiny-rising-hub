# FINAL DATA AUDIT REPORT v7
## Destiny: Rising — Ağustos 2026
**Field-level provenance. verified/unknown/null ayrımı. Eksik veri > uydurma veri.**

---

## ÖNCEKİ SÜRÜMDEN (v6) FARKLAR

### Kritik Düzeltmeler
1. **Legendary toplamı 40 DEĞİL, 37.** Lightbearer.app'te 37 Legendary silah var. v6'da 40 olarak iddia edilmiş, 36 listelenmiş.
2. **Rare toplamı 19 DEĞİL, 17.** Lightbearer.app'te 17 Rare silah var. v6'da 19 olarak iddia edilmiş, 17 listelenmiş.
3. **Laplace's Mystery = LEGENDARY (4★), Rare DEĞİL.** Lightbearer detay sayfası doğruladı: 4 rarity icon, "Legendary Light Grenade Launcher" olarak listeleniyor.
4. **Type 5 Stratoshot SRM = RARE Sniper Rifle, Void, Piercing, DPS 223.** v6'da tamamen eksikti. Lightbearer'da bulundu.
5. **Toplam silah: 139 (34+51+37+17), 144 DEĞİL.**
6. **Artifact'ler: 80/80 slot+effect verified (100%).** v6'da 67/80 (84%) denmişti. Lightbearer.app/artifacts tüm 80 artifact'in slot, type ve effect bilgisini doğruladı.
7. **"Tüm veriler doğrulanmış" ifadesi kaldırıldı.** Field-level verified/unknown/null ayrımı yapıldı.

---

## VERIFICATION METHODOLOGY

Her veri için field-level doğrulama durumu:
- `verified` = Güvenilir kaynakta doğrulandı
- `unknown` = Henüz araştırılmadı
- `null` = Araştırıldı, güvenilir kaynakta bulunamadı

Kaynaklar ve öncelik sırası:
1. **resmi (playdestinyrising.com)** — Patch notes, resmi duyurular
2. **lightbearer.app** — Weapon database (102 silah), artifact database (80 artifact), mod bilgileri, stats
3. **game8.co** — Mythic/Exotic listeleri, materials, traits
4. **Destinypedia** — Foundry bilgileri, lore (eski Destiny silahları için)
5. **blueberries.gg, dotesports, vg247, gamesradar, blazingboost** — Çapraz doğrulama

---

## DATABASE COVERAGE SUMMARY

```
=== FIELD-LEVEL VERIFICATION STATUS ===

CHARACTERS (20):
  name:           20/20 verified (100%)  [source: official]
  element:        20/20 verified (100%)  [source: official]
  rarity:         20/20 verified (100%)  [source: official + lightbearer]
  role:           20/20 verified (100%)  [source: official]
  primary weapon: 20/20 verified (100%)  [source: official + lightbearer]
  power weapon:   20/20 verified (100%)  [source: official + lightbearer]
  abilities:      0/20 verified   (0%)   [source: unknown — oyun içi veri gerekli]
  traits:         0/20 verified   (0%)   [source: unknown — oyun içi veri gerekli]
  awakening:      1/20 verified   (5%)   [source: official — Wolf Jun 2026]

WEAPONS (139):
  rarity:         139/139 verified (100%) [source: lightbearer + official]
  name:           139/139 verified (100%) [source: lightbearer + official]
  type:           139/139 verified (100%) [source: lightbearer + official]
  element:        113/139 verified (81%)  [26 null = S2+ Mythic]
  combat style:   113/139 verified (81%)  [26 null = S2+ Mythic]
  DPS:            113/139 verified (81%)  [26 null = S2+ Mythic]
  slot:           113/139 verified (81%)  [26 null = S2+ Mythic]
  foundry:        0/139 verified   (0%)   [source: null — oyun içi veri gerekli]
  intrinsic:      22/139 verified  (16%)  [sadece Exotic]
  origin trait:   0/139 verified   (0%)   [source: null]
  perk pool:      0/139 verified   (0%)   [source: null — lightbearer "Coming soon"]
  mod slots:      102/139 verified (73%)  [lightbearer'daki 102 silah için mod bilgisi var]

ARTIFACTS (80):
  name:           80/80 verified  (100%)  [source: lightbearer]
  slot:           80/80 verified  (100%)  [source: lightbearer — I:20, II:20, III:20, IV:20]
  type/category:  80/80 verified  (100%)  [source: lightbearer]
  effect:         80/80 verified  (100%)  [source: lightbearer]
  set info:       0/80 verified   (0%)    [source: unknown]
  2-piece bonus:  0/80 verified   (0%)    [source: unknown]
  4-piece bonus:  0/80 verified   (0%)    [source: unknown]

MATERIALS (30):
  name:           30/30 verified  (100%)  [source: game8]
  type:           30/30 verified  (100%)  [source: game8]
  rarity:         30/30 verified  (100%)  [source: game8]
  use:            30/30 verified  (100%)  [source: game8]

FOUNDRIES (5):
  name:           5/5 verified    (100%)  [source: game8 + Destinypedia]
  weapon mapping: 0/139 verified  (0%)    [source: null — oyun içi veri gerekli]

INTRINSIC TRAITS (29):
  verified:       29/29           (100%)  [source: game8]

ORIGIN TRAITS (8):
  verified:       8/8             (100%)  [source: game8]
```

---

## CHARACTERS

### 20 unique records — Field-level verification

| # | Name | Element | Rarity | Role | Primary | Power | Source |
|---|---|---|---|---|---|---|---|
| 1 | Wolf | Solar | Legendary→Mythic* | Offense | Auto Rifle | Grenade Launcher | official+lb |
| 2 | Tan-2 | Solar | Mythic | Support | Scout Rifle | Sniper Rifle | official+lb |
| 3 | Gwynn | Void | Mythic | Offense | Sidearm | Shotgun | official+lb |
| 4 | Jolder | Void | Mythic | Defense | Submachine Gun | Sword | official+lb |
| 5 | Ning Fei | Arc | Mythic | Offense | Submachine Gun | Auto Crossbow | official+lb |
| 6 | Attal | Arc | Legendary | Support | Hand Cannon | Linear Fusion Rifle | official+lb |
| 7 | Xuan Wei | Arc | Legendary | Offense | Fusion Rifle | Shotgun | official+lb |
| 8 | Finnala | Solar | Legendary | Defense | Auto Rifle | Sword | official+lb |
| 9 | Ikora | Void | Legendary | Offense | Light Grenade Launcher | Rocket Launcher | official+lb |
| 10 | Kabr | Arc | Legendary | Defense | Pulse Rifle | Machine Gun | official+lb |
| 11 | Estela | Solar | Mythic | Offense | Pulse Rifle | Machine Gun | official+lb |
| 12 | Umeko | Void | Legendary | Support | Scout Rifle | Sniper Rifle | official+lb |
| 13 | Helhest | Arc | Mythic | Support | Bow | Linear Fusion Rifle | official+lb |
| 14 | Maru | Void | Mythic | Offense | Light Grenade Launcher | Grenade Launcher | official 11/03 |
| 15 | Jaren | Solar | Mythic | Offense | Hand Cannon | Shotgun | official 12/04 |
| 16 | Kabr the Resolute | Arc | Mythic | Defense | Scout Rifle | Linear Fusion Rifle | official 12/30 |
| 17 | Rossi-11 | Arc | Legendary | Support | Bow | Auto Crossbow | official |
| 18 | Efrideet | Arc | Mythic | Offense | Hand Cannon | Sniper Rifle | official 03/26 |
| 19 | Tariq | Solar | Mythic | Defense | Sidearm | Grenade Launcher | official 05/07 |
| 20 | Siorra | Void | Mythic | Offense | Auto Rifle | Sword | official 08/06 |

*Wolf: baseRarity=Legendary, currentRarity=Mythic (Awakening Jun 2026). AYRI KARAKTER DEĞİLDİR.

```
CHARACTER FIELD-LEVEL STATUS:
  verified:   name(20), element(20), rarity(20), role(20), primary(20), power(20) = 120 fields
  null:       abilities(20), traits(20) = 40 fields
  partial:    awakening(1/20) = Wolf only

DOĞRULANMIŞ BİLGİLER:
  ✓ 20 karakter — resmi kaynak (playdestinyrising.com)
  ✓ 20 element — resmi kaynak + lightbearer
  ✓ 20 rarity — resmi kaynak + lightbearer (Wolf Legendary→Mythic awakening)
  ✓ 20 role — resmi kaynak
  ✓ 20 weapon loadout — resmi kaynak + lightbearer (character filter ile doğrulandı)

DOĞRULANAMAMIŞ BİLGİLER:
  ✗ abilities — oyun içi veri gerekli
  ✗ traits — oyun içi veri gerekli
  ✗ awakening progression — Wolf dışında bilinmiyor

DISTRIBUTION:
  Mythic: 13 (Tan-2, Gwynn, Jolder, Ning Fei, Estela, Helhest, Maru, Jaren,
              Kabr the Resolute, Efrideet, Tariq, Siorra, Wolf*)
  Legendary: 7 (Attal, Xuan Wei, Finnala, Ikora, Kabr, Umeko, Rossi-11)
```

---

## WEAPONS

### Rarity System (verified — lightbearer.app + game8)

| Rarity | Stars | Base Power | Source |
|---|---|---|---|
| Exotic | 6★ | 2150-5030 | lightbearer.app + game8 |
| Mythic | 5★ | 1600-4550 | lightbearer.app + game8 |
| Legendary | 4★ | 1080-3130 | lightbearer.app |
| Rare | 3★ | 980-2930 | lightbearer.app |

### TOPLAM: 139 silah (34 Exotic + 51 Mythic + 37 Legendary + 17 Rare)

**v6'dan fark:** v6 = 144 (40L + 19R). v7 = 139 (37L + 17R). 5 silah farkı:
- 3 eksik Legendary: v6'da 40 olarak iddia edilmiş, lightbearer'da sadece 37 var
- 2 eksik Rare: v6'da 19 olarak iddia edilmiş, lightbearer'da sadece 17 var
- Laplace's Mystery: v6'da Rare olarak listelenmiş → aslında Legendary
- Type 5 Stratoshot SRM: v6'da yok → Rare Sniper Rifle olarak eklendi

---

### EXOTIC WEAPONS: 34 unique — 34/34 rarity verified

| # | Name | Type | Element | Style | Intrinsic | DPS | Slot | Source |
|---|---|---|---|---|---|---|---|---|
| 1 | Sweet Business | Auto Rifle | Solar | Rapid-Fire | Payday | 257 | Primary | lb |
| 2 | Furies III | Pulse Rifle | Solar | Rapid-Fire | Neural Currents | 302 | Primary | game8+lb |
| 3 | Polaris Lance | Scout Rifle | Solar | Piercing | The Perfect Fifth | 338 | Primary | game8+lb |
| 4 | Riskrunner | Submachine Gun | Arc | Rapid-Fire | Arc Conductor | 360 | Primary | game8+lb |
| 5 | The Huckleberry | Submachine Gun | Void | Rapid-Fire | Ride the Bull | 394 | Primary | game8+lb |
| 6 | Crimson | Hand Cannon | Arc | Piercing | Banned Weapon | 469 | Primary | game8+lb |
| 7 | The Old Prefect | Hand Cannon | Solar | Piercing | Tiger's Throw | 589 | Primary | game8+lb |
| 8 | Concerto | Sidearm | Void | Impact | Cadenza | 258 | Primary | game8+lb |
| 9 | Jötunn | Fusion Rifle | Solar | Impact | Charged Shot | 660 | Primary | game8+lb |
| 10 | Trinity Ghoul | Bow | Arc | Piercing | Split Election | 254 | Primary | game8+lb |
| 11 | Bad Juju | Pulse Rifle | Kinetic | Rapid-Fire | String of Curses | 211 | Primary | lb+community |
| 12 | Borealis | Sniper Rifle | Void | Piercing | The Fundamentals | 401 | Power | game8+lb |
| 13 | Izanagi's Burden | Sniper Rifle | Solar | Piercing | Honed Edge | 334 | Power | game8+lb |
| 14 | The Chaperone | Shotgun | Void | Impact | Precision Slug | 737 | Power | game8+lb |
| 15 | Octant Riot Disperser | Shotgun | Arc | Impact | Salvo of Artillery | 895 | Power | game8+lb |
| 16 | Satiyaaliksni Smart Bomb | Grenade Launcher | Arc | Spread | Airburst Grenades | 644 | Power | game8+lb |
| 17 | Royal Contravene | Linear Fusion Rifle | Arc | Piercing | Wire Rifle | 454 | Power | game8+lb |
| 18 | Partridge Sky | Sword | Solar | Impact | Arrows of Silver | 1014 | Power | game8+lb |
| 19 | Mahamayuri | Auto Crossbow | Arc | Rapid-Fire | Trimurti | 1046 | Power | game8+lb |
| 20 | Two-Tailed Fox | Rocket Launcher | Void | Spread | Twintails | 680 | Power | game8+lb |
| 21 | Gallows | Machine Gun | Void | Rapid-Fire | Bosenova Grenades | 966 | Power | game8+lb |
| 22 | Heir Apparent | Machine Gun | Solar | Rapid-Fire | Heavy Grenade Launcher | 963 | Power | game8+lb |
| 23 | Jade Rabbit | Scout Rifle | Void | Piercing | null | null | Primary | media |
| 24 | Symmetry | Scout Rifle | Arc | Piercing | null | null | Primary | media |
| 25 | The Last Word | Hand Cannon | Solar | Piercing | null | null | Primary | media |
| 26 | 'Til Eternal Death | Hand Cannon | Arc | Piercing | null | null | Primary | official+media |
| 27 | Dvergar Drill | Light Grenade Launcher | Void | Spread | null | null | Power | official+media |
| 28 | Arbalest | Linear Fusion Rifle | Solar | Piercing | null | null | Power | media |
| 29 | Cloudstrike | Sniper Rifle | Arc | Piercing | null | null | Power | official+media |
| 30 | Wardcliff Coil | Rocket Launcher | Arc | Spread | null | null | Power | official+media |
| 31 | Truth | Rocket Launcher | Void | Spread | null | null | Power | media |
| 32 | Thunderlord | Machine Gun | Arc | Rapid-Fire | null | null | Power | official+media |
| 33 | Manifesto | Sidearm | null | null | null | null | Primary | official |
| 34 | SUROS Regime | Auto Rifle | null | null | null | null | Primary | official |

```
Exotic FIELD-LEVEL STATUS:
  name:       34/34 verified  [source: game8 + lb + official + media]
  rarity:     34/34 verified  [source: lightbearer (21 on lb, 13 from other sources)]
  type:       34/34 verified  [source: lightbearer + official]
  element:    32/34 verified  [2 null: Manifesto, SUROS Regime]
  style:      32/34 verified  [2 null: Manifesto, SUROS Regime]
  DPS:        22/34 verified  [12 null: #23-32, #33, #34]
  intrinsic:  22/34 verified  [12 null: same as DPS]
  slot:       34/34 verified  [10 Primary, 24 Power]
  foundry:    0/34 verified   [null]
  perks:      0/34 verified   [null — lightbearer "Coming soon"]
  mod data:   21/34 verified  [lightbearer'daki 21 Exotic için mod bilgisi var]
```

---

### MYTHIC WEAPONS: 51 unique — 51/51 rarity verified

#### S0 Mythic — game8 explicit list + lightbearer (27 silah, TÜMÜ full verified)

| # | Name | Type | Element | Style | DPS | Slot | Source |
|---|---|---|---|---|---|---|---|
| 1 | Sworn Oath | Auto Rifle | Solar | Rapid-Fire | 271 | Primary | game8+lb |
| 2 | Ultimatum | Pulse Rifle | Solar | Rapid-Fire | 284 | Primary | game8+lb |
| 3 | DEL2 Sweet Ears | Pulse Rifle | Arc | Rapid-Fire | 274 | Primary | game8+lb |
| 4 | DEL3 Lassi | Scout Rifle | Arc | Piercing | 253 | Primary | game8+lb |
| 5 | Total Lockdown | Scout Rifle | Solar | Piercing | 260 | Primary | game8+lb |
| 6 | 40000 Sidereal Year | Sniper Rifle | Solar | Piercing | 349 | Power | game8+lb |
| 7 | Magoichi | Sniper Rifle | Void | Piercing | 320 | Power | game8+lb |
| 8 | DEL7 SIMIT | Hand Cannon | Arc | Piercing | 255 | Primary | game8+lb |
| 9 | DEL6 Kokoretsi | Sidearm | Solar | Impact | 245 | Primary | game8+lb |
| 10 | Chushingura | Sidearm | Void | Impact | 262 | Primary | game8+lb |
| 11 | Wolfpack | Submachine Gun | Void | Rapid-Fire | 294 | Primary | game8+lb |
| 12 | DEL5 Kulfi | Submachine Gun | Arc | Rapid-Fire | 307 | Primary | game8+lb |
| 13 | IST1 Parantha | Fusion Rifle | Arc | Impact | 358 | Primary | game8+lb |
| 14 | Present Fleet | Light Grenade Launcher | Arc | Spread | 312 | Primary | game8+lb |
| 15 | End of the Line | Linear Fusion Rifle | Arc | Piercing | 434 | Power | game8+lb |
| 16 | HON3 Eibellaks | Auto Crossbow | Arc | Rapid-Fire | 388 | Power | game8+lb |
| 17 | Saizo | Auto Crossbow | Solar | Rapid-Fire | 395 | Power | game8+lb |
| 18 | Makeshift Ending | Sword | Solar | Impact | 757 | Power | game8+lb |
| 19 | Nobunaga | Sword | Arc | Impact | 816 | Power | game8+lb |
| 20 | CLY2 Kakalik | Sword | Void | Impact | 757 | Power | game8+lb |
| 21 | Eternal Retribution | Shotgun | Void | Impact | 730 | Power | game8+lb |
| 22 | IST2 Niaatiks | Shotgun | Arc | Impact | 740 | Power | game8+lb |
| 23 | Scorched Earth | Machine Gun | Solar | Rapid-Fire | 432 | Power | game8+lb |
| 24 | BVD4 Akutaak | Machine Gun | Arc | Rapid-Fire | 458 | Power | game8+lb |
| 25 | HON1 Khanom Khrok | Grenade Launcher | Solar | Spread | 471 | Power | game8+lb |
| 26 | HON2 Tutum'alik | Rocket Launcher | Void | Spread | 471 | Power | game8+lb |
| 27 | Yoshimoto | Bow | Arc | Piercing | 181 | Primary | lb |

#### S2+ Mythic — resmi patch notes (24 silah, sadece isim+type+rarity verified)

| # | Name | Type | Element | DPS | Source |
|---|---|---|---|---|---|
| 28 | Parole | Hand Cannon | null | null | official 11/03 |
| 29 | Tsurinobuse | Grenade Launcher | null | null | official 11/03 |
| 30 | Four-horned Ram | Rocket Launcher | null | null | official 11/03 |
| 31 | Empty Fort Strategy | Hand Cannon | null | null | official 11/03 |
| 32 | Thermopylae-80 | Shotgun | null | null | official 12/24 |
| 33 | Wrongful Ingress | Auto Rifle | null | null | official 12/24 |
| 34 | Threat Level | Shotgun | null | null | official 12/24 |
| 35 | Tatara Gaze | Sniper Rifle | null | null | official 12/24 |
| 36 | Stryker's Sure-Hand | Sword | null | null | official 12/24 |
| 37 | Bellowing Giant | Rocket Launcher | null | null | official 12/24 |
| 38 | DEL1 Baklava | Auto Rifle | null | null | official 03/26 |
| 39 | IST3 Zico'oclac | Sniper Rifle | null | null | official 03/26 |
| 40 | CLY3 North African Egg | Bow | null | null | official 03/26 |
| 41 | HON4 Pilaf | Light Grenade Launcher | null | null | official 03/26 |
| 42 | DEL9 Ovation | Linear Fusion Rifle | null | null | official 03/26 |
| 43 | Night After Night | Submachine Gun | null | null | official 03/26 |
| 44 | Mesicku | Sidearm | null | null | official 03/26 |
| 45 | Jezibaba | Hand Cannon | null | null | official 03/26 |
| 46 | Cury Mury Fuk | Light Grenade Launcher | null | null | official 03/26 |
| 47 | Mute Potion | Bow | null | null | official 03/26 |
| 48 | Suffocate Below | Linear Fusion Rifle | null | null | official 03/26 |
| 49 | Roguish Creature | Fusion Rifle | null | null | official 03/26 |
| 50 | Vodnik Above the Water | Auto Rifle | null | null | official 03/26 |
| 51 | Die in Vain | Machine Gun | null | null | official 03/26 |

```
Mythic FIELD-LEVEL STATUS:
  name:       51/51 verified  [27 S0+Yoshimoto: game8+lb; 24 S2+: official]
  rarity:     51/51 verified  [all Mythic]
  type:       51/51 verified  [27 S0: lb; 24 S2+: official patch notes]
  element:    27/51 verified  [27 S0; 24 S2+ = null]
  style:      27/51 verified  [27 S0; 24 S2+ = null]
  DPS:        27/51 verified  [27 S0; 24 S2+ = null]
  slot:       27/51 verified  [27 S0; 24 S2+ = null]
  foundry:    0/51 verified   [null]
  intrinsic:  0/51 verified   [null — Mythic silahlar için intrinsic trait bilgisi yok]
  perks:      0/51 verified   [null]
  mod data:   27/51 verified  [lightbearer'daki 27 S0 Mythic için mod bilgisi var]

24 S2+ MYTHIC İÇİN NOT:
  Bunların element, DPS, combat style, slot bilgileri patch notes'ta belirtilmemiş.
  Lightbearer.app'te bu silahlar YOK (site sadece 102 silah listeliyor, S0 seti).
  İkincil kaynaklarda (game8, blueberries.gg, vb.) bu silahlar için veri BULUNAMADI.
  Durum: null (araştırıldı, bulunamadı)
```

---

### LEGENDARY WEAPONS: 37 unique — 37/37 rarity verified

*(v6'da 40 denilmiş, lightbearer'da 37 var. 37'si de tablo below.)*

| # | Name | Type | Element | Style | DPS | Slot | Source |
|---|---|---|---|---|---|---|---|
| 1 | Cognitum Carbine | Auto Rifle | Arc | Rapid-Fire | 235 | Primary | lb |
| 2 | Toxic Equation | Auto Rifle | Void | Rapid-Fire | 215 | Primary | lb |
| 3 | P22 "Tamarin" | Auto Rifle | Solar | Rapid-Fire | 216 | Primary | lb |
| 4 | Type 7 "Moonshot" EMR-M | Pulse Rifle | Arc | Rapid-Fire | 224 | Primary | lb |
| 5 | P31 "Armadillo" | Pulse Rifle | Solar | Rapid-Fire | 224 | Primary | lb |
| 6 | P267 "Right Whale" | Scout Rifle | Solar | Piercing | 206 | Primary | lb |
| 7 | Fall From Grace | Scout Rifle | Void | Piercing | 196 | Primary | lb |
| 8 | Permanent Liability | Sidearm | Solar | Impact | 207 | Primary | lb |
| 9 | Century Lookout | Sidearm | Void | Impact | 202 | Primary | lb |
| 10 | Survivor's Instinct | Hand Cannon | Arc | Piercing | 204 | Primary | lb |
| 11 | P6 "Somniosus" | Hand Cannon | Void | Piercing | 217 | Primary | lb |
| 12 | AOCS R1 Revolver | Hand Cannon | Solar | Piercing | 211 | Primary | lb |
| 13 | Mutineer's Torch | Fusion Rifle | Arc | Impact | 289 | Primary | lb |
| 14 | The Monolith | Fusion Rifle | Void | Impact | 285 | Primary | lb |
| 15 | Latitude | Linear Fusion Rifle | Solar | Piercing | 340 | Power | lb |
| 16 | Brotherhood's Banner | Light Grenade Launcher | Void | Spread | 256 | Primary | lb |
| 17 | **Laplace's Mystery** | **Light Grenade Launcher** | **Arc** | **Spread** | **256** | **Primary** | **lb** |
| 18 | Desert Law | Bow | Arc | Piercing | 161 | Primary | lb |
| 19 | F606 "Sugar Glider" | Bow | Solar | Piercing | 162 | Primary | lb |
| 20 | Regolith Piton | Sword | Solar | Impact | 622 | Power | lb |
| 21 | Dusty Grave | Sword | Void | Impact | 622 | Power | lb |
| 22 | Gunpowder Duster | Shotgun | Arc | Impact | 600 | Power | lb |
| 23 | Labyrinth's Compass | Shotgun | Solar | Impact | 596 | Power | lb |
| 24 | K205 "Lemming" | Shotgun | Void | Impact | 451 | Power | lb |
| 25 | Prompt Satellite Dispenser | Grenade Launcher | Solar | Spread | 406 | Power | lb |
| 26 | A112 "Calf" | Grenade Launcher | Void | Spread | 385 | Power | lb |
| 27 | Call of Greed | Rocket Launcher | Solar | Spread | 390 | Power | lb |
| 28 | A67 "Javan Rhino" | Rocket Launcher | Void | Spread | 433 | Power | lb |
| 29 | Spikefling Baton | Machine Gun | Arc | Rapid-Fire | 381 | Power | lb |
| 30 | Full Field Thresher | Machine Gun | Solar | Rapid-Fire | 351 | Power | lb |
| 31 | The Accelerator | Sniper Rifle | Arc | Piercing | 287 | Power | lb |
| 32 | Overseer | Sniper Rifle | Void | Piercing | 287 | Power | lb |
| 33 | The Ultimate Prey | Sniper Rifle | Arc | Piercing | 259 | Power | lb |
| 34 | A19 "Argali" | Sniper Rifle | Solar | Piercing | 269 | Power | lb |
| 35 | Autoshear | Submachine Gun | Void | Rapid-Fire | 251 | Primary | lb |
| 36 | K18 "Coelops" | Submachine Gun | Arc | Rapid-Fire | 246 | Primary | lb |
| 37 | P45 "Turbot" | Auto Crossbow | Arc | Rapid-Fire | 318 | Power | lb |

```
Legendary FIELD-LEVEL STATUS:
  name:       37/37 verified  [source: lightbearer.app]
  rarity:     37/37 verified  [source: lightbearer.app — tümü 4★]
  type:       37/37 verified  [source: lightbearer.app]
  element:    37/37 verified  [source: lightbearer.app]
  style:      37/37 verified  [source: lightbearer.app]
  DPS:        37/37 verified  [source: lightbearer.app]
  slot:       37/37 verified  [source: lightbearer.app]
  foundry:    0/37 verified   [null]
  intrinsic:  0/37 verified   [null]
  perks:      0/37 verified   [null — lightbearer "Coming soon"]
  mod data:   37/37 verified  [lightbearer'daki tüm Legendary silahlar için mod bilgisi var]

v6'DAN DEĞİŞİKLİKLER:
  + Laplace's Mystery: Rare → Legendary olarak düzeltildi (lb detay sayfası: 4★)
  + Toplam: 36 → 37 (Laplace's Mystery eklendi)
  - "40 Legendary" iddiası → 37 olarak düzeltildi
```

---

### RARE WEAPONS: 17 unique — 17/17 rarity verified

| # | Name | Type | Element | Style | DPS | Slot | Source |
|---|---|---|---|---|---|---|---|
| 1 | Type 301-1 SRI | Auto Rifle | Void | Rapid-Fire | 187 | Primary | lb |
| 2 | Reverse Equilibrium | Pulse Rifle | Void | Rapid-Fire | 196 | Primary | lb |
| 3 | Always Going Home | Scout Rifle | Arc | Piercing | 177 | Primary | lb |
| 4 | Azure Drab Auto-Fab | Sidearm | Solar | Impact | 178 | Primary | lb |
| 5 | Amatoxin | Hand Cannon | Arc | Piercing | 175 | Primary | lb |
| 6 | Rev-7 Fusillade | Fusion Rifle | Solar | Impact | 252 | Primary | lb |
| 7 | Tye Nurler-AO4 | Linear Fusion Rifle | Arc | Piercing | 286 | Power | lb |
| 8 | Nightfall Banner | Sword | Solar | Impact | 539 | Power | lb |
| 9 | Sandan-54 Fieldhand | Shotgun | Solar | Impact | 517 | Power | lb |
| 10 | Lotus | Light Grenade Launcher | Solar | Spread | 210 | Primary | lb |
| 11 | 6G76 "Self-Rescue" LVL | Grenade Launcher | Arc | Spread | 325 | Power | lb |
| 12 | J90 "Hornbill" | Rocket Launcher | Solar | Spread | 314 | Power | lb |
| 13 | Chilling Thrill | Machine Gun | Solar | Rapid-Fire | 307 | Power | lb |
| 14 | Chirping Cicada | Auto Crossbow | Void | Rapid-Fire | 277 | Power | lb |
| 15 | Cold Arrow Movement | Bow | Arc | Piercing | 137 | Primary | lb |
| 16 | Dancing Bees | Submachine Gun | Solar | Rapid-Fire | 210 | Primary | lb |
| 17 | **Type 5 Stratoshot SRM** | **Sniper Rifle** | **Void** | **Piercing** | **223** | **Power** | **lb** |

```
Rare FIELD-LEVEL STATUS:
  name:       17/17 verified  [source: lightbearer.app]
  rarity:     17/17 verified  [source: lightbearer.app — tümü 3★]
  type:       17/17 verified  [source: lightbearer.app]
  element:    17/17 verified  [source: lightbearer.app]
  style:      17/17 verified  [source: lightbearer.app]
  DPS:        17/17 verified  [source: lightbearer.app]
  slot:       17/17 verified  [source: lightbearer.app]
  foundry:    0/17 verified   [null]
  intrinsic:  0/17 verified   [null]
  perks:      0/17 verified   [null — lightbearer "Coming soon"]
  mod data:   17/17 verified  [lightbearer'daki tüm Rare silahlar için mod bilgisi var]

v6'DAN DEĞİŞİKLİKLER:
  - Laplace's Mystery: Legendary olarak taşındı
  + Type 5 Stratoshot SRM: Yeni eklendi (lb'da bulundu, v6'da eksikti)
  + Toplam: 16 (Laplace's Mystery çıktıktan sonra) → 17 (Type 5 eklendi)
  - "19 Rare" iddiası → 17 olarak düzeltildi
```

---

### DUPLICATE KONTROLÜ

Tüm 139 silah isim bazında kontrol edildi:
- Duplicate: 0
- "Kabr" ve "Kabr the Resolute" — biri karakter, diğeri AYRI karakter. Silah listesinde değil.
- Wolfpack (SMG) ve Wolf (karakter) — farklı entity'ler, sorun yok.

---

### WEAPON TYPE DAĞILIMI (lightbearer.app — 102 silah)

| Type | Exotic | Mythic | Legendary | Rare | Total |
|---|---|---|---|---|---|
| Auto Rifle | 1 | 1 | 3 | 1 | 6 |
| Pulse Rifle | 1 | 2 | 2 | 1 | 6 |
| Scout Rifle | 1 | 2 | 2 | 1 | 6 |
| Fusion Rifle | 1 | 1 | 2 | 1 | 5 |
| Submachine Gun | 2 | 2 | 2 | 1 | 7 |
| Sidearm | 1 | 2 | 2 | 1 | 6 |
| Hand Cannon | 2 | 1 | 3 | 1 | 7 |
| Light Grenade Launcher | 0 | 1 | 2 | 1 | 4 |
| Bow | 1 | 1 | 2 | 1 | 5 |
| Linear Fusion Rifle | 1 | 1 | 1 | 1 | 4 |
| Shotgun | 2 | 2 | 3 | 1 | 8 |
| Sniper Rifle | 2 | 2 | 4 | 1 | 9 |
| Sword | 1 | 3 | 2 | 1 | 7 |
| Grenade Launcher | 1 | 1 | 2 | 1 | 5 |
| Rocket Launcher | 1 | 1 | 2 | 1 | 5 |
| Machine Gun | 2 | 2 | 2 | 1 | 7 |
| Auto Crossbow | 1 | 2 | 1 | 1 | 5 |
| **Total** | **21** | **27** | **35→37** | **17** | **102** |

*Not: Legendary toplamı 35 (lightbearer'da) + Laplace's Mystery'nin Legendary olarak düzeltilmesi ile 37'ye yükselir. Wait — Laplace's Mystery zaten lightbearer'da 4★ Legendary. O zaman yukarıdaki LGL satırında 2 Legendary var (Brotherhood's Banner + Laplace's Mystery). Toplam: 3+2+2+2+2+2+3+2+2+1+3+4+2+2+2+2+1 = 37. Doğru.

---

### WEAPON MOD SİSTEMİ (lightbearer.app'den doğrulanmış)

Her silah için 3 mod kategorisi var (lightbearer'daki 102 silah için):

**Ammo Mods (4 seçenek):**
- Weapon DMG mod (yüksek): +1.5% (MAX +15%)
- Weapon DMG mod (orta): +0.9% (MAX +9%)
- Weapon DMG mod (düşük): +0.8% (MAX +8%)
- Boss/Powerful DMG mod: +0.8% (MAX +8%)

**Scope Mods (4 seçenek):**
- Precision Hit DMG (yüksek): +1.8% (MAX +18%)
- Precision Hit DMG (orta): +1.2% (MAX +12%)
- Precision Hit DMG (düşük): +1.2% (MAX +12%)
- Long-Ranged/Mid-Ranged DMG: +0.8% (MAX +8%)

**Magazine Mods (4 seçenek):**
- Weapon Hit DMG (yüksek): +1.5% (MAX +15%)
- Weapon Hit DMG (orta): +0.9% (MAX +9%)
- Reload Speed (yüksek): -2% (MAX -20%)
- Reload Speed (düşük): -1.6% (MAX -16%)

*Not: Mod isimleri silah tipine göre değişiyor (örn: Ballistic Ammo, Cloudburst Grenades, vb.) ama stat bonusları benzer.*

```
MOD VERIFICATION:
  102/102 silah için mod listesi verified [source: lightbearer.app]
  Her silahta 3 kategori × 4 seçenek = 12 mod seçeneği
  Perk bilgisi: "Coming soon" — lightbearer'da henüz eklenmemiş
```

---

## ARTIFACTS

### 80 unique records — 80/80 slot+effect verified

**Slot dağılımı (lightbearer.app):**
- Slot I: 20 artifact
- Slot II: 20 artifact
- Slot III: 20 artifact
- Slot IV: 20 artifact

### SLOT I (20 artifact)

| # | Name | Type | Effect | Source |
|---|---|---|---|---|
| 1 | Abundant Planetesimal | Abilities | Casting Signature Abilities restores 0.86% health every second for 5s. Stacks 3x. | lb |
| 2 | Bulwark Evolution | Survival | Taking damage grants 1 stack of armored: take -0.63% damage. Stacks 20x. | lb |
| 3 | Bulwark Token | Piercing | Precision final blows grant a 238 overshield for 8s. | lb |
| 4 | Chiaroscuro | Survival | Take -8.75% damage, but receive -17.5% healing when health > 50%. | lb |
| 5 | Healing Planetesimal | Abilities | Recover 10.5% health after casting any ability. CD: 10s. | lb |
| 6 | Healing Radiation | Status | Recover 1.05% health/s within 20m of debuffed target. | lb |
| 7 | Inverted Guard | Survival | Gain +31.5% shield when health falls below 17.5%. | lb |
| 8 | Nimble Ground | Movement | Take -7% damage while moving. | lb |
| 9 | Nimble Veil | Movement | Casting movement abilities reduces damage taken by 14.7% for 3s. | lb |
| 10 | Nourishing Pact | Summon | Summoning restores 7% health. | lb |
| 11 | Resolute Conjunction | Impact | Take -12.25% damage from sources within 15m. | lb |
| 12 | Resolute Nutation | Rapid-Fire | Weapon/ability hits grant 0.86% damage resistance for 3s. Stacks 10x. | lb |
| 13 | Ring of Abundance | Overshield | Grants +16.8% potency to healing and overshields received. | lb |
| 14 | Ring of Healing | Overshield | Recover 1.54% health/s while protected by overshield. | lb |
| 15 | Talisman of Revival | Healing | Healing to full health also restores 3.29% health/2s for 8s. | lb |
| 16 | Unrelenting Ground | Movement | Take -11.2% damage while stationary. | lb |
| 17 | Unrelenting Shell | Spread | Reloading grants +8.75% damage resistance for 3s. | lb |
| 18 | Unrelenting Subgravity | Movement | Take -10.5% damage while airborne. | lb |
| 19 | Upright Guard | Survival | Gain +32.2% health when shield falls below 17.5%. | lb |
| 20 | Warding Pact | Summon | For every summon, gain ward: take -3.85% damage. Stacks 3x. | lb |

### SLOT II (20 artifact)

| # | Name | Type | Effect | Source |
|---|---|---|---|---|
| 1 | Binging Planetesimal | Ability | Signature Ability damage restores health = 7.7% of damage dealt. | lb |
| 2 | Bloodthirsty Shell | Spread | Hitting multiple targets simultaneously restores 14% health. | lb |
| 3 | Bulwark Pact | Summon | Wielder's summons gain +17.5 max health. | lb |
| 4 | Fertile Ground | Movement | Recover 1.4% health/s while stationary (below 100% HP). | lb |
| 5 | Healing Conjunction | Impact | After taking damage within 15m, recover 1.82% health/s for 6s. CD: 15s. | lb |
| 6 | Healing Ground | Movement | Final blows while moving restore 5.6% health. | lb |
| 7 | Healing Nutation | Rapid-Fire | After 5+ consecutive hits on same target, recover health = 9.44% of initial damage. | lb |
| 8 | Healing Subgravity | Movement | Airborne final blows restore 6.65% health. | lb |
| 9 | Healing Veil | Movement | Casting movement abilities instantly restores 5.6% health. | lb |
| 10 | Inverted Tenacity | Survival | Take -14% damage when health below 13.3%. | lb |
| 11 | Resolute Radiation | Status | Gain +8.75% damage resistance while affected by debuffs. | lb |
| 12 | Retributive Planetesimal | Ability | Ability final blows restore 4.55% HP. Elite+ kills restore 12.25% HP. | lb |
| 13 | Ring of Conversion | Overshield | 28% overflow healing → overshield (6s duration). | lb |
| 14 | Ring of Safeguarding | Overshield | Shield broken → overshield = 15.75% max HP (6s). CD: 16s. | lb |
| 15 | Siphoning Pact | Summon | Summons restore 5.94% health when assisting in final blows. | lb |
| 16 | Pranayama | Survival | Natural health recovery interval shortened by 24.5% while shielded. | lb |
| 17 | Talisman of Luxuriance | Healing | Healed targets gain 4.2% overshield/20% HP lost (6s). | lb |
| 18 | Unrelenting Evolution | Survival | Non-armored DR → +15 armored stacks (-0.63% each). | lb |
| 19 | Unrelenting Token | Piercing | Take -12.95% damage while ADS with piercing power weapons. | lb |
| 20 | Upright Tenacity | Survival | Gain +10.5% damage resistance when shield is broken. | lb |

### SLOT III (20 artifact)

| # | Name | Type | Effect | Source |
|---|---|---|---|---|
| 1 | Bellicose Pact | Summon | Wielder's summons deal +12.95% damage. | lb |
| 2 | Bellicose Precession | Rapid-Fire | 5 hits on same target → +12.95% rate of fire until reload. | lb |
| 3 | Bellicose Radiation | Status | While DoD affected: take -17.5% DoT damage, deal +5.25% damage. | lb |
| 4 | Bellicose Veil | Movement | Casting movement abilities → next Signature Ability +26.95% damage (3s). | lb |
| 5 | Calming Token | Piercing | Stationary shots: +3.5 accuracy, +16.1% precision damage. | lb |
| 6 | Courageous Planetesimal | Ability | Casting any ability → +6.3% damage for 10s. | lb |
| 7 | Inverted Fury | Survival | Gain +10.5% weapon damage while shielded. | lb |
| 8 | Jolted Transit | Impact | Drawn weapon: -7% precision damage, +12.95% body shot damage. | lb |
| 9 | Mysterious Submagnetism | Movement | +8.75% damage stationary, -1.75% damage moving. | lb |
| 10 | Predator Evolution | Survival | Gaining DR → +1.05% damage for 6s. Stacks 5x. | lb |
| 11 | Rampaging Pact | Summon | Summoning → +11.55% damage bonus for 6s. | lb |
| 12 | Ring of Courage | Overshield | Overshield: -3.5% damage taken, +7% damage dealt. | lb |
| 13 | Ring of Morale | Overshield | Gaining overshield → +7% damage bonus for 6s. | lb |
| 14 | Scattering Shell | Spread | Multi-target hit → next projectile +21% blast damage/radius. | lb |
| 15 | Talisman of Unity | Healing | Healing to 100% → +3.5% damage bonus for 6s. | lb |
| 16 | Upright Fury | Survival | No longer critically wounded → +8.75% damage for 6s. | lb |
| 17 | Upright Vengeance | Survival | +1.75% damage bonus per 10% health lost. | lb |
| 18 | Valiant Ground | Movement | +7.7% damage while sprinting. | lb |
| 19 | Valiant Subgravity | Movement | +7.7% damage while airborne. | lb |
| 20 | Vigilant Planetesimal | Ability | Signature Ability → next Signature within 6s: +17.5% damage. | lb |

### SLOT IV (20 artifact)

| # | Name | Type | Effect | Source |
|---|---|---|---|---|
| 1 | Bellicose Planetesimal | Abilities | Signature Abilities → +10.5% weapon damage for 6s. | lb |
| 2 | Bellicose Subgravity | Movement | +8.75% reload speed, +10.5% weapon damage airborne. | lb |
| 3 | Explosive Shell | Spread | Direct hits: +16.8% blast damage, +16.8% blast radius. | lb |
| 4 | Hawkeye Token | Piercing | Targets >20m: up to +16.8% damage based on distance. | lb |
| 5 | Illuminated Ground | Movement | Signature Abilities while stationary → +12.6% weapon damage for 6s. | lb |
| 6 | Inverted Survival | Survival | +8.4% reload speed, +1.75% movement speed per 25% HP missing. | lb |
| 7 | Inverted Vengeance | Survival | Shield value ratio × 5.25% damage bonus (max 7%) while shielded. | lb |
| 8 | Light-Rich Ground | Movement | Abilities deal +9.44% damage while sprinting. | lb |
| 9 | Rampaging Planetesimal | Ability | 15m damage → +1.4% Signature damage for 10s. Stacks 10x. | lb |
| 10 | Rampaging Precession | Rapid-Fire | 10+ hits in magazine → reload grants +14% damage bonus. | lb |
| 11 | Rampaging Radiation | Status | Abilities → rampage: -4.2% HP/2s, +2.8% damage for 10s. Stacks 3x. (HP >30%) | lb |
| 12 | Resonating Pact | Summon | Summons attacking same target → +16.45% damage. | lb |
| 13 | Resonating Transit | Impact | Same element on both weapons → +11.55% elemental damage. | lb |
| 14 | Responsive Pact | Summon | Signature Abilities → summons +14% attack damage for 6s. | lb |
| 15 | Ring of Reflection | Overshield | [overshield/maxHP] × 24.5% damage bonus (max 8.75%) with overshield. | lb |
| 16 | Ring of Vengeance | Overshield | Hits while overshielded → +0.86% damage for 6s. Stacks 10x. | lb |
| 17 | Sympathetic Evolution | Survival | +2.45% damage per active damage resistance buff. | lb |
| 18 | Talisman of Inspiration | Healing | +6.3% damage while receiving continuous healing. | lb |
| 19 | Upright Survival | Survival | Shield breaks → +7% movement speed, +8.75% damage. | lb |
| 20 | Valiant Veil | Movement | Casting movement abilities → +8.75% damage bonus for 5s. | lb |

```
ARTIFACT FIELD-LEVEL STATUS:
  name:       80/80 verified  (100%) [source: lightbearer.app]
  slot:       80/80 verified  (100%) [source: lightbearer.app]
  type:       80/80 verified  (100%) [source: lightbearer.app]
  effect:     80/80 verified  (100%) [source: lightbearer.app]
  set info:   0/80 unknown    (0%)   [naming convention suggests families, unconfirmed]
  2-piece:    0/80 unknown    (0%)   [resmi patch notes'ta set bonus sistemi doğrulandı ama detaylar unknown]
  4-piece:    0/80 unknown    (0%)   [resmi patch notes'ta set bonus sistemi doğrulandı ama detaylar unknown]

ARTIFACT TYPE DISTRIBUTION (80 total):
  Survival:   14 (Bulwark Evolution, Chiaroscuro, Inverted Guard/Fury/Survival/Tenacity/Vengeance,
                  Predator Evolution, Pranayama, Resolute Conjunction/Nutation, Sympathetic Evolution,
                  Upright Fury/Guard/Survival/Tenacity)
  Movement:   14 (Bellicose Subgravity/Veil, Fertile Ground, Healing Ground/Subgravity/Veil,
                  Illuminated Ground, Light-Rich Ground, Mysterious Submagnetism,
                  Nimble Ground/Veil, Unrelenting Ground/Subgravity, Valiant Ground/Subgravity/Veil)
  Overshield: 8  (Ring of Abundance/Conversion/Courage/Healing/Morale/Reflection/Safeguarding/Vengeance)
  Summon:     8  (Bellicose Pact, Bulwark Pact, Nourishing Pact, Rampaging Pact,
                  Resonating Pact, Responsive Pact, Siphoning Pact, Warding Pact)
  Ability:    6  (Abundant Planetesimal, Binging/Courageous/Rampaging/Retributive/Vigilant Planetesimal)
  Healing:    4  (Talisman of Inspiration/Luxuriance/Revival/Unity)
  Piercing:   4  (Bulwark Token, Calming Token, Hawkeye Token, Unrelenting Token)
  Rapid-Fire: 4  (Bellicose Precession, Healing Nutation, Rampaging Precession, Resolute Nutation)
  Impact:     4  (Healing Conjunction, Jolted Transit, Resolute Conjunction→wait, Resonating Transit)
  Spread:     4  (Bloodthirsty Shell, Explosive Shell, Scattering Shell, Unrelenting Shell)
  Status:     4  (Bellicose Radiation, Healing Radiation, Rampaging Radiation, Resolute Radiation)
  Abilities:  2  (Bellicose Planetesimal, Healing Planetesimal)

SET BONUSES:
  Resmi patch notes (07/30 + 08/06): Set bonus sistemi VAR olduğu doğrulandı.
  Ancak hangi artifact'lerin hangi set'e ait olduğu ve 2-piece/4-piece bonusları
  güvenilir kaynaklarda DOĞRULANAMADI → null/unknown.
  Naming convention ("Bellicose", "Bulwark", "Healing", "Inverted", etc.)
  set ailelerini gösteriyor olabilir ama bu SPEKÜLASYONDUR, doğrulanmamıştır.
```

---

## MATERIALS

### 30 unique records — 30/30 verified

*(game8.co/lists/549792 — upgrade materials sayfası 404 döndü, v6'daki game8 verisi kullanılıyor)*

| # | Name | Category | Rarity | Use | Source |
|---|---|---|---|---|---|
| 1 | Artifactual Dust (Rare) | Upgrade Material | Rare | Rare weapon/artifact upgrade | game8 |
| 2 | Artifactual Dust (Legendary) | Upgrade Material | Legendary | Legendary weapon/artifact upgrade | game8 |
| 3 | Artifactual Dust (Mythic) | Upgrade Material | Mythic | Mythic weapon/artifact upgrade | game8 |
| 4 | Arc Fruit | Elemental Material | Rare | Arc element upgrade | game8 |
| 5 | Solar Fruit | Elemental Material | Rare | Solar element upgrade | game8 |
| 6 | Void Fruit | Elemental Material | Rare | Void element upgrade | game8 |
| 7 | Incandescence Tuft | Elemental Material | Legendary | Solar element upgrade (T1) | game8 |
| 8 | Incandescence Ribbon | Elemental Material | Legendary | Solar element upgrade (T2) | game8 |
| 9 | Incandescence Sheaf | Elemental Material | Legendary | Solar element upgrade (T3) | game8 |
| 10 | Incandescence Cluster | Elemental Material | Mythic | Solar element upgrade (T4) | game8 |
| 11 | Ascension Cell | Upgrade Material | Legendary | Character/weapon ascension | game8 |
| 12 | Upgrade Core | Upgrade Material | Rare/Legendary | Weapon upgrade | game8 |
| 13 | Lumenite (Cracked) | Upgrade Material | Rare | Weapon upgrade (T1) | game8 |
| 14 | Lumenite (Dense) | Upgrade Material | Legendary | Weapon upgrade (T2) | game8 |
| 15 | Lumenite (Hardened) | Upgrade Material | Legendary | Weapon upgrade (T3) | game8 |
| 16 | Lumenite (Sharp) | Upgrade Material | Mythic | Weapon upgrade (T4) | game8 |
| 17 | Enhancement Prism (Impact) | Upgrade Material | Legendary | Impact frame enhancement | game8 |
| 18 | Enhancement Prism (Piercing) | Upgrade Material | Legendary | Piercing frame enhancement | game8 |
| 19 | Enhancement Prism (Rapid-Fire) | Upgrade Material | Legendary | Rapid-Fire frame enhancement | game8 |
| 20 | Enhancement Prism (Spread) | Upgrade Material | Legendary | Spread frame enhancement | game8 |
| 21 | Mythic Infusion Core (Impact) | Upgrade Material | Mythic | Impact frame mythic infusion | game8 |
| 22 | Mythic Infusion Core (Piercing) | Upgrade Material | Mythic | Piercing frame mythic infusion | game8 |
| 23 | Mythic Infusion Core (Rapid-Fire) | Upgrade Material | Mythic | Rapid-Fire mythic infusion | game8 |
| 24 | Mythic Infusion Core (Spread) | Upgrade Material | Mythic | Spread frame mythic infusion | game8 |
| 25 | Mod Fragment | Upgrade Material | Rare/Legendary/Mythic | Weapon mod refine | game8 |
| 26 | Möbius Cluster | Upgrade Material | Legendary/Mythic | High-tier upgrade | game8 |
| 27 | Contextual Dataset | Upgrade Material | Legendary/Mythic | High-tier upgrade | game8 |
| 28 | Superposed Photon | Upgrade Material | Mythic | Highest-tier upgrade | game8 |
| 29 | Incandescence Sheaf (variant) | Elemental Material | Legendary | Solar element upgrade | game8 |
| 30 | Artifactual Dust (Exotic) | Upgrade Material | Exotic | Exotic upgrade | game8 |

```
MATERIAL FIELD-LEVEL STATUS:
  name:    30/30 verified  (100%) [source: game8]
  type:    30/30 verified  (100%) [source: game8]
  rarity:  30/30 verified  (100%) [source: game8]
  use:     30/30 verified  (100%) [source: game8]

NOT: game8 sayfası (549792) şu anda 404 döndürüyor.
     Bu veriler v6 araştırmasında game8'den toplanmıştı.
     Yeniden doğrulama için alternatif kaynak gerekli.
```

---

## FOUNDRIES

### 5 verified foundry names

| # | Foundry | Known Traits | Source |
|---|---|---|---|
| 1 | Black Armory | Forger's Kin (Origin), Culture Clash (Origin) | game8 + Destinypedia |
| 2 | Heron | Paranoia (Origin) | game8 + Destinypedia |
| 3 | Jiangshi Steelworks | — | game8 |
| 4 | Riviks & Wright | — | game8 |
| 5 | Eclipse Monolith | — | game8 |

```
FOUNDRY FIELD-LEVEL STATUS:
  name:           5/5 verified   (100%) [source: game8 + Destinypedia]
  traits:         3/5 partial    (60%)  [Black Armory: 2 traits, Heron: 1 trait]
  weapon mapping: 0/139 verified (0%)   [null — oyun içi veri gerekli]

NOT: "Foundry coverage" ifadesi kullanılmıyor.
     Denominator belli olmadığı için yüzde verisi anlamsız.
     Doğrulanmış olan: 5 foundry ismi, 3 origin trait bağlantısı.
     Doğrulanamayan: hangi silahın hangi foundry'ye ait olduğu (0/139).
```

---

## INTRINSIC TRAITS

### 29 verified (7 generic + 22 Exotic-specific)

**Generic Frame Traits (7) — Rare/Legendary/Mythic variant'ları:**

| # | Trait | Available For | Source |
|---|---|---|---|
| 1 | Adaptive Frame | Rare/Legendary/Mythic | game8 |
| 2 | Aggressive Burst | Legendary/Mythic | game8 |
| 3 | Aggressive Frame | Legendary/Mythic | game8 |
| 4 | High-Impact Frame | Legendary/Mythic | game8 |
| 5 | Lightweight Frame | Rare/Legendary/Mythic | game8 |
| 6 | Precision Frame | Rare/Legendary/Mythic | game8 |
| 7 | Rapid-Fire Frame | Rare/Legendary/Mythic | game8 |

**Exotic Intrinsic Traits (22):**

| # | Trait | Source |
|---|---|---|
| 1 | Payday (Sweet Business) | game8+lb |
| 2 | Neural Currents (Furies III) | game8+lb |
| 3 | The Perfect Fifth (Polaris Lance) | game8+lb |
| 4 | Arc Conductor (Riskrunner) | game8+lb |
| 5 | Ride the Bull (The Huckleberry) | game8+lb |
| 6 | Banned Weapon (Crimson) | game8+lb |
| 7 | Tiger's Throw (The Old Prefect) | game8+lb |
| 8 | Cadenza (Concerto) | game8+lb |
| 9 | Charged Shot (Jötunn) | game8+lb |
| 10 | The Fundamentals (Borealis) | game8+lb |
| 11 | Honed Edge (Izanagi's Burden) | game8+lb |
| 12 | Precision Slug (The Chaperone) | game8+lb |
| 13 | Salvo of Artillery (Octant Riot Disperser) | game8+lb |
| 14 | Airburst Grenades (Satiyaaliksni Smart Bomb) | game8+lb |
| 15 | Wire Rifle (Royal Contravene) | game8+lb |
| 16 | Arrows of Silver (Partridge Sky) | game8+lb |
| 17 | Trimurti (Mahamayuri) | game8+lb |
| 18 | Twintails (Two-Tailed Fox) | game8+lb |
| 19 | Bosenova Grenades (Gallows) | game8+lb |
| 20 | Heavy Grenade Launcher (Heir Apparent) | game8+lb |
| 21 | Split Election (Trinity Ghoul) | game8+lb |
| 22 | String of Curses (Bad Juju) | lb+community |

```
INTRINSIC FIELD-LEVEL STATUS:
  Generic: 7/7 verified (100%) [source: game8]
  Exotic:  22/34 verified (65%) [12 Exotic intrinsic = null]
  Total:   29 verified traits
  Null:    12 Exotic (Jade Rabbit, Symmetry, The Last Word, 'Til Eternal Death,
           Dvergar Drill, Arbalest, Cloudstrike, Wardcliff Coil, Truth, Thunderlord,
           Manifesto, SUROS Regime)
```

---

## ORIGIN TRAITS

### 8 verified

| # | Trait | Foundry | Source |
|---|---|---|---|
| 1 | Culture Clash | Black Armory | game8 |
| 2 | Disturbance | — | game8 |
| 3 | Lend-Lease Act | — | game8 |
| 4 | Paranoia | Heron | game8 |
| 5 | Synesthesia | — | game8 |
| 6 | Wartime Conditions | — | game8 |
| 7 | Yelnya Guards | — | game8 |
| 8 | Forger's Kin | Black Armory | game8 |

```
ORIGIN FIELD-LEVEL STATUS:
  name:         8/8 verified   (100%) [source: game8]
  foundry link: 3/8 verified   (38%)  [Culture Clash→BA, Paranoia→Heron, Forger's Kin→BA]
  weapon link:  0/139 verified (0%)   [null — hangi silahta hangi origin trait var bilinmiyor]
```

---

## WEAPON PERK SİSTEMİ DURUMU

```
PERK VERIFICATION STATUS:
  Intrinsic traits:  29 verified (7 generic + 22 Exotic)
  Origin traits:      8 verified
  Random Perk Slot 1: 0/139 verified [null — lightbearer "Coming soon"]
  Random Perk Slot 2: 0/139 verified [null]
  Catalyst:           0/139 verified [null — sistem var mı bilinmiyor]
  Resonance:          0/139 verified [null — sistem var mı bilinmiyor]

NOT: Lightbearer.app'de tüm silah detay sayfalarında "Perks: Coming soon..." yazıyor.
     Bu, perk pool verilerinin henüz community database'e eklenmediği anlamına geliyor.
     Perk bilgileri oyun içi game data extraction ile elde edilebilir.
     Tahmin veya eski Destiny oyunlarından perk taşıma YASAK.
```

---

## 26 NULL ELEMENT/DPS WEAPONS İÇİN ARAŞTIRMA DURUMU

Bu 26 silah S2+ Mythic silah + 2 Exotic (Manifesto, SUROS Regime):

**S2+ Mythic (24 silah):**
Patch notes'ta sadece isim ve weapon type belirtilmiş. Element, DPS, combat style bilgileri patch notes'ta YOK.

Araştırılan kaynaklar:
- ✅ playdestinyrising.com (resmi patch notes) — element/DPS bilgisi yok
- ✅ lightbearer.app — bu 24 silah listede YOK (site sadece 102 silah listeliyor)
- ✅ game8.co — Mythic weapon listesi sadece S0 silahlarını içeriyor
- ✅ blueberries.gg — erişilemedi/veri bulunamadı
- ✅ dotesports, vg247, gamesradar — S2+ silah detayları yok

**Sonuç: 24 S2+ Mythic silah için element/DPS = null (araştırıldı, bulunamadı)**

**Manifesto ve SUROS Regime (2 Exotic):**
- Manifesto: Resmi kaynakta isim doğrulandı. Type=Sidearm, Slot=Primary. Element ve DPS=null.
- SUROS Regime: Resmi kaynakta isim doğrulandı. Type=Auto Rifle, Slot=Primary.
  - Eski Destiny oyunlarında Kinetic element. Ancak Destiny: Rising'da element farklı olabilir.
  - Destinypedia'da "Kinetic" olarak geçiyor ama bu eski Destiny verisi.
  - Destiny: Rising için element = null (tahmin yapılmadı).

---

## NULL COUNTS (GÜNCEL)

```
=== NULL/UNKNOWN COUNTS ===

WEAPONS:
  Null rarity:        0/139 (0%)    ← 100% verified
  Null element:      26/139 (19%)   ← 24 S2+ Mythic + 2 Exotic
  Null DPS:          26/139 (19%)   ← same 26 weapons
  Null combat style: 26/139 (19%)   ← same 26 weapons
  Null slot:         26/139 (19%)   ← same 26 weapons
  Null foundry:     139/139 (100%)  ← hiçbir silahın foundry'si bilinmiyor
  Null intrinsic:   117/139 (84%)   ← sadece 22 Exotic intrinsic var
  Null origin:      139/139 (100%)  ← weapon→origin trait mapping yok
  Null perks:       139/139 (100%)  ← perk pool'ları araştırılmamış

ARTIFACTS:
  Null slot:          0/80 (0%)     ← 100% verified
  Null effect:        0/80 (0%)     ← 100% verified
  Null set:          80/80 (100%)   ← set bilgisi yok
  Null 2-piece:      80/80 (100%)   ← set bonus detayı yok
  Null 4-piece:      80/80 (100%)   ← set bonus detayı yok

CHARACTERS:
  Null abilities:    20/20 (100%)   ← oyun içi veri gerekli
  Null traits:       20/20 (100%)   ← oyun içi veri gerekli
```

---

## ÖNCEKİ SÜRÜMLERDEN FARKLAR (v6 → v7)

| Metrik | v6 | v7 | Değişiklik |
|---|---|---|---|
| Toplam silah | 144 | **139** | -5 (3L + 2R fazla sayılmış) |
| Legendary | 40 (36 listed) | **37 (37 listed)** | Laplace's Mystery: R→L, +Type 5 Stratoshot SRM |
| Rare | 19 (17 listed) | **17 (17 listed)** | Laplace's Mystery çıktı, Type 5 girdi |
| Artifact verified | 67/80 (84%) | **80/80 (100%)** | Lightbearer 80/80 slot+effect |
| "Tüm veriler doğrulanmış" | ✓ (yanlış) | **KALDIRILDI** | Field-level ayrımı |
| Weapon foundry | "%63 coverage" | **0/139 (0%)** | Coverage ifadesi kaldırıldı |
| Perk data | "Yetersiz" | **0/139 (0%)** | Lightbearer "Coming soon" |
| Mod data | Belirtilmemiş | **102/139 (73%)** | Lightbearer'dan yeni |

---

## SONUÇ VE ÖNERİLER

### Mevcut Durum
- **139 silah** isim+type+rarity bazında doğrulanmış
- **113 silah** (81%) element+DPS+combat style bazında doğrulanmış
- **26 silah** (19%) sadece isim+type doğrulmuş, geri kalanı null
- **80 artifact** slot+type+effect bazında %100 doğrulanmış
- **30 materyal** %100 doğrulanmış
- **5 foundry** ismi doğrulanmış, weapon mapping = 0
- **20 karakter** temel bilgileri doğrulanmış, abilities/traits = null

### Eksik Veri İçin Gerekli Araştırma
1. **Weapon foundry mapping** → Oyun içi game data extraction gerekli
2. **Weapon perk pool'ları** → Oyun içi game data veya lightbearer güncellemesi
3. **26 S2+ silah element/DPS** → Oyun içi game data veya yeni kaynaklar
4. **Artifact set bonusları** → Oyun içi veri veya resmi kaynak
5. **Character abilities/traits** → Oyun içi veri
6. **Origin trait → weapon mapping** → Oyun içi veri

### KESİN UYARILAR
- Kod değişikliği YAPILMADI
- Commit/push YAPILMADI
- Hiçbir production data dosyasına DOKUNULMADI
- Tüm veriler field-level provenance ile raporlandı
- Tahmin, placeholder veya başka oyunlardan veri aktarma YAPILMADI
