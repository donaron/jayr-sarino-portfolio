# Portfolio Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan phase-by-phase with strict RED->GREEN verification gates before proceeding between phases.

**Goal:** Transform the Phase 1 portfolio scaffold into a polished, high-contrast, user-friendly developer showcase with rich pure-Node UI fixture previews, crisp human copy, and enhanced lightbox/copy UX while preserving strict static budgets, CSP compliance, and `--release` safety guards.

**Architecture:** Maintain static `HTML5` + compiled `Tailwind CSS v4` + vanilla progressive `JavaScript`. Replace `[PHASE 2 OWNER INPUT]` visual noise in HTML copy with `data-owner-draft` gating checked by `scripts/build.mjs --release`, upgrade `scripts/create-fixtures.mjs` with a full Huffman + LZ77 `VP8L` `WebP` encoder and macro-block `JPEG` banner renderer, and gate every phase behind built-in Node unit tests (`npm test`), build budget verification, live Chromium browser tests, and fresh code review.

**Tech Stack:** Node.js `v24.18.0` (`node:test`, `node:assert/strict`), Tailwind CSS `4.3.5` (`@tailwindcss/cli`), Vanilla ES Modules, Semantic HTML5, Inline SVG.

**Spec:** `docs/superpowers/specs/2026-11-18-portfolio-enhancement-design.md` and `docs/designs/portfolio.md`

## Global Constraints

- Exact pinned `tailwindcss@4.3.5` and `@tailwindcss/cli@4.3.5`; zero new npm runtime/dev packages.
- Strict CSP compatibility: zero inline `<script>` or HTML `style="..."` attributes; SVG uses presentation attributes only.
- Budgets: `styles.css <= 30,000B`, `main.js <= 15,000B`, `HTML + CSS + JS <= 1,000,000B`, each `.webp <= 200,000B`, gallery total `<= 2,500,000B`, `og-preview.jpg <= 150,000B`.
- Security & `--release` gate: reject `EXIF`/`XMP ` in WebP, `APP1` in JPEG, non-`https://` or loopback `SITE_URL`, `example.invalid`, `[PHASE 2 OWNER INPUT]`, and `data-owner-draft` markers in `--release` builds.
- Accessibility: WCAG 2.1 AA contrast (`>= 4.5:1`), `44px` minimum touch targets (`min-h-11`), monotonic `h1 -> h2 -> h3`, `prefers-reduced-motion`, zero horizontal overflow `360px`–`1440px`, full no-JS fallbacks.

## Review Focus

1. Unintentional release of sample draft copy or `example.invalid` URLs if `data-owner-draft` checks regress in `scripts/build.mjs`.
2. Corrupt `VP8L` WebP Huffman/LZ77 streams failing Chromium decode on rich `800x1200` UI mockups.
3. Sticky header overlapping anchor scroll targets (`#about`, `#stack`, `#capstone`, `#contact`) without `scroll-mt-*`.
4. Lightbox modal index wrap-around, ArrowLeft/ArrowRight handling, or stale `error` state flashing when switching slides via Next/Prev buttons.
5. Clipboard copy failure or missing `isSecureContext` leaving `[data-code-copy]` or `[data-email-copy]` broken or visible without API support.

---

### Phase A: Build Guardrails, Fixture UI Artwork & Automated Test Harness

**Files:**
- Modify: `package.json` (`"test"` script)
- Create: `tests/portfolio.test.mjs`
- Modify: `scripts/build.mjs` (`assertNoPlaceholders` + exported testable helpers)
- Modify: `scripts/create-fixtures.mjs` (Huffman + LZ77 `VP8L` UI mockup encoder + macro-block `1200x630` `JPEG` banner renderer)

**Interfaces:**
- Produces: `npm test`, exported `resolveSiteUrl`, `assertCleanWebp`, `assertCleanJpeg`, `assertNoPlaceholdersInHtml` from `scripts/build.mjs`; non-monochrome UI mockup fixtures at `./src/assets/screenshots/capstone-screen-1..3.webp` (`800x1200`) and `./src/assets/og-preview.jpg` (`1200x630`).

- [ ] **Step 1 (RED):** Add `"test": "node --test ./tests/*.test.mjs"` to `package.json` and create `tests/portfolio.test.mjs` testing: (a) `--release` helper rejects `data-owner-draft`, `[PHASE 2 OWNER INPUT]`, `example.invalid`, and loopback URLs; (b) fixture screenshots `capstone-screen-1..3.webp` are valid RIFF/VP8L, `800x1200`, `<= 200,000B`, non-monochrome (`> 1000B` rich UI pixels); (c) `og-preview.jpg` is valid baseline `SOF0` `1200x630` non-uniform banner `<= 150,000B`; (d) build metadata rejection (`EXIF` WebP / `APP1` JPEG).
- [ ] **Step 2:** Run `npm --prefix C:\Users\USER\.gemini\antigravity\scratch\portfolio test` and watch Phase A tests **FAIL** cleanly (`RED`).
- [ ] **Step 3 (GREEN):** Export pure validation functions in `scripts/build.mjs` (guiding CLI entry via `import.meta.url` realpath check) supporting `data-owner-draft` detection in `assertNoPlaceholders`, and implement Huffman + LZ77 `VP8L` UI wireframe mockup renderer + macro-block `JPEG` banner encoder in `scripts/create-fixtures.mjs`.
- [ ] **Step 4:** Regenerate fixtures (`npm run init:fixtures`), rebuild (`npm run build`), run `npm test`, and verify JPEG decode (`1200x630`) + WebP browser decode (`800x1200` + visual screenshot inspection). Only proceed to Phase B when Phase A is 100% **GREEN**.

---

### Phase B: Color System, Human Copy, Responsive Layout & Progressive UX

**Files:**
- Modify: `src/styles/input.css`
- Modify: `src/index.html`
- Modify: `src/404.html`
- Modify: `src/scripts/main.js`
- Modify: `tests/portfolio.test.mjs` (add Phase B DOM/HTML/CSP/JS interaction unit tests)

**Interfaces:**
- Consumes: `./src/assets/screenshots/capstone-screen-1..3.webp`, `./src/assets/og-preview.jpg`, CSS output `./dist/assets/styles.css`.
- Produces: Polished portfolio UI with sticky header, `scroll-mt-*` targets, human-readable `data-owner-draft` copy, upgraded inline architecture SVG, device-framed screenshot gallery, Prev/Next/Arrow/counter lightbox modal (`[data-lightbox-prev]`, `[data-lightbox-next]`, `[data-lightbox-counter]`), and progressive `[data-code-copy]` buttons.

- [ ] **Step 1 (RED):** Add automated tests in `tests/portfolio.test.mjs` verifying: (a) zero raw `[PHASE 2 OWNER INPUT]` strings in `src/index.html` while `data-owner-draft` protects placeholder prose and `example.invalid` marks placeholder links; (b) zero inline `<script>` tags or HTML `style="..."` attributes (strict CSP); (c) sticky nav target anchors have `scroll-mt-`; (d) monotonic heading hierarchy (`h1` count === `1`, no skipped heading levels); (e) external `target="_blank"` links include `rel="noopener noreferrer"`; (f) JS lightbox Prev/Next cycling, index counter update, error state clear on slide switch, and `[data-code-copy]` + `[data-email-copy]` behavior via lightweight DOM stub.
- [ ] **Step 2:** Run `npm test` and watch Phase B tests **FAIL** cleanly (`RED`).
- [ ] **Step 3 (GREEN):** Upgrade `src/styles/input.css`, `src/index.html`, `src/404.html`, and `src/scripts/main.js` cleanly with editorial typography, refined Slate/Cobalt/Teal palette (`>= 4.5:1` contrast), concise recruiter-ready prose, upgraded architecture SVG, Next/Prev/Arrow lightbox controls, and `[data-code-copy]` + `[data-email-copy]` UX.
- [ ] **Step 4:** Run `npm run build`, negative `npm run build:release`, and `npm test`. Fix every CSS/budget/test failure until Phase B is 100% **GREEN**.

---

### Phase C: Live Browser E2E, Visual Polish & Responsive Gate

- **Gate:** Phase B must be 100% **GREEN**.
- [ ] Start `preview.mjs` (`BypassSandbox: true`, `IsDaemon: true`) on `127.0.0.1:4173`.
- [ ] Verify in Chromium (`browser` subagent, `Model: "flash"`) across `1440x900`, `768x1024`, `375x812`, and `360x800`: zero console/network errors, `800x1200` mockup WebPs decoded & crisp, zero horizontal overflow, sticky nav anchor positioning, `<details>` + `[data-code-copy]`, lightbox open -> Next -> Prev -> Escape -> backdrop -> close + focus restore, `[data-email-copy]`, and `/nonexistent-route` `404` page.
- [ ] Inspect visual screenshots directly via `read_file` for spacing, alignment, contrast, typography hierarchy, and mockup legibility. Fix any defects and re-run Phases B–C until 100% **GREEN**.

---

### Phase D: Design Sync, Independent Code Review & Final Verification

- **Gate:** Phase C must be 100% **GREEN**.
- [ ] Sync `docs/designs/portfolio.md` with updated `data-owner-draft` / fixture-mockup / lightbox-controls details so architecture documentation matches implementation.
- [ ] Dispatch fresh code-reviewer subagent (`self`, using `requesting-code-review/code-reviewer.md`) against all changed/created files and requirements.
- [ ] Address every Critical and Important finding via TDD (`RED -> GREEN`), re-run FULL `npm test`, `npm run build`, negative `build:release`, and live browser check after the final edit (`verification-before-completion`).
- [ ] Report final verified state cleanly to Jay-r with clickable links to every file and evidence artifact.
