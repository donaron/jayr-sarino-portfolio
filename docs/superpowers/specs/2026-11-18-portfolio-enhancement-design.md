# Portfolio Visual, Content, and UX Enhancement Design

- **Date:** 2026-11-18
- **Base Specification:** [portfolio.md](file:///C:/Users/USER/.gemini/antigravity/scratch/portfolio/docs/designs/portfolio.md)
- **Scope:** Elevate portfolio copy, color system, visual hierarchy, sample UI media previews, accessibility, and interactive user-friendliness across Phases A–D with strict RED->GREEN gating per phase.

## Intent & Problem

The Phase 1 scaffold passes structural and build checks but presents raw placeholder brackets (`[PHASE 2 OWNER INPUT]`), stark unlayered white/slate styling, single-color flat screenshot boxes (`34` bytes), and basic modal interaction. Visitors landing on `http://127.0.0.1:4173/` see scaffold plumbing rather than a finished developer portfolio.

## Approaches Considered

1. **Minimal CSS tweak on existing HTML:** Adjust button/link colors in `index.html` while keeping `[PHASE 2 OWNER INPUT]` brackets and flat rectangles. *Rejected:* Leaves robotic copy, blank screenshot tiles, and basic UX untouched.
2. **Cohesive Editorial Design System + Real Pixel-Rendered UI Fixture Artwork + Progressive UX (`Selected`):** Rewrite all visible copy into clear, confident developer prose (shifting placeholder release-gating cleanly to `data-owner-draft` attributes + existing `example.invalid` / bracket checks in `build.mjs`), establish a high-contrast Slate/Cobalt/Teal color palette with sticky navigation and device-framed gallery cards, encode rich Material UI wireframe mockups inside pure-Node `VP8L` `WebP` (`800x1200`) and baseline `SOF0` `JPEG` (`1200x630`), and upgrade `main.js` with gallery Previous/Next/Arrow navigation (`1 / 3` counter) and progressive technical-proof copy buttons. *Selected:* Achieves a genuinely polished portfolio look while staying 100% static (`tailwindcss` + `@tailwindcss/cli` only, vanilla JS `<= 15 KB`, strict CSP, zero external fonts/runtime trackers, zero EXIF/APP1 metadata).
3. **Client-side JS templating / external UI libraries:** Add client-side markdown/template rendering or Lucide CDN bundles. *Rejected:* Violates zero-runtime-CDN, strict CSP, and no-JS fallback guarantees.

## Architecture & Constraints

- Preserve all constraints from [portfolio.md](file:///C:/Users/USER/.gemini/antigravity/scratch/portfolio/docs/designs/portfolio.md): single-page semantic `HTML5` (`h1 -> h2 -> h3`), zero inline `<script>` / `style=`, pinned `tailwindcss` + `@tailwindcss/cli` `4.3.5`, `styles.css <= 30 KB`, `main.js <= 15 KB`, `HTML + CSS + JS <= 1.0 MB`, each `.webp <= 200 KB`, `og-preview.jpg <= 150 KB`, strict RIFF/APP1 metadata rejection, `--release` safety guard (`SITE_URL` + `data-owner-draft` / `example.invalid` / `[PHASE 2 OWNER INPUT]` rejection), WCAG 2.1 AA contrast (`>= 4.5:1`), `prefers-reduced-motion`, and zero horizontal overflow (`360px`–`1440px`).
- Real user facts preserved faithfully: Jay-r Sarino, solo developer of his school capstone designed in **Google Stitch**, implemented in **Flutter & Material (`Dart`)**, backed by **Firebase Realtime Database** (NoSQL JSON + security rules), with no invented work history or metrics.
