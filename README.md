# Math4KidsApp

> A colorful, gamified preschool mathematics learning app for children aged 4–6.
> Mobile-first browser-based PWA. Turkish, English, German.

**Status:** In development (v1, pre-implementation). No application code yet.

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

## Tech stack

- **Framework:** React 18 + Vite + TypeScript (strict)
- **State:** Zustand with custom persistence middleware
- **Styling:** Tailwind CSS + CSS custom-property theme tokens (runtime theme swap)
- **Animation:** Framer Motion
- **i18n:** i18next (tr default, en/de lazy)
- **Audio:** Howler.js + browser SpeechSynthesis for narration
- **Persistence:** IndexedDB via `idb-keyval` (per-profile namespaces) + localStorage for tiny singletons
- **Routing:** React Router v6 with nested session-scoped outlets
- **PWA:** `vite-plugin-pwa` (Workbox); installable, mobile-first
- **Testing:** Vitest + React Testing Library + Playwright (mobile emulation) + axe-core a11y + Lighthouse CI
- **Hosting:** Cloudflare Pages (static)

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build
npm run test       # unit + component tests
npm run e2e        # Playwright smoke + a11y
npm run lint       # ESLint
npm run storybook  # dev-only component sandbox
```

(Scripts will be wired in once the project skeleton lands.)

## Themes

Four themes ship in v1:

- **Space Adventure** — default, fully shipped
- **Jungle Safari** — preview
- **Ocean World** — preview
- **Candy Land** — preview

Theme tokens drive color palette, illustrations, character variant, and ambient sound.

## License

MIT — see [LICENSE](LICENSE).

---

_Personal / learning project._
