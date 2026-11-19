# Jay-R Sarino Personal Portfolio Website

*   **Author:** Jay-R Sarino
*   **Status:** Approved
*   **Date:** 2026-11-15

--------------------------------------------------------------------------------

## Overview

Jay-R Sarino needs a free, publicly shareable personal portfolio website presenting his background ("About Me"), his technical skills, a case study of his solo-coded school capstone project, an external read-only CV/resume link, and contact options via hyperlinked social accounts plus a revocable portfolio email alias (`mailto:` link and progressive copy button). The site will be built from static `HTML5`, compiled `Tailwind CSS` via pinned `Node.js`/`npm` scripts, and progressive-enhancement vanilla `JavaScript` (`<= 15 KB`), verified locally over HTTP (`npm run preview`) and deployed to **Cloudflare Pages (Free)**.

Version one uses a **neutral personal profile** framing suited for any recipient (recruiters, collaborators, or prospective clients), keeping the runtime static without backend servers, databases, accounts, or contact-form APIs.

## The Problem

When Jay-R shares his profile link today, there is no single destination under his control that explains what he builds and presents concrete evidence of his capstone software. Three constraints make a generic template or multi-card grid unsuitable:

1. **Single-project inventory:** Jay-R has one completed software project—the five-app **Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication** built for **Barangay II Población, Pontevedra, Negros Occidental**—backed by draft UI previews, with no live demo URL and no public GitHub repository (raw project files sit privately on Google Drive and contain keys, configs, and academic documents). Placing one project inside a multi-card grid makes the site look incomplete.
2. **Credibility gap between prototype and solo full-stack code:** Jay-R used **Google Stitch** for UI prototyping, **Flutter** with Material (`Dart`) for the five role-based Android clients, and **Cloud Firestore** (alongside **Firebase Authentication (RBAC)**, **Firebase Cloud Storage**, **Firebase Cloud Messaging (FCM)**, **Google Maps API & Android GPS**, and a **Rule-Based Validation Engine**) for backend storage and real-time sync, writing all application source code himself excluding academic papers. Without separating the Stitch UI prototype from the hand-coded Dart apps and Cloud Firestore rules—and backing previews with scrubbed code/rule evidence—flat UI images resemble unimplemented mockups and do not show backend engineering.
3. **Hosting constraints and social login walls:** Free hosts such as Vercel Hobby prohibit commercial/freelance promotion, while Firebase Hosting Spark enforces a `360 MB/day` hard cutoff (`HTTP 509`/`429`) with no request logs. In addition, relying solely on social profile links blocks recipients who are signed out or behind corporate network walls.

## Goals

*   Deliver a single-page static portfolio (`HTML5`, compiled `Tailwind CSS` via pinned `npm` scripts, progressive-enhancement vanilla `JavaScript <= 15 KB`) that renders on mobile (`360px`, `375px`) and desktop (`1440px`) viewports without broken assets or horizontal overflow.
*   Present four scannable sections: **About Me**, **Tech Stack** (separating portfolio web tools from capstone tools: `Google Stitch`, `Flutter`, `Material`, `Dart`, `Firebase Authentication`, `Cloud Firestore`, `Firebase Cloud Storage`, `Firebase Cloud Messaging`, `Google Maps`, `Rule-Based Validation`), **Featured Capstone Case Study**, and **Contact** (hyperlinked social accounts, external read-only CV link, and revocable-alias `mailto:` link with a separate copy-to-clipboard button).
*   Present the solo capstone in a full-width case study covering the five role-based Android apps (`Resident Mobile App`, `Barangay Admin App`, `Tanod Admin App`, `Tanod / Field Patroller App`, `Healthcare Admin App`), an inline SVG architecture diagram, attribution separating Google Stitch prototyping from hand-written Dart frontend and Cloud Firestore backend work, scrubbed `Cloud Firestore` (`firestore.rules`) and `Dart` excerpts inside `<details>`, and sanitized, metadata-stripped `WebP` screenshots—without placeholder cards or unredacted Drive archive links.
*   Publish `./dist/` to **Cloudflare Pages (Free)** after local HTTP verification (`npm run preview`, never `file://`), owner inspection, and release URL validation (`npm run build:release`).
*   Ensure core bio, stack, case study, `<details>` technical proof, full-image links, external CV link, outbound social links, and `mailto:` contact remain readable and functional when JavaScript is disabled.

## Non-Goals

*   Building or rendering the portfolio website using Flutter Web (`Dart`).
*   Hosting a backend server, database, user login system, blog/CMS, or server-side contact form API.
*   Linking raw Google Drive project folders or archives publicly from the portfolio page.
*   Hosting self-contained PDFs, videos, or APK downloads inside `./dist/` (CV stays an external read-only URL).
*   Publishing the owner's primary personal inbox in HTML or bundling third-party client-side tracking scripts (relying only on Cloudflare Web Analytics page-view telemetry).
*   Using TypeScript, React, Next.js, or runtime CSS CDN scripts (such as Tailwind Play CDN).
*   Adding placeholder "Coming Soon" cards for future projects.

## Open Questions

*   **Question 1 (Hosting Provider) — Resolved:** Committed to **Cloudflare Pages (Free)** (unmetered static bandwidth, commercial portfolios allowed excluding direct payment collection, private repository support, built-in cookieless analytics; excludes `Firebase Hosting Spark` `360 MB/day` cutoff and `GitHub Pages` public-repo/non-commercial rules; see [Alternative I](#alternative-i-free-hosting-tiers-with-commercial-restrictions-or-hard-daily-caps-vercel-hobby-github-pages-firebase-spark-vs-cloudflare-pages)).
*   **Phase 2 Owner Content Handoff — Complete (`--release` Ready):** Core developer bio, portrait photo (`/assets/jayr-sarino.webp`), bundled CV (`/assets/jayr-sarino-cv.pdf`), client location (**Barangay II Población, Pontevedra, Negros Occidental**), five-app breakdown, **Cloud Firestore** architecture, scrubbed representative `firestore.rules` and `incident_repository.dart` code blocks, GitHub (`https://github.com/donaron`), contact Gmail (`Aronsarino435@gmail.com`), both verified certificates, and all six BarangayConnect WebP dashboard previews (`01-main-gate-dashboard.webp` through `06-tanod-field-dashboard.webp`) are finalized with LinkedIn and all placeholder/`data-owner-draft` markers removed. `vercel.json` configures static `./dist/` output, `cleanUrls`, security CSP, and cache headers for Vercel deployments alongside `_headers` for Cloudflare Pages.

## Critical User Journeys (CUJs)

### CUJ 1: Shared-Link Visitor Evaluating Background and Capstone Proof

*   **Given:** A visitor opens Jay-R's public portfolio URL on a mobile or desktop browser.
*   **When:** They scan About Me, Tech Stack, and the Featured Capstone Case Study.
*   **Then:** In under one minute, they understand Jay-R's technologies, see how his Google Stitch UI prototype, five Material Dart apps, GPS/rule-validation modules, and Cloud Firestore + FCM backend connect (including scrubbed `firestore.rules`/Dart evidence inside `<details>`), and locate his CV and contact links.

### CUJ 2: Visitor Inspecting Screenshots Without Heavy Upfront Transfer or JS Lock-In

*   **Given:** The landing view renders compressed, metadata-stripped, dimension-fixed `WebP` previews (`<= 200 KB` each, `loading="lazy"`) alongside text content.
*   **When:** A visitor selects a screenshot to inspect interface details (with JavaScript enabled or disabled).
*   **Then:** With JavaScript active, a focus-managed `<dialog>` modal opens on demand with `Esc`, close-button, and backdrop dismissal; with JavaScript disabled, the enclosing `<a href>` opens the full-resolution `WebP` image in the browser without consuming unneeded upfront image bytes for skimmers.

### CUJ 3: Visitor Reaching Out via Social Links, External CV, or Email Alias

*   **Given:** A visitor chooses to contact Jay-R or inspect his profiles and CV.
*   **When:** They select a social profile link, open the external CV link, click the `mailto:` email link, or click the progressive `"Copy Email"` button.
*   **Then:** Social and CV links open in a new tab with `rel="noopener noreferrer"` (`noreferrer` / `noopener` isolation), `mailto:` works with zero JavaScript using a revocable portfolio alias, and clicking `"Copy Email"` writes the alias to the clipboard with live inline status feedback without triggering unwanted mail-client navigation.

### CUJ 4: Phased Build, Local Verification, and Staging Release

*   **Given:** Author source files sit in `C:\Users\USER\.gemini\antigravity\scratch\portfolio\src\`.
*   **When:** Jay-R runs `npm run build` and inspects `npm run preview` (`http://127.0.0.1:4173`) across desktop and mobile viewports (with JS on and off), then builds with the production Cloudflare origin (`$env:SITE_URL="https://..."; npm run build:release` in PowerShell or `SITE_URL=https://... npm run build:release` in POSIX shells) after Phase 2 asset replacement.
*   **Then:** Automated build checks verify lowercase disk casing and absence of `EXIF`/`XMP` metadata, manual DevTools/Lighthouse checks confirm visual quality and `>= 95` scores, and a staging Cloudflare Pages preview validates `curl -I` response headers and incognito link behavior before production release.

## Technical Plan (Architecture)

### 1. Build Pipeline & Source-to-Output Separation

The project maintains an explicit boundary between authored sources (`./src/`) and deployable output (`./dist/`), compiled through pinned `npm` scripts without bespoke HTML templating, custom filename hashing, DIY JS regex minifiers, `sitemap.xml`, or non-deterministic wall-clock build tags:

*   **CSS Compilation:** `@tailwindcss/cli` compiles `./src/styles/input.css` against `./src/index.html` and `./src/404.html` into `./dist/assets/styles.css` (`--minify`), avoiding runtime Tailwind CDN scripts.
*   **Single Origin Parameter (`SITE_URL`):** `index.html` is authored directly as the sole HTML source of truth; the build script substitutes the site origin token into canonical and Open Graph references (defaulting to `http://127.0.0.1:4173` for local builds, and failing `--release` builds if placeholder markers remain or if the URL is non-`https://`).
*   **Portable Root-Relative Paths & Casing Parity:** All internal styles, scripts, and assets use root-relative `/assets/...` paths and lowercase hyphenated filenames verified against case-sensitive directory listings, keeping `404.html` functional on nested missing routes and Windows previews consistent with Linux edge hosts (subpath project hosting is excluded).
*   **Local Static Preview Server:** A lightweight Node HTTP static server (`npm run preview` on `127.0.0.1:4173`) serves `./dist/` with proper MIME types and HTTP `404` error-page routing (avoiding `file://` path issues).

```text
+--------------------------------+   npm run build    +------------------------------+
| Authored Source (src/)         | -----------------> | Deploy Root (dist/)          |
| - index.html, 404.html         |  1. Validate case  | - index.html, 404.html       |
| - robots.txt, _headers         |     & RIFF EXIF    | - robots.txt, _headers       |
| - styles/input.css             |  2. Tailwind CLI   | - assets/styles.css          |
| - scripts/main.js              |  3. Inject SITE_URL| - assets/main.js             |
| - assets/screenshots/*.webp    |  4. Assert budgets | - assets/screenshots/*.webp  |
| - assets/og-preview.jpg        |                    | - assets/og-preview.jpg      |
+--------------------------------+                    +--------------+---------------+
                                                                     |
                                     npm run preview                 | npm run build:release
                                     (Local HTTP + DevTools)         | + wrangler pages deploy
                                                                     v
                                                      +--------------+---------------+
                                                      | Cloudflare Pages (Free)      |
                                                      | Atomic deploy, edge headers, |
                                                      | cookieless Web Analytics     |
                                                      +------------------------------+
```

### 2. Single-Page Document & Capstone Case Study Structure

The site ships as one semantic `HTML5` document (`h1 -> h2 -> h3 -> h4`) using the system sans-serif font stack and inline SVGs for diagrams/icons:

*   **Section 1 — Hero & About Me:** Presents owner name, neutral summary, external CV link, and jump links to the Capstone Case Study and Contact sections.
*   **Section 2 — Tech Stack (Separated by Context):** Groups technologies into *Capstone Ecosystem Stack* (`Google Stitch`, `Flutter`, `Material`, `Dart`, `Firebase Authentication`, `Cloud Firestore`, `Firebase Cloud Storage`, `Firebase Cloud Messaging`, `Google Maps API & GPS`, `Rule-Based Validation Engine`) and *Portfolio Build Stack* (`HTML5`, `Tailwind CSS`, `JavaScript`).
*   **Section 3 — Featured Capstone Case Study:** Full-width layout covering **Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication** (**Barangay II Población, Pontevedra, Negros Occidental**) organized into six sub-blocks:
    1. *Problem & Scope Ownership:* Summarizes the problem solved and states Jay-R authored all software across the five roles excluding academic papers, distinguishing Google Stitch prototyping from hand-written Dart UI/state and Cloud Firestore work.
    2. *Five Role-Based Mobile Applications:* Details the `Resident Mobile App`, `Barangay Admin App`, `Tanod Admin (Security Administrator) App`, `Tanod / Field Patroller App`, and `Healthcare Admin App`.
    3. *System Architecture Diagram (Inline SVG):* Visualizes data flow (`Google Stitch & Rule-Based Validation -> Five Flutter (Dart) Clients + Google Maps/GPS <-> Firebase Auth, Cloud Firestore, Cloud Storage & FCM`).
    4. *Engineering Trade-Offs & Scrubbed Proof Slice (Required):* Explains RBAC authorization, rule-based report validation, and snapshot stream trade-offs paired with collapsible `<details>` disclosures containing scrubbed Cloud Firestore `firestore.rules` and a representative Dart `FirebaseFirestore` stream repository snippet.
    5. *Proof Availability Note:* States that full source remains private to protect keys and academic documents, pointing readers to the visual gallery and scrubbed snippets.
    6. *Annotated Screenshot Gallery:* Lazy-loaded single-file `WebP` previews (`Resident Mobile App`, `Tanod Command & Live GPS`, `Healthcare Admin Portal`) with visible captions and explicit dimensions; clicking opens the `<dialog>` viewer when JS runs or navigates directly via native link otherwise.
*   **Section 4 — Contact:** Hyperlinked social profiles (`rel="noopener noreferrer"`), external CV link, visible revocable-alias `mailto:` link, and progressive-enhancement copy-email button with status live region.

### 3. Media Optimization & Payload Budgets

Every screenshot passes both manual pixel PII redaction (removing student IDs, personal emails, Firebase configs/URLs) and an automated build-time binary check rejecting `EXIF`, `XMP`, or `APP1` metadata chunks before emission to `./dist/`:

| Asset / Scope | Maximum Budget | Enforcement Mechanism |
| --- | --- | --- |
| Initial landing payload (HTML + compiled CSS + vanilla JS) | `<= 1.0 MB` (single cap) | Inline SVGs, system font stack, below-the-fold `loading="lazy"`, build check |
| Compiled Tailwind CSS (`styles.css`) | `<= 30 KB` (minified bytes on disk) | `@tailwindcss/cli --minify` + build byte check |
| Vanilla JavaScript (`main.js`) | `<= 15 KB` (unminified bytes on disk) | Compact lightbox + clipboard helpers; zero third-party JS dependencies |
| Individual capstone screenshot (`.webp`) | `<= 200 KB` each (single WebP per shot) | Build byte check + RIFF `EXIF`/`XMP` chunk rejection |
| Full case study gallery (total expanded) | `<= 2.5 MB` | On-demand image viewing; cumulative asset size assertion |
| Open Graph banner (`og-preview.jpg`, `1200x630`) | `<= 150 KB` | Compressed `.jpg` for broad social/messaging crawler compatibility |

### 4. Minimal Progressive-Enhancement JavaScript Contract

Interactive behaviors enhance semantic HTML without gating core content or links behind JavaScript execution:

| Interaction Area | JavaScript-Enhanced Behavior | No-JS Fallback State |
| --- | --- | --- |
| Header Navigation | Zero JS used; wrapping flex links remain visible at `360px`–`1440px`. | Identical static navigation bar. |
| Screenshot Inspection | Intercepts link click, populates `<dialog>` modal image/caption/error state on demand, binds `Esc`, close button, and backdrop dismissal, and restores focus. | Enclosing `<a href>` opens the full `WebP` image in browser. |
| Contact Email & Code Copy | Reveals initially `hidden` `[data-email-copy]` and `[data-code-copy]` buttons only after verifying a secure context and browser Clipboard API support; copies the alias or snippet and updates live status text without triggering `mailto:`. | Copy buttons stay `hidden`; readable revocable-alias `<a href="mailto:...">`, `<details>` code blocks, social links, and CV link remain active. |

### 5. Cloudflare Pages Edge Config, Analytics & Rollback Boundary

*   **Publish-Root Headers (`./dist/_headers`):** Copied to the deploy output root so Cloudflare Pages enforces all policies:
    *   `/` and `/*.html`: `Cache-Control: max-age=0, must-revalidate`
    *   `/assets/*.css` and `/assets/*.js`: `Cache-Control: public, max-age=3600, must-revalidate` (revalidates alongside Cloudflare atomic deploys since filenames are unhashed)
    *   `/assets/screenshots/*` and `/assets/og-preview.jpg`: `Cache-Control: public, max-age=604800`
    *   Global baseline security headers (`/*`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`
*   **Host-Level Telemetry Boundary:** Uses Cloudflare Web Analytics (cookieless page-view beacon enabled explicitly in CSP above) with zero third-party ad/outbound click trackers.
*   **Staging Preview & Rollback:** Production releases verify an isolated `wrangler pages` preview URL (`curl -I` security/cache headers + incognito social/CV checks) and confirm Cloudflare Pages single-step deployment rollback (target completion `< 2 minutes`).

## Alternatives Considered

### Alternative A: Flutter Web (Dart) for Portfolio UI Rendering

*   **Pros:** Reuses Jay-R's Flutter/Dart capstone framework directly.
*   **Cons:** Ships multi-megabyte CanvasKit/WASM/JS payloads and canvas rendering that degrade mobile startup times, break native text selection, and impair search crawling.
*   **Reason for Rejection:** A canvas SPA trades fast document reading and native SEO/accessibility for runtime overhead suited to app UIs, not a four-section static profile.

### Alternative B: TypeScript, JS Frameworks (React / Next.js), and Custom Contact Backend

*   **Pros:** Component abstractions, type checking, and server-side contact endpoints.
*   **Cons:** Introduces heavy framework toolchains and container sleep/database/spam liabilities for static content with no mutable user state.
*   **Reason for Rejection:** Static `HTML5` with `mailto:` and social links delivers the full user journey without framework boilerplate or backend upkeep.

### Alternative C: Pure Unstyled/Manual CSS (Zero Node Tooling) vs. No-Code Builders (Notion / Carrd)

*   **Pros:** Zero `package.json` or build commands for plain CSS; visual drag-and-drop speed for no-code builders.
*   **Cons:** No-code hosts inject platform branding and limit semantic layout/header control; hand-maintaining raw CSS utility classes slows responsive card/typography authoring across breakpoints without CSS purging. (Note: `<dialog>` lightboxes and clipboard helpers are native browser capabilities independent of Tailwind.)
*   **Reason for Rejection:** Compiling Tailwind CSS via `@tailwindcss/cli` streamlines responsive styling with two devDependencies while keeping HTML and JS minimal and self-authored.

### Alternative D: Custom JS Bundler / Asset Hasher / Playwright Suite vs. Lean CLI Pipeline (`Selected`)

*   **Pros:** Custom HTML templating (`site.config.json`), SHA-256 asset hashing, `Vite`/`esbuild` minification, and automated Chromium Playwright runs catch regressions headlessly across builds.
*   **Cons:** Adding a custom Node templater/minifier, `playwright` (`hundreds of MB` of browser binaries), and duplicated image-pair pipelines creates substantial setup, bug surface, and dependency weight for a single static HTML file updated infrequently.
*   **Reason for Rejection:** Direct `index.html` authoring, `@tailwindcss/cli --minify`, a minimal Node static preview + RIFF/budget build script, and browser DevTools + Lighthouse checks deliver equivalent verification with minimal tooling.

### Alternative E: Public Google Drive Link for Capstone Source Code

*   **Pros:** Zero extra asset prep beyond sharing an existing Drive folder.
*   **Cons:** Raw academic archives risk exposing `google-services.json`, Cloud Firestore project IDs, API keys, and team coursework; Drive folder views require navigation/downloads and fail completely if link permissions revert to Restricted.
*   **Reason for Rejection:** Public proof belongs on-page inside sanitized screenshots, an inline SVG diagram, and scrubbed `<details>` code/schema slices rather than unredacted Drive shares.

### Alternative F: Base64 JS Email Obfuscation vs. Social-Only Links vs. Revocable Email Alias (`Selected`)

*   **Pros:** Social-only links need no email UI; Base64 JS encoding keeps raw `@` out of initial HTML source.
*   **Cons:** Social-only links block unauthenticated corporate visitors; Base64 email payloads fail when JS is disabled, hide the address from visitors, couple `mailto:` with clipboard writes, and are easily decoded by JS/Base64 scrapers.
*   **Reason for Rejection:** A revocable portfolio alias (`<a href="mailto:...">` + separate progressive copy button) works with zero JS while isolating spam defense at the alias boundary.

### Alternative G: Third-Party Outbound Click Tracking (Umami / GoatCounter) vs. Zero Telemetry

*   **Pros:** Third-party scripts log per-link events; zero telemetry removes CSP script allowances completely.
*   **Cons:** External tracking scripts add cross-origin requests and are blocked by privacy extensions; zero telemetry leaves even basic page traffic unmeasured.
*   **Reason for Rejection:** Cloudflare's built-in cookieless page-view analytics balances basic traffic visibility with minimal external footprint.

### Alternative H: Self-Hosted Compressed PDF CV (`cv.pdf`) vs. Omitting CV

*   **Pros:** Self-hosting a `~50–150 KB` `cv.pdf` avoids third-party firewall blocks; omitting CV removes link checks.
*   **Cons:** Bundling `cv.pdf` requires running a portfolio build and redeploying `./dist/` whenever resume edits occur; omitting a CV prevents recruiters from scanning credentials immediately.
*   **Reason for Rejection:** Linking an external read-only CV URL decouples resume revisions from website deployments (paired with incognito/HTTP availability checks in `Risks & Limits`).

### Alternative I: Free Hosting Tiers With Commercial Restrictions or Hard Daily Caps (Vercel Hobby, GitHub Pages, Firebase Spark vs. Cloudflare Pages)

*   **Pros:**
    *   *Vercel Hobby:* Simple Git deploys and edge network.
    *   *GitHub Pages:* Built into GitHub (`100 GB/month` soft cap).
    *   *Firebase Hosting Spark:* Commercial portfolios permitted (`10 GB` storage), Firebase CLI familiarity.
    *   *Cloudflare Pages:* Unmetered static bandwidth, private repository deploys, commercial portfolios permitted (excluding direct card payments), built-in cookieless analytics, automatic `_headers` and preview URLs.
*   **Cons:**
    *   *Vercel Hobby:* Prohibits commercial or freelance portfolio promotion under Terms of Service.
    *   *GitHub Pages:* Requires public repositories on Free plans and prohibits commercial hosting under Acceptable Use Policies.
    *   *Firebase Hosting Spark:* Enforces a `360 MB/day` hard shutdown (`HTTP 509`/`429`) when exceeded—taking screenshots offline after ~75–100 visits—with no Spark request logs without upgrading to Blaze.
    *   *Cloudflare Pages:* Requires managing a Cloudflare account, uses platform-specific `_headers` syntax inside `./dist/`, and limits free plans to `500` builds/month and `25 MiB` per file.
*   **Reason for Rejection / Current Decision:** **Cloudflare Pages (Free)** is selected as the planned host; Vercel Hobby (non-commercial ToS), GitHub Pages (public repo/non-commercial AUP and subpath risk), and Firebase Hosting Spark (`360 MB/day` hard shutdown without logs) are rejected.

## Risks & Limits

*   **Screenshot PII / Credential Exposure:** Manual exports from Flutter or Firebase consoles can include API keys, Cloud Firestore project config, resident PII, or test user data. *Mitigation:* Build script automatically rejects images containing `EXIF`/`XMP`/`APP1` metadata headers, paired with a mandatory pre-publish owner pixel review before `--release`.
*   **External CV Link Rot or Corporate Blocking:** External Drive/cloud resume URLs can break after file replacement, revert to login-gated permissions, or be blocked by corporate proxies. *Mitigation:* Pre-publish incognito browser + `Content-Type` verification and email alias availability in `#contact` for direct CV requests.
*   **Email Alias Spam:** A plaintext `mailto:` alias in HTML can be scraped by crawlers. *Mitigation:* Address uses a dedicated revocable alias rather than Jay-R's primary personal inbox, allowing instant alias rotation without code refactoring.
*   **Clipboard API Restriction:** `navigator.clipboard.writeText()` rejects or is undefined on non-HTTPS preview IPs (`http://192.168.x.x`) or denied browser contexts. *Mitigation:* Copy button stays `hidden` unless `window.isSecureContext && navigator.clipboard?.writeText` succeed, catches async errors with clear status text, and keeps standard `mailto:` always active.
*   **Static Asset Cache Staleness:** Without hashed asset filenames, long `immutable` TTLs would serve stale CSS/JS across edits. *Mitigation:* Short `max-age=3600, must-revalidate` headers on `/assets/*.css` and `/assets/*.js` combined with `max-age=0, must-revalidate` on HTML and Cloudflare atomic deploy edge invalidation.
*   **Social Card & Path Portability Limits:** `.webp` `og:image` targets fail on some social scrapers, and root-relative `/assets/...` breaks on subpath hosting. *Mitigation:* Fixed `og-preview.jpg` (`1200x630`) for Open Graph metadata and domain-root deployment on Cloudflare Pages (`*.pages.dev` or custom root domain).

## Non-Functional Requirements

*   **Security & Privacy:** Automated check forbids `EXIF`/`XMP`/`APP1` metadata in published media; external links enforce `target="_blank" rel="noopener noreferrer"` and pass release-time incognito public-read verification; Cloudflare `_headers` sets CSP, `nosniff`, `DENY`, and `strict-origin-when-cross-origin`.
*   **Accessibility (`WCAG 2.1 AA`):** Monotonic headings (`h1 -> h2 -> h3 -> h4`), text/link contrast `>= 4.5:1`, visible `:focus-visible` rings, `width`/`height` on all `<img>` tags (`CLS <= 0.05`), `<dialog>` focus restoration, and `@media (prefers-reduced-motion: reduce)` handling.
*   **Performance & Verification:** Landing HTML + CSS + JS payload `<= 1.0 MB`, minified CSS `<= 30 KB`, unminified JS `<= 15 KB`, individual screenshots `<= 200 KB WebP`, gallery total `<= 2.5 MB`, `og-preview.jpg <= 150 KB`; mobile & desktop Lighthouse targets `>= 95` across all categories.
*   **Environment Parity & Release Target:** Case-sensitive `fs.readdirSync` verification guarantees Windows-to-Linux parity; post-Phase-2 staging deploy confirms `curl -I` headers and verifies Cloudflare Pages rollback procedure against a `< 2 minute` target.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

All paths below are relative to repository root `C:\Users\USER\.gemini\antigravity\scratch\portfolio\`. Authoring and verification execute across three incremental phases so the build and UI contract pass locally with fixture data in Phase 1 before owner assets and Cloudflare release run in Phases 2–3.

### Target Scope & File Boundary

1. `./package.json` & `./package-lock.json` (`Create`):
   * Set `"type": "module"` and `"engines": { "node": ">=20.11.0" }`.
   * Install `tailwindcss` and `@tailwindcss/cli` (`v4`) using `npm install -D --save-exact tailwindcss @tailwindcss/cli` so `package.json` and `package-lock.json` pin resolved semver strings with zero `^`/`~` ranges.
   * Scripts:
     * `init:fixtures`: `node ./scripts/create-fixtures.mjs` (Phase 1 idempotent placeholder image initializer)
     * `build:css`: `tailwindcss -i ./src/styles/input.css -o ./dist/assets/styles.css --minify` (standalone CSS check after `./dist/assets/` exists)
     * `build`: `node ./scripts/build.mjs`
     * `build:release`: `node ./scripts/build.mjs --release`
     * `preview`: `node ./scripts/preview.mjs`
     * `test`: `node --test ./tests/*.test.mjs` (runs `./tests/portfolio.test.mjs` using built-in Node test runner)
2. `./.gitignore` (`Create`): Ignore `node_modules/`, `dist/`, `.wrangler/`, `.env*`, `Thumbs.db`, and `.DS_Store`.
3. `./src/styles/input.css` (`Create`, updated for **Amethyst Dusk & Teal**):
   * Import Tailwind v4 (`@import "tailwindcss" source(none);`) and scan templates (`@source "../index.html";`, `@source "../404.html";`).
   * Wrap defaults in `@layer base { ... }`: `color-scheme: dark;`, system sans font stack, dark Amethyst Dusk canvas (`#0f0720`), crisp violet ink (`#f5f3ff`), `2px solid #5eead4` `:focus-visible` outline (`>= 12:1`), `dialog { margin: auto; }`, `dialog::backdrop { background: rgb(9 4 20 / 0.86); backdrop-filter: blur(4px); }`, and `@media (prefers-reduced-motion: reduce)` rule disabling animations/smooth scroll.
   * Define theme surface/control classes in `@layer components { ... }`: `.hero-backdrop`, `.header-dusk`, elevated cards (`.card-dusk`, `#1b1035`), recessed tiles (`.tile-dusk`, `#140b29`), high-contrast secondary buttons (`.btn-dusk`, `#140b29` / border `#8b5cf6`, `>= 3.6:1` UI boundary), showcase band (`.band-dusk`, `#2e1065` / border `#7c3aed`), screenshot tray (`.tray-dusk`), code surfaces (`.code-dusk`), and chevron rotation; paired in markup with `bg-fuchsia-400` (`#e879f9` token, Tailwind OKLCH primary CTAs with `text-slate-950` `#020618` ink) and `#5eead4`/`#2dd4bf` teal highlights.
4. `./src/index.html` (`Create` in Phase 1 with `data-owner-draft` attributes and `example.invalid` placeholder URLs; updated in Phase 2):
   * Document root `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>`, `<meta name="description">`, inline SVG favicon (`<link rel="icon" href="data:image/svg+xml,...">`, avoiding `/favicon.ico` 404 requests), semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), monotonic headings (`h1 -> h2 -> h3 -> h4`), canonical `<link rel="canonical" href="__SITE_URL__/">`, and Open Graph tags (`og:url="__SITE_URL__/"`, `og:image="__SITE_URL__/assets/og-preview.jpg"`).
   * Root-relative asset links (`/assets/styles.css`, `/assets/main.js` `defer`).
   * Wrapping flex `<nav>` (`md:sticky` header with `scroll-mt-6 md:scroll-mt-24` section targets): `#about`, `#stack`, `#capstone`, `#github`, `#certificates`, `#contact`, and Resume/CV link (`href="/assets/jayr-sarino-cv.pdf"`, `target="_blank" rel="noopener noreferrer"`).
   * `#about` (Hero split portrait featuring `/assets/jayr-sarino.webp` `765x1024` beside developer bio & CTA buttons), `#stack` (split Capstone & Systems Stack vs Web & Architecture Stack), `#github` (unified Amethyst Dusk GitHub Profile Card for `Don Aron` / `@donaron` displaying circular lazy avatar `/assets/jayr-sarino.webp`, bio `"a mobile app developer"`, `6 Public Repositories` / `58 contributions` summary, language pills, profile CTA, and a 2-column grid of all 6 public repositories: `donaron-plugin`, `soundwave-drop`, `barangay-connect-releases`, `jayr-sarino-portfolio`, `Bccporfolio`, and `barangay-app-repository`, with private `barangay-connect` strictly excluded), `#certificates` (balanced 2-card credentials grid displaying `/assets/certificates/devfest-bacolod-2025.jpg` — DevFest Bacolod 2025 Certificate of Attendance issued November 22, 2025 by Google Developer Groups Bacolod — and `/assets/certificates/opswat-icip-2026.jpg` — OPSWAT Academy Introduction to Critical Infrastructure Protection `ICIP` certificate issued November 18, 2026, Certificate ID `k1uxD4krPw`, with external verification link and isolated `data-lightbox-group="certificates"` modal inspection), `#contact` (Amethyst Dusk showcase band `.band-dusk` with `#2e1065`/`#7c3aed` styling, bundled CV link `/assets/jayr-sarino-cv.pdf`, verified GitHub `https://github.com/donaron`, LinkedIn removed, `<a href="mailto:Aronsarino435@gmail.com">`, `<button type="button" hidden data-email-copy data-email-address="Aronsarino435@gmail.com">Copy Email</button>`, `<span data-email-status aria-live="polite"></span>`).
   * `#capstone`: Six sub-blocks presenting **Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication** (**Barangay II Población, Pontevedra, Negros Occidental**), five role-based app cards (`Resident Mobile App`, `Barangay Admin App`, `Tanod Admin (Security Administrator) App`, `Tanod / Field Patroller App`, `Healthcare Admin App`), inline `<svg viewBox="0 0 760 208" role="img" aria-labelledby="arch-title">` architecture diagram with HTML `<figcaption>`, trade-off grid (`h4`) + collapsible `<details><summary>` scrubbed Cloud Firestore `firestore.rules` excerpt and representative Dart `FirebaseFirestore` repository excerpt (both `data-owner-draft` with progressive `[data-code-copy]` buttons and `[data-code-status]` live regions), Source & Privacy note (no Drive archive links), and a **6-screen** gallery referencing Jay-R's real BarangayConnect dashboard previews (`/assets/screenshots/01-main-gate-dashboard.webp` `896x1200` Main Gate switcher and `/assets/screenshots/02-resident-dashboard.webp` through `/assets/screenshots/06-tanod-field-dashboard.webp` `768x1376` role dashboards, `data-lightbox-group="capstone"`, `loading="lazy"`, `decoding="async"`).
   * Modal viewer: `<dialog data-lightbox-modal aria-labelledby="lightbox-caption"><div data-lightbox-frame>...<span data-lightbox-counter></span><a data-lightbox-direct>Open Full Image</a><button type="button" data-lightbox-close>Close</button><div class="flex ..."><div class="tray-dusk ..."><img data-lightbox-img alt="" ...><p hidden data-lightbox-error>...</p></div><aside hidden data-lightbox-details aria-label="Selected preview details">...<p data-lightbox-panel-eyebrow></p><h2 data-lightbox-panel-title></h2><p data-lightbox-panel-role></p><p data-lightbox-panel-summary></p><h3 data-lightbox-panel-features-label></h3><ul data-lightbox-panel-features></ul><p data-lightbox-panel-stack-label></p><p data-lightbox-panel-stack></p><a hidden data-lightbox-verify>Verify Certificate</a></aside></div><p id="lightbox-caption" data-lightbox-caption-text></p><button type="button" data-lightbox-prev>Previous</button><button type="button" data-lightbox-next>Next</button></div></dialog>`. Both capstone screens ("How It Works" workflow breakdown sourced from the project markdown documentation) and certificates ("Verified Credential" highlights, signatories, and external OPSWAT verification link) render side-by-side inside `[data-lightbox-details]`.
5. `./src/404.html` (`Create`): Static error view with `<html lang="en">`, `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, inline SVG favicon (`<link rel="icon" href="data:image/svg+xml,...">`), `/assets/styles.css`, `<meta name="robots" content="noindex">`, `<a href="/">Back to Portfolio</a>`, and `<a href="/#capstone">View Capstone Case Study</a>`.
6. `./src/robots.txt` (`Create`): `User-agent: *` and `Allow: /`.
7. `./src/_headers` (`Create`): Publish-root Cloudflare Pages configuration covering `/`, `/*.html` (`Cache-Control: max-age=0, must-revalidate`), `/assets/*.css` and `/assets/*.js` (`Cache-Control: public, max-age=3600, must-revalidate`), `/assets/screenshots/*` and `/assets/og-preview.jpg` (`Cache-Control: public, max-age=604800`), plus `/*` security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'`).
8. `./src/scripts/main.js` (`Create`, `<= 15 KB` unminified):
   * *Lightbox:* Intercepts `[data-lightbox]` click, updates `[data-lightbox-img]`, `[data-lightbox-caption-text]`, `[data-lightbox-counter]` (`1 / 3`), and `[data-lightbox-direct]` href, resets error state cleanly per slide, supports Previous/Next buttons + `ArrowLeft`/`ArrowRight` wrapping, closes via `[data-lightbox-close]`, backdrop (`event.target === dialog`), or `Esc`/`cancel`, clears modal image with `img.removeAttribute('src')`, and restores focus to triggering anchor.
   * *Copy Helpers (`attachCopyControl`):* Reveals `[data-email-copy]` and `[data-code-copy]` only when `window.isSecureContext && navigator.clipboard?.writeText`, writes target payload on click, and updates live status regions without triggering `mailto:`.
9. `./scripts/create-fixtures.mjs` (`Create` — Phase 1 initializer): Writes deterministic metadata-free UI mockup fixture images (`800x1200` lossless VP8L Huffman/LZ77 `WebP` mobile UI screens and a `1200x630` baseline macro-block `JPEG` editorial card containing zero `EXIF`/`XMP`/`APP1` headers) at the four paths in Item 10 (Phase 2 replaces those files with redacted owner exports).
10. Authored Media Files (`Modify` in Phase 2/4/8 with metadata-stripped real exports):
    * `./src/assets/jayr-sarino.webp` (`765x1024`, `<= 200 KB`)
    * `./src/assets/jayr-sarino-cv.pdf` (`<= 1 MB`)
    * `./src/assets/screenshots/01-main-gate-dashboard.webp` (`896x1200`, `<= 200 KB`)
    * `./src/assets/screenshots/02-resident-dashboard.webp` (`768x1376`, `<= 200 KB`)
    * `./src/assets/screenshots/03-central-admin-dashboard.webp` (`768x1376`, `<= 200 KB`)
    * `./src/assets/screenshots/04-healthcare-admin-dashboard.webp` (`768x1376`, `<= 200 KB`)
    * `./src/assets/screenshots/05-tanod-admin-dashboard.webp` (`768x1376`, `<= 200 KB`)
    * `./src/assets/screenshots/06-tanod-field-dashboard.webp` (`768x1376`, `<= 200 KB`)
    * `./src/assets/certificates/devfest-bacolod-2025.jpg` (`1024x723`, `<= 200 KB`)
    * `./src/assets/certificates/opswat-icip-2026.jpg` (`900x710`, `<= 200 KB`)
    * `./src/assets/og-preview.jpg` (`1200x630`, `<= 150 KB`)
11. `./scripts/build.mjs` (`Create`, also exports validation helpers for `./tests/portfolio.test.mjs`):
    * Parses `--release` flag and `process.env.SITE_URL` (`http://127.0.0.1:4173` default when non-release, trailing `/` stripped).
    * Deletes and recreates `./dist/` and `./dist/assets/screenshots/`.
    * Walks `./src/` via `fs.readdirSync` (reading stored entry casing on case-preserving Windows NTFS): checks subdirectory names against `^[a-z0-9-]+$`, checks files inside `./src/assets/`, `./src/styles/`, and `./src/scripts/` against `^[a-z0-9-]+(\.[a-z0-9]+)+$`, and restricts root `./src/` files strictly to `index.html`, `404.html`, `robots.txt`, and `_headers`.
    * Parses container metadata boundaries directly (never scanning compressed entropy bytes): walks top-level `RIFF` chunk FourCC headers on `*.webp` rejecting `EXIF` or `XMP ` chunks and requiring `VP8 `/`VP8L`, and walks JPEG `0xFF` marker segments prior to `SOS` (`0xFF 0xDA`) on `og-preview.jpg` rejecting `APP1..APP15` and `COM` metadata segments.
    * Rejects unknown CLI flags; in `--release` mode, fails if `SITE_URL` is non-`https://` or targets local loopback hosts (`localhost`, `127.0.0.1`, `[::1]`), or if `data-owner-draft`, `(Sample Draft)`, `[PHASE 2 OWNER INPUT]`, or `example.invalid` placeholders remain in `./src/index.html` or `./src/404.html`.
    * Runs `npm run build:css` via Node `execFileSync` (`process.env.npm_execpath` directly or `ComSpec` fallback on Windows without `shell: true`), copies `./src/scripts/main.js -> ./dist/assets/main.js`, `./src/404.html -> ./dist/404.html`, `./src/robots.txt -> ./dist/robots.txt`, `./src/_headers -> ./dist/_headers`, `./src/assets/screenshots/*.webp -> ./dist/assets/screenshots/`, and `./src/assets/og-preview.jpg -> ./dist/assets/og-preview.jpg`, substitutes `SITE_URL` for `__SITE_URL__` in `./dist/index.html`, and asserts upper byte bounds (`styles.css <= 30 KB`, `main.js <= 15 KB`, initial landing `HTML + CSS + JS <= 1.0 MB` excluding lazy-loaded below-the-fold screenshots, each screenshot `<= 200 KB`, total gallery `<= 2.5 MB`, `og-preview.jpg <= 150 KB`).
12. `./scripts/preview.mjs` (`Create`): Node built-in `http` static server listening on `127.0.0.1:4173` (overridable via `PORT`), serving `./dist/` with explicit MIME map, mapping `/` to `/index.html`, and returning HTTP `404` with `./dist/404.html` on missing paths.

### Phasing & Checkpoints

*   **Phase 1: Core Scaffolding & Fixture Verification (`Files 1–12` with deterministic Phase 1 media & placeholder markers)**
    *   *Steps:* Initialize workspace config and dependencies (`package.json`, `package-lock.json`, `.gitignore`), write styles/templates/scripts (`input.css`, `index.html`, `404.html`, `robots.txt`, `_headers`, `main.js`, `create-fixtures.mjs`, `build.mjs`, `preview.mjs`), run `npm run init:fixtures && npm run build`.
    *   *Checkpoint 1 (Exit Gate):* `npm run build` exits `0` emitting complete `./dist/`, and `npm run build:release` exits non-zero as expected while Phase 1 placeholders remain; run `npm run preview` and open `http://127.0.0.1:4173` in desktop (`1440x900`) and mobile DevTools (`360x800`, `375x812`): verify zero console/network errors, zero horizontal overflow, `<dialog>` lightbox open/Esc/backdrop/focus return, `[data-lightbox-error]` fallback (blocking a screenshot request in Network panel), `[data-email-copy]` status updates, JS-disabled fallback (links, `mailto:`, `<details>`, native `<a href>` screenshots, wrapped nav), `GET /nonexistent-route -> HTTP 404`, and Chrome DevTools Lighthouse `>= 95` across all categories.
*   **Phase 2: Owner Content, Scrubbed Proof & Sanitized Media Replacement**
    *   *Steps:* Integrate Jay-R's approved capstone title, five-app architecture, Cloud Firestore `firestore.rules` + Dart snippets; then replace remaining `data-owner-draft` preview captures and `example.invalid` URLs in `./src/index.html` with verified social links, incognito-verified external CV URL, revocable alias email, real image `width`/`height`/`alt`/captions, and replace the 4 asset files (`capstone-screen-1..3.webp`, `og-preview.jpg`) with redacted, metadata-stripped exports before production `--release`.
    *   *Checkpoint 2 (Exit Gate):* Run `npm run build` confirming exit `0` with metadata-rejection, byte-cap, and filename-casing checks passing; inspect `npm run preview` across desktop/mobile browsers, verify image legibility and pixel PII redaction manually, confirm the external CV URL returns `HTTP 200` with zero login/"Request Access" prompts in an incognito window, and verify outbound social links resolve to the intended profiles.
*   **Phase 3: Cloudflare Pages Staging Preview & Production Release**
    *   *Steps:* Complete one-time Cloudflare CLI login (`npx wrangler login`) and project creation if not yet initialized (`npx wrangler pages project create <project> --production-branch main`). Build staging preview targeting the Cloudflare preview origin (`$env:SITE_URL="https://<preview-host>.pages.dev"; npm run build:release` on Windows PowerShell, or `SITE_URL=https://<preview-host>.pages.dev npm run build:release` on POSIX) and deploy preview via `npx wrangler pages deploy ./dist --project-name <project> --branch preview`. After Checkpoint 3 staging verification, rebuild `./dist/` for the production domain (`$env:SITE_URL="https://<chosen-domain>"; npm run build:release`) and publish to production via `npx wrangler pages deploy ./dist --project-name <project> --branch main` (Cloudflare Pages Direct Upload deploys production branches separately rather than promoting preview branches).
    *   *Checkpoint 3 (Exit Gate):* Against the preview URL, run `curl -I` on `/` and `/assets/styles.css` to confirm `Content-Security-Policy`, `Cache-Control`, and security headers, verify `og:image` / `og:url` metadata, and confirm Cloudflare Pages deployment history tracks active deployments (verifying rollback UI availability against the `< 2 minute` target once consecutive production deploys exist); after the `--branch main` deploy, re-run `curl -I` and social link inspection against the live production URL.
