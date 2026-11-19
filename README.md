# Jay-R Sarino — Personal Portfolio Website

Personal developer portfolio presenting **Jay-R Sarino** (4th-year BSIT student at Binalbagan Catholic College, Project Manager & Lead Programmer), his technical stack, verified credentials (**Google DevFest Bacolod 2025** & **OPSWAT Academy ICIP**), CV, and full case study of his five-application capstone ecosystem built for **Barangay II Población, Pontevedra, Negros Occidental**.

- **Live Site:** https://jayr-sarino-portfolio.vercel.app
- **GitHub:** https://github.com/donaron

## Architecture & Highlights

- **Static Semantic HTML5 + Compiled Tailwind CSS v4** (`styles.css <= 30 KB`, styled in **Design 15: Amethyst Dusk & Teal**)
- **Zero-Dependency Vanilla JS (`main.js <= 15 KB`)**: Accessible `<dialog>` gallery modal with **How It Works** & **Verified Credential** side panels, keyboard navigation, error recovery, focus restoration, and progressive clipboard helpers
- **Capstone Case Study**: Architecture overview, Cloud Firestore `firestore.rules` & Dart stream excerpts, and 6 real role dashboard screens (**Main Gate**, **Resident**, **Central Admin**, **Healthcare Admin**, **Tanod Command**, **Tanod Field Patroller**)
- **Automated Quality & Security Gates (`scripts/build.mjs`, `tests/portfolio.test.mjs`)**: Metadata-free media validation (rejects `EXIF`/`XMP`/`APP1..15`), filename casing verification, byte-budget enforcement, CSP headers (`vercel.json` / `src/_headers`), and full release placeholder checks

## Commands

```bash
npm install
npm test
npm run build
npm run preview
```

For production release builds:

```powershell
$env:SITE_URL="https://jayr-sarino-portfolio.vercel.app"
npm run build:release
```
