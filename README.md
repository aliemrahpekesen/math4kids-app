# Math4KidsApp

> A colorful, gamified preschool mathematics learning app for children aged 4–6.
> Mobile-first browser-based PWA. Turkish, English, German.

**Status:** v1 feature-complete; iOS smoke check pending (see [`.specify/qa/ios-smoke.md`](.specify/qa/ios-smoke.md)).

## What it is

Math4KidsApp is a single-page web app designed to feel like a mobile app. It teaches early numeracy through a 17-level mastery loop with stars, coins, badges, daily streaks, themed level maps, and voiced narration.

Topics covered (ages 4–6):

- Numbers 1–20, recognition and counting
- Number-to-quantity matching
- Comparing numbers (bigger / smaller / equal)
- Shapes, patterns, sorting and grouping
- Addition and subtraction with visuals
- Foundations of multiplication and division (visual groups-of and sharing-equally)
- Mixed review and a final challenge

The primary user is a 4–6-year-old child; the secondary user is a parent who manages progress, settings, and profiles behind a 4-digit PIN gate. All data is local-first (localStorage + IndexedDB). No backend, no third-party telemetry — KVKK / GDPR-K friendly by default.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:5173 — mobile-first SPA
```

Use Chrome DevTools mobile mode (Pixel 5 profile) for the canonical preview surface.

## Scripts

```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # Production build → dist/ (with PWA assets)
npm run preview      # Serve the built artifact (port 4173)
npm run test         # Vitest unit + component (63 tests)
npm run e2e          # Playwright (mobile-chromium + axe-core), runs against preview
npm run lint         # ESLint (zero warnings allowed)
npm run format       # Prettier write
npm run typecheck    # tsc --noEmit (strict)
npm run storybook    # Component sandbox (port 6006, dev only)
```

## Tech stack

- **Framework:** React 18 + Vite + TypeScript (strict)
- **State:** Zustand (7 per-domain stores) with custom repo-backed persistence
- **Styling:** Tailwind CSS + CSS custom-property theme tokens (runtime theme swap)
- **Animation:** Framer Motion (named imports only)
- **i18n:** i18next (tr default, en/de lazy)
- **Audio:** Howler.js + browser SpeechSynthesis (narration TTS in v1; pre-recorded swap path ready for v2)
- **Persistence:** IndexedDB via `idb-keyval` (per-profile UUID namespacing) + localStorage for tiny singletons
- **Routing:** React Router v6 with nested session-scoped outlets + parent-gate outlet
- **PWA:** `vite-plugin-pwa` (Workbox) — installable, manifest + precache + new-version toast
- **Testing:** Vitest + React Testing Library + Storybook + Playwright (mobile emulation) + axe-core a11y
- **Hosting:** Cloudflare Pages (static; see [`public/_headers`](public/_headers) for CSP + cache policy)
- **CI gates:** ESLint zero-warning, TypeScript strict, Vitest, Playwright + axe, Lighthouse CI (PWA/a11y/best-practices ≥ 90)

## Architecture (one-paragraph version)

A layered SPA with strict downward dependencies: **UI screens → feature modules → engines (pure domain logic) → repository adapters → persistence drivers**. Cross-cutting concerns (theme, i18n, audio, logger) are injected through providers at the app shell. Future-backend integration points (leaderboard HTTP, email send, cloud sync, error reporting) are reserved as **adapter seams** with no production code paths in v1. Zero third-party SDKs ship to production; CSP `connect-src 'self'` enforces that at the browser layer.

## Themes

Four themes ship in v1:

- **Space Adventure** — default
- **Jungle Safari**
- **Ocean World**
- **Candy Land**

Theme tokens drive color palette, illustrations, character variant, and ambient sound. Tokens are CSS custom properties applied to `:root`, so a theme swap is a single re-paint with zero JS overhead.

## Compliance posture

- **No third-party telemetry, analytics, or error-reporting SDKs in v1.** ESLint `no-restricted-imports` bans 10 known SDKs; CSP `connect-src 'self'` blocks any that slip through.
- **No transmission of child data.** Local-first by design — IndexedDB only.
- **Parent email** captured at onboarding is **stored locally only** and never transmitted in v1. The disclosure text reflects this verbatim per KVKK Art. 5/1.
- **PIN hashing:** PBKDF2-SHA-256, 210,000 iterations (NIST SP 800-132 2023), 16-byte salt via SubtleCrypto.

## Accessibility

- WCAG 2.1 AA target on critical flows.
- Min touch target 56×56 CSS px (above WCAG 44, above Material 48).
- Color is never load-bearing — every state uses color + icon (+ optional text).
- `prefers-reduced-motion` honored via `useMotionPreset`; Framer Motion animations gated.
- Axe-core runs against `/onboarding/language`, `/map`, `/parent/gate` in CI.

## Performance budget

- Main chunk ≤ **350 KB gzipped** (currently ~125 KB; 65% headroom).
- Lighthouse mobile: PWA + a11y + best-practices ≥ 90 (blocking); perf ≥ 80 (advisory).

## License

MIT — see [LICENSE](LICENSE).

---

_Personal / learning project. Built with a Claude Code spec-first workflow._
