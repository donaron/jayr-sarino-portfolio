# Barangay Service Portal Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans phase-by-phase with strict RED->GREEN gates. Do not proceed to the next phase while any error remains.

**Goal:** Integrate Jay-r Sarino's real five-app Barangay II Población capstone documentation and approved developer bio into the portfolio while maintaining strict budgets (`CSS <= 30,000B`), CSP, WCAG 2.1 AA contrast, and `--release` safety guards.

**Architecture:** Preserve the Lean Static toolchain (`HTML5`, compiled `Tailwind CSS v4`, vanilla JS `<= 15 KB`, `node:test`). Upgrade `create-fixtures.mjs` to depict authentic Resident/Tanod/Healthcare app flows, replace Realtime DB copy cleanly with Cloud Firestore + RBAC + FCM + Maps/GPS + Rule Validation, and keep CSS growth flat by reusing existing utility classes.

**Tech Stack:** Node.js `v24.18.0`, Tailwind CSS `4.3.5`, HTML5, Vanilla JS, SVG.

---

### Phase 1: Tests (RED), Barangay UI Artwork & Codec Gate (`scripts/create-fixtures.mjs`, `tests/portfolio.test.mjs`)

- [ ] **Step 1 (RED):** Add assertions in `tests/portfolio.test.mjs` verifying `src/index.html` and `docs/designs/portfolio.md` reflect all 5 Barangay Service Portal apps, `Barangay II Población`, `Cloud Firestore`, `Firebase Authentication`, `FCM`, `Google Maps`, `Rule-Based Validation`, approved hero bio, zero stale `Realtime Database` wording in `src/index.html`, plus build CSS budget assertion (`<= 30,000B`).
- [ ] **Step 2:** Run `npm test` and confirm new Barangay content tests **FAIL (RED)**.
- [ ] **Step 3 (GREEN for fixtures):** Update `scripts/create-fixtures.mjs` to render Resident Portal, Tanod Dispatch Map/GPS, and Healthcare Appointments/Inventory screens (`800x1200` WebP) + `1200x630` JPEG banner; run `npm run init:fixtures` and verify Chrome `libwebp`/`libjpeg` decoding & visual PNG inspection.

### Phase 2: Portfolio HTML, Specs Sync & Build/Unit Gate (`src/index.html`, `docs/designs/portfolio.md`)

- [ ] **Step 1:** Update `src/index.html` with approved bio, Tech Stack separation (5-app core technologies + portfolio web stack), 5-app breakdown cards, updated Cloud Firestore/Auth/Maps/FCM architecture SVG, `firestore.rules` & Dart Firestore stream snippets (`data-owner-draft`), matching gallery captions (`data-owner-draft`), keeping CSS utilities reused (`<= 30,000B`).
- [ ] **Step 2:** Sync `docs/designs/portfolio.md` with the Barangay Service Portal + Cloud Firestore stack.
- [ ] **Step 3 (GREEN Gate):** Run `npm run build`, `npm test`, and negative `npm run build:release` (`EXIT=1`), fixing any CSS budget, contrast, heading, or test failures until 100% green.

### Phase 3: Live Chrome E2E, Visual Review & Independent Senior Code Review Gate

- [ ] Start `preview.mjs` (`BypassSandbox: true`, `IsDaemon: true`) on `http://127.0.0.1:4173/`.
- [ ] Run full Chrome CDP E2E across `1440x900`, `768x1024`, `640x900`, `375x812`, `360x800` + inspect updated screenshots (`hero`, `5-app cards`, `architecture SVG`, `firestore.rules`, `3 Barangay mockups`, `mobile 360px`) via `read_file`.
- [ ] Dispatch fresh Senior Code Reviewer (`self`, `Model: "pro"`), fix any Critical/Important findings via TDD, re-run `npm test`, `npm run build`, negative `build:release`, and live CDP checks after final edits.
