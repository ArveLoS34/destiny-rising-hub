# Contributing to Destiny Rising Hub

## Current Phase: Release Validation

This project is in the **Release Validation** phase. All core features have been implemented.
The sole objective is to pass Release Candidates RC-1 through RC-6 with real evidence.

---

## ⚠️ Golden Rule

> **No feature development until the current Release Candidate has passed.**

This is not a suggestion. This is the project discipline.

### What This Means

- ❌ No new features while any RC is pending
- ❌ No "quick improvements" while validation is in progress
- ❌ No refactoring unless it directly fixes an RC blocker
- ✅ Only RC validation work
- ✅ Only bug fixes that block RC completion
- ✅ Only documentation updates that support validation

### Why?

Every line of unvalidated code increases risk. Every untested feature adds complexity
without evidence. The only path to v1.0 is through validated, proven functionality.

---

## Current Status

```
Product Completion:       94%  ✅
Operational Readiness:    10%  🟡
Production Validation:     0%  🎯  (0/6 RC passed)
```

**Current Objective:** RC-1 Infrastructure Validation → PASS

---

## RC Process

| RC | Focus | Status |
|----|-------|--------|
| RC-1 | Infrastructure | 🟡 READY |
| RC-2 | Functional | ⬜ |
| RC-3 | Performance | ⬜ |
| RC-4 | Security | ⬜ |
| RC-5 | Production Rehearsal | ⬜ |
| RC-6 | Launch Approval | ⬜ |

Each RC must:
1. Pass all test criteria
2. Produce evidence in `docs/validation/evidence/`
3. Update `PROJECT-ASSESSMENT.md`
4. Be repeatable on a clean environment

**A RC is not "done" until it has evidence.**

---

## Commit Convention

All commits in this phase follow the validation format:

```
rc(rc-N): Description
fix(rc-N): Description
validation(rc-N): Description
docs: Description
```

No `feat:` commits. No `refactor:` commits. No `chore:` commits.
Only validation, fixes that unblock validation, and documentation.

---

## File Priority

When making changes, update files in this order:

1. **`PROJECT-ASSESSMENT.md`** — Always first. This is the project's source of truth.
2. **`docs/validation/RC-N.md`** — Evidence and status.
3. **`docs/validation/evidence/`** — Actual proof (logs, screenshots, reports).
4. **Code changes** — Only if they fix RC blockers.

---

## How to Help

### If you want to contribute:

1. **Read** `PROJECT-ASSESSMENT.md` to understand current state
2. **Check** which RC is currently in progress
3. **Run** the validation steps in `docs/validation/RC-N.md`
4. **Document** results in `docs/validation/evidence/`
5. **Update** `PROJECT-ASSESSMENT.md` with findings

### If you want to add a feature:

**Don't.** Not until RC-6 passes.

After v1.0.0 is released, feature development resumes with semantic versioning:
- `v1.0.x` — Bug fixes
- `v1.1.0` — Quality of life
- `v1.2.0` — Game updates
- `v2.0.0` — Major new features

---

## The Only Question That Matters

> "How many RCs have passed, and what evidence proves it?"

Not "how many features exist" or "how many lines of code were written."

---

*Last updated: 2026-08-05*
*Current RC: RC-1 Infrastructure Validation*
*Next milestone: Overall Validation 0/6 → 1/6*
