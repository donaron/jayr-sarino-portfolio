# Amethyst Dusk & Teal UI Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved Design 15 (Amethyst Dusk & Teal) color system cleanly across `src/styles/input.css`, `src/index.html`, `src/404.html`, `scripts/create-fixtures.mjs` (`og-preview.jpg`), and `docs/designs/portfolio.md` with verified contrast and green E2E + code review gates.

**Architecture:** Use compact reusable dark surface/border classes (`.card-dusk`, `.tile-dusk`, `.band-dusk`, `.tray-dusk`, `.code-dusk`) in `@layer components` of `src/styles/input.css` paired with Tailwind v4 `violet-*`, `fuchsia-*`, `teal-*`, and `rose-*` utilities, keeping compiled CSS `<= 30,000 B` and eliminating inline styles/CSP violations. Enforce TDD RED -> GREEN per task, chrome visual inspection, and independent `pro` Senior Code Review before final sign-off.

**Tech Stack:** HTML5, Tailwind CSS v4 (`@tailwindcss/cli` 4.3.5), Progressive Vanilla JS, Node.js test runner, Headless Chrome CDP.

**Spec:** [2026-11-18-amethyst-dusk-theme-design.md](../specs/2026-11-18-amethyst-dusk-theme-design.md)

## Global Constraints

- Compiled `styles.css <= 30,000 B`; `main.js <= 15,000 B`; `landingTotal <= 1,000,000 B`; `og-preview.jpg <= 150,000 B`; `capstone-screen-1..3.webp <= 200,000 B` each.
- Strict CSP (`default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com`): zero inline `<style>`, zero `style=`, zero inline `<script>`.
- WCAG 2.1 AA contrast `>= 4.5:1` (`>= 7.2:1` on primary Dusk surfaces/buttons/focus rings) and `0` horizontal overflow across `360px`–`1440px`.
- Retain `data-owner-draft` (`3` gallery `<figure>` cards + `2` representative `<pre>` snippets) and remaining `example.invalid` (`cv`, `linkedin`) release guards until owner provides real links/assets.

## Review Focus

- Stray light-mode utility leftovers (`bg-white`, `bg-slate-50`, `text-slate-900`, SVG dark fill `#0f172a` on `#1b1035`) causing invisible ink on dark cards.
- Contrast regression on inline code chips (`<code>`), `<summary>` focus outlines, lightbox modal surfaces (`<dialog>`), and `[data-lightbox-error]` fallback box inside `<dialog>`.
- Arbitrary utility bloat pushing `styles.css` above `30,000 B` (caught by `styles.css` TDD budget assertion).
- Lightbox thumbnail trays failing to frame light Android screens cleanly on dark `#1b1035` cards.
- JPEG `og-preview.jpg` banner macroblocks preserving clean SOF0 encoding with zero `APP1..APP15`/`COM` markers.

---

### Task 1: Design 15 Theme Contract & Regression Tests (RED -> GREEN Foundation)

**Files:**
- Modify: `tests/portfolio.test.mjs`
- Target: `src/styles/input.css`, `src/index.html`, `src/404.html`, `scripts/create-fixtures.mjs`, `docs/designs/portfolio.md`

- [ ] **Step 1: Add failing `Phase 3 (Design 15)` tests to `tests/portfolio.test.mjs`**
  Assert:
  1. `src/styles/input.css` uses `#0f0720` page background, `#f5f3ff` text, `#5eead4` focus outline, and defines `.card-dusk`, `.tile-dusk`, `.band-dusk`, `.tray-dusk`, `.code-dusk`.
  2. `src/index.html` and `src/404.html` use dark Amethyst Dusk classes (`card-dusk`, `tile-dusk`, `bg-fuchsia-400`, `text-violet-50`, `#4c1d95` / `#1b1035` SVG theme) with zero unstyled light card/body backgrounds (`bg-slate-50`, `bg-white` outside gallery `<img>` inner app frame `img class="... bg-white"`, SVG `#0f172a` title text).
  3. `src/assets/og-preview.jpg` decodes via Node JPEG check & Chrome pixel check with `#0f0720` (`[15, 7, 32]`) outer canvas and `[232, 121, 249]` top accent band (within JPEG chroma/luma tolerance).
  4. `docs/designs/portfolio.md` documents the `Amethyst Dusk` dark `#0f0720` / `#e879f9` / `#2dd4bf` palette cleanly (no stale `#f8fafc` / `#1d4ed8` base theme claims).
- [ ] **Step 2: Run `npm test` to confirm RED (`fail`)**

---

### Task 2: Restyle CSS Base, Components, `og-preview.jpg`, HTML, SVG, & Design Spec (GREEN)

**Files:**
- Modify: `src/styles/input.css`
- Modify: `scripts/create-fixtures.mjs` (`renderOgBannerJpeg` palette only, keeping 3 mobile app captures crisp Material UI inside dusk trays)
- Modify: `src/404.html`
- Modify: `src/index.html` (header, `#about`, `#stack`, `#capstone` 5 apps + SVG + trade-offs + `<details>` + gallery + `#contact` + `<footer>` + `<dialog>`)
- Modify: `docs/designs/portfolio.md`

- [ ] **Step 1: Update `src/styles/input.css` with `#0f0720` base, `#5eead4` focus ring, `.hero-backdrop` dusk radial glow, and `.card-dusk`/`.tile-dusk`/`.band-dusk`/`.tray-dusk`/`.code-dusk` component rules.**
- [ ] **Step 2: Update `renderOgBannerJpeg` in `scripts/create-fixtures.mjs` and run `npm run init:fixtures`.**
- [ ] **Step 3: Update `src/404.html`, `src/index.html` (including dark-mode inline SVG and dark `<dialog>` modal), and `docs/designs/portfolio.md`.**
- [ ] **Step 4: Run `npm run build`, `npm test`, and negative `npm run build:release`; verify ALL pass cleanly (`CSS <= 30,000 B`, `13/13` passing, `--release` exit `1`).**

---

### Task 3: Visual E2E Audit & Fresh Senior Code Review Gate

**Files:**
- Run: `scratch/e2e_phaseC.mjs` & `scratch/verify_phaseA_chrome.mjs`
- Inspect: All rendered PNGs across desktop/tablet/mobile/SVG/lightbox/contact

- [ ] **Step 1: Run `verify_phaseA_chrome.mjs` (updated if needed for `#0f0720`/`#e879f9` OG check) and `e2e_phaseC.mjs` against live `http://127.0.0.1:4173`.**
- [ ] **Step 2: Visually inspect `phaseA_visual.png`, `phaseC_v2_hero_stack.png`, `phaseC_v2_5apps.png`, `phaseC_v2_arch_details.png`, `phaseC_v2_contact_footer.png`, `phaseC_v2_lightbox.png`, `phaseC_v2_mobile_360.png`, `phaseC_v2_tablet_768.png`.**
- [ ] **Step 3: Dispatch fresh read-only `self` Senior Code Reviewer (`Model: "pro"`) to audit contrast, SVG legibility, CSS budget, and HTML/test integrity; fix any findings via TDD and re-verify before final report.**
