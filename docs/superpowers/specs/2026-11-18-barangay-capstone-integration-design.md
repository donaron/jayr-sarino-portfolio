# Barangay Service Portal Capstone Portfolio Integration Design

- **Date:** 2026-11-18
- **Source Documentation:** [barangay_service_portal_portfolio_documentation.md](file:///c:/Users/USER/Downloads/barangay_service_portal_portfolio_documentation.md)
- **Target Repository:** `C:\Users\USER\.gemini\antigravity\scratch\portfolio\`

## Summary of Changes

1. **Approved Developer Bio:** Update hero `#about` and `<meta name="description">` / OG metadata in `src/index.html` with Jay-r Sarino's factual Flutter + Firebase developer bio and tagline derived directly from his five-app Barangay capstone.
2. **Real Capstone Case Study (`#capstone` & `#stack`):** Replace placeholder/RTDB copy with the **Android-Based Smartphone Barangay Service Portal with Appointment Management for Improved Communication** for **Barangay II Población, Pontevedra, Negros Occidental**:
   - Five role-based Android apps: **Resident Mobile App**, **Barangay Admin App**, **Tanod Admin App**, **Tanod / Field Patroller App**, and **Healthcare Admin App**.
   - Confirmed stack: **Google Stitch**, **Flutter (Dart)**, **Firebase Authentication (RBAC)**, **Cloud Firestore**, **Firebase Cloud Storage**, **Firebase Cloud Messaging (FCM)**, **Google Maps API & Android GPS**, and **Rule-Based Validation Engine**.
   - Updated system architecture SVG diagram + HTML `<figcaption>` + trade-offs + `firestore.rules` / `Firestore` Dart `Stream` representative snippets (`data-owner-draft`).
3. **Tailored UI Fixture Artwork (`scripts/create-fixtures.mjs`):** Render three domain-accurate `800x1200` lossless `VP8L` `WebP` mobile previews (**Resident Portal**, **Tanod Live Dispatch & GPS**, **Healthcare Queue & Medicine Stock**) plus an updated `1200x630` `og-preview.jpg` banner while keeping `data-owner-draft` / `example.invalid` `--release` blockers intact until real photos/URLs arrive in Phase 2.
4. **Budget Discipline:** Reuse existing Tailwind v4 utilities so `dist/assets/styles.css` stays strictly `<= 30,000 B`.
