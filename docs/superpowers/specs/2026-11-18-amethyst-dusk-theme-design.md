# Amethyst Dusk & Teal UI Theme Design (`Option 15`)

- **Author:** Jay-R Sarino / Antigravity
- **Date:** 2026-11-18
- **Status:** Proposed (Awaiting Approval)

## Intent & Scope

Apply the user-selected **Design 15 (Amethyst Dusk & Teal)** color system across [input.css](../../src/styles/input.css), [index.html](../../src/index.html), [404.html](../../src/404.html), [create-fixtures.mjs](../../scripts/create-fixtures.mjs) (`og-preview.jpg` social card), and [portfolio.md](../designs/portfolio.md), while preserving zero CSP regressions, `styles.css <= 30,000 B`, `0` horizontal overflow (`360px`–`1440px`), and WCAG 2.1 AA (`>= 4.5:1`) contrast.

## Approaches Considered & Selected Choice

1. **Inline Arbitrary Tailwind Hex Classes (`bg-[#0f0720]` everywhere):** Fast per element, but generates repeated utility CSS rules when mixing `#0f0720`, `#1b1035`, and `#140b29` tints, risking the `<= 30,000 B` compiled stylesheet ceiling (`29,570 B` currently).
2. **Dark-Surface Components in `input.css` + Standard Tailwind v4 Utilities (`Selected`):** Define compact reusable dark surface/border classes in `@layer components` of `src/styles/input.css` (`--page`, `--card`, `--tile`, `.hero-backdrop`) paired with Tailwind built-in `violet-*`, `fuchsia-*`, and `teal-*` utilities (`text-violet-50`, `text-violet-200`, `bg-fuchsia-400 text-slate-950`, `text-teal-300`). Keeps `styles.css` well under `30,000 B` with exact Design 15 colors and zero inline styles.

## Color & Contrast Spec (Verified WCAG AA `>= 7.2:1` on All UI Ink)

| Surface / Role | Value | Foreground / Paired Color | Measured Contrast |
| --- | --- | --- | --- |
| Page Canvas | `#0f0720` | `#f5f3ff` (`violet-50`) / `#ddd6fe` (`violet-200`) | `17.87:1` / `14.11:1` |
| Main Section Cards & Dialog | `#1b1035` (`border: #4c1d95`) | `#f5f3ff` / `#ddd6fe` / `#e879f9` / `#5eead4` | `16.34:1` / `12.90:1` / `7.28:1` / `12.11:1` |
| Recessed Info / Stack Tiles | `#140b29` (`border: #3b1764`) | `#c4b5fd` (`violet-300`) / `#2dd4bf` (`teal-400`) | `10.25:1` / `10.17:1` |
| Primary CTA Button | `#e879f9` (`fuchsia-400`, hover `#f0abfc`) | `#0f0720` dark ink | `7.96:1` (`11.14:1` hover) |
| Primary / Role Badges | `#4a044e` (`fuchsia-950`) | `#f5d0fe` (`fuchsia-200`) | `10.81:1` |
| Secondary Cloud / IoT Badges | `#042f2e` (`teal-950`) | `#99f6e4` (`teal-200`) | `11.48:1` |
| Tanod Security Badge | `#4c0519` (`rose-950`) | `#fecdd3` (`rose-200`) | `11.08:1` |
| Contact Band (`#contact`) | `#2e1065` (`violet-950`, border `#7c3aed`) | `#ddd6fe` / `#5eead4` + `#e879f9` primary CTA | `10.97:1` / `10.30:1` |
| Keyboard Focus Ring | `2px solid #5eead4` | On `#0f0720` / `#1b1035` | `13.25:1` |

## Cross-Asset Updates

- **System Architecture SVG (`viewBox="0 0 760 208"`):** Dark elevated cards (`#140b29` / `#1b1035` / `#2e1065`), glowing accessible strokes (`#7c3aed`, `#e879f9`, `#2dd4bf`), crisp `#f5f3ff` / `#ddd6fe` SVG typography.
- **UI Preview Gallery & `og-preview.jpg`:** Update [create-fixtures.mjs](../../scripts/create-fixtures.mjs) so `og-preview.jpg` uses the `#0f0720` / `#2e1065` / `#e879f9` / `#2dd4bf` palette, while the 3 Android app screens (`capstone-screen-1..3.webp`) remain crisp Material app UI captures framed inside `#241447` card trays.
- **Remaining Pending `--release` Items (Unchanged):** `Resume / CV` (`example.invalid/cv`), `LinkedIn Profile` (`example.invalid/linkedin`), and `data-owner-draft` markers remain active so `--release` stays protected until real assets/links are supplied.
