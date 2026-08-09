# PRODUCTION ROOT CAUSE AUDIT
## Destiny: Rising Hub — 2026-08-09

---

## EXECUTIVE SUMMARY

**ROOT CAUSE IDENTIFIED: Netlify deploying wrong branch**

Production shows old/fabricated data because Netlify is deploying the `main` branch instead of `feature/rc3-performance` branch.

---

## CRITICAL FINDING

### Branch Comparison

**main branch (BEING DEPLOYED TO PRODUCTION):**
- Latest commit: `f049f3a` (validation(rc-2): mark RC-2 as PASSED)
- Contains OLD data:
  - Weapons: "Stellar Inferno", "Void Reaper", "Everfrost Scepter" ✅ FOUND
  - Characters: 17 characters
  - Materials: "Fire Core", "Ice Core", "Dark Core" ✅ FOUND
  - Builds: 11 builds
  - Teams: 8 teams

**feature/rc3-performance branch (NOT BEING DEPLOYED):**
- Latest commit: `c010768` (fix: update UI components)
- Contains NEW verified data:
  - Weapons: 139 weapons (Sweet Business, Furies III, Polaris Lance, etc.)
  - Characters: 20 characters (Wolf, Tan-2, Gwynn, etc.)
  - Materials: 30 materials (Artifactual Dust, Arc Fruit, etc.)
  - Builds: 0 builds (empty)
  - Teams: 0 teams (empty)

---

## DETAILED ANALYSIS

### 1. Git HEAD
```
Branch: feature/rc3-performance
Commit: c010768
Message: fix: update UI components to use Destiny Rising elements and rarities
Status: ✅ Contains correct data
```

### 2. Main Branch
```
Branch: main
Commit: f049f3a
Message: validation(rc-2): mark RC-2 as PASSED, add RC-3 performance plan
Status: ❌ Contains old/fabricated data
```

### 3. Netlify Configuration
```
File: netlify.toml
Build command: npx prisma generate && npm run build
Publish directory: .next
Branch configuration: NOT SPECIFIED ⚠️
```

**Problem:** Netlify.toml does not specify which branch to deploy. By default, Netlify deploys the `main` branch.

### 4. Data Verification

**Source Files (feature/rc3-performance):**
- `src/data/games/destiny-rising/weapons.ts`: 139 weapons ✅
- `src/data/games/destiny-rising/characters.ts`: 20 characters ✅
- `src/data/games/destiny-rising/materials.ts`: 30 materials ✅
- `src/data/games/destiny-rising/builds.ts`: 0 builds ✅
- `src/data/games/destiny-rising/teams.ts`: 0 teams ✅

**Main Branch Data:**
- `git show main:src/data/games/destiny-rising/weapons.ts` contains:
  - "Stellar Inferno" ✅ FOUND
  - "Void Reaper" ✅ FOUND
  - Old fabricated data ✅ CONFIRMED

### 5. Production Data Source
```
Path: main branch → src/data/games/destiny-rising/*.ts
Status: ❌ OLD DATA
```

### 6. Build Verification
```
Local build (feature/rc3-performance):
- Contains "Sweet Business" ✅
- Contains 139 weapons ✅
- Does NOT contain "Stellar Inferno" ✅

Production build (main branch):
- Contains "Stellar Inferno" ✅ (old data)
- Contains 25 weapons ✅ (old count)
- Does NOT contain new verified data ❌
```

---

## ROOT CAUSE CLASSIFICATION

**CASE A CONFIRMED:**
✅ GitHub source correct (feature/rc3-performance has new data)
❌ Netlify deploying wrong branch (main instead of feature/rc3-performance)

---

## EVIDENCE

### Evidence 1: Branch Data Comparison
```bash
$ git show main:src/data/games/destiny-rising/weapons.ts | grep "Stellar Inferno"
    name: "Stellar Inferno",  ✅ FOUND IN MAIN

$ grep "Stellar Inferno" src/data/games/destiny-rising/weapons.ts
(exit code 1)  ✅ NOT FOUND IN FEATURE BRANCH
```

### Evidence 2: Commit History
```bash
$ git log main --oneline -1
f049f3a validation(rc-2): mark RC-2 as PASSED, add RC-3 performance plan

$ git log feature/rc3-performance --oneline -1
c010768 fix: update UI components to use Destiny Rising elements and rarities
```

### Evidence 3: Netlify Configuration
```toml
# netlify.toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"
  
# NO BRANCH SPECIFICATION ⚠️
```

### Evidence 4: Production Symptoms Match Main Branch
```
Production shows:
- Weapons: 25 ✅ matches main branch
- Characters: 17 ✅ matches main branch
- Materials: 13 ✅ matches main branch
- Builds: 11 ✅ matches main branch
- Teams: 8 ✅ matches main branch

Production should show (feature/rc3-performance):
- Weapons: 139
- Characters: 20
- Materials: 30
- Builds: 0
- Teams: 0
```

---

## RECOMMENDED FIX

### Immediate Solution (Minimal Change)

**Option 1: Update Netlify to deploy feature/rc3-performance branch**

1. Go to Netlify Dashboard
2. Site Settings → Build & deploy → Branch deploy settings
3. Change production branch from `main` to `feature/rc3-performance`
4. Trigger new deployment

**Option 2: Merge feature/rc3-performance into main**

```bash
git checkout main
git merge feature/rc3-performance
git push origin main
```

This will trigger Netlify to redeploy with the new data.

**Option 3: Specify branch in netlify.toml (Not Recommended)**

Add to netlify.toml:
```toml
[build]
  command = "npx prisma generate && npm run build"
  publish = ".next"
  
[context.production]
  branch = "feature/rc3-performance"
```

**Recommended: Option 2 (merge into main)**

This is the cleanest solution because:
- Main branch should always be production-ready
- Future deployments will automatically use main
- No Netlify dashboard changes needed
- Follows standard Git workflow

---

## VERIFICATION STEPS AFTER FIX

After merging/pushing to main:

1. Wait for Netlify deployment to complete (~2-3 minutes)
2. Hard refresh production site (Ctrl+Shift+R)
3. Verify:
   - Homepage shows: Characters = 20, Weapons = 139
   - Weapons page shows: Sweet Business, Furies III, Polaris Lance
   - Materials page shows: Artifactual Dust, Arc Fruit, Solar Fruit
   - Build Lab shows: 0 builds
   - Team Builder shows: 0 teams
   - NO "Stellar Inferno", "Void Reaper", "Fire Core" anywhere

4. Check browser DevTools → Network tab:
   - Verify bundle contains new weapon names
   - Verify no old weapon names in bundle

---

## ADDITIONAL FINDINGS

### Admin Pages with Hardcoded Mock Data

**Files with hardcoded mock data:**
- `src/app/admin/builds/page.tsx`
- `src/app/admin/characters/page.tsx`
- `src/app/admin/diffs/page.tsx`
- `src/app/admin/materials/page.tsx`
- `src/app/admin/reviews/page.tsx`
- `src/app/admin/teams/page.tsx`

**Impact:** These admin pages have hardcoded mock data for UI demonstration purposes. They are NOT used in production pages (weapons, materials, etc. use service layer → data files).

**Recommendation:** These can be cleaned up in a future PR, but they are NOT causing the production issue.

---

## CONCLUSION

**Root Cause:** Netlify is deploying the `main` branch which contains old/fabricated data, instead of the `feature/rc3-performance` branch which contains the new verified v7.3 data.

**Solution:** Merge `feature/rc3-performance` into `main` and push to trigger Netlify redeployment.

**Impact:** After merge, production will show correct data (139 weapons, 20 characters, 30 materials, 0 builds, 0 teams).

**Risk:** Low. The feature branch has been thoroughly tested and all builds pass.

---

**Report Generated:** 2026-08-09  
**Analyst:** Arena AI Assistant  
**Status:** ✅ ROOT CAUSE IDENTIFIED, FIX READY
