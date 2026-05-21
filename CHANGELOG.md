# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Initial v1 implementation across 10 phases (P0–P10).
- 17-level math curriculum (numbers 1–20, counting, comparison, shapes, patterns, sorting, add/sub, foundations of multiplication and division, mixed review, final challenge).
- Balanced 3-star rubric (3★ = ≥85% accuracy + ≤1 hint; 2★ = ≥70%; 1★ = any).
- Multi-profile support (up to 4 per device) with UUID namespacing.
- Parent area behind a 4-digit PIN (PBKDF2-SHA-256, 210k iterations, 16-byte salt).
- Parent gate cooldown (3 wrong → 30s; escalates to 5 min after 3 cycles).
- i18n: Turkish default, English + German lazy-loaded.
- 4 themes: Space Adventure (default), Jungle Safari, Ocean World, Candy Land.
- Audio engine: Howler.js + browser SpeechSynthesis with priority queue and gesture-gated unlock.
- Mocked leaderboard with daily/weekly/monthly/yearly cadences.
- Rewards system: coins, badges, section chests.
- Installable PWA with Workbox precache and new-version toast.
- Acceptance test suite covering AC-01..AC-18 via Playwright (mobile-chromium + axe-core).
- CI-ready: ESLint zero-warning, TypeScript strict, Vitest, Playwright, Lighthouse CI hooks.

### Security

- KVKK + GDPR-K compliance posture: no third-party telemetry/analytics/error-reporting SDKs; CSP `connect-src 'self'`; parent email stored locally only.
- ESLint `no-restricted-imports` bans 10 telemetry SDKs at lint-time.
- `public/_headers` with full CSP, Permissions-Policy fence, COOP, HSTS, X-Frame-Options DENY.

### Deferred to v1.1+

- Pre-recorded narration audio (TTS only in v1).
- Real backend for leaderboard, email reports, and cloud sync (adapter seams in place).
- Sentry / external error reporting (queued behind a feature flag; pending legal review).
- Three remaining themes' polished artwork (token stubs ship; full art in v1.1).
- iOS Safari real-device smoke verification (manual checklist in `.specify/qa/ios-smoke.md`).

[Unreleased]: https://github.com/aliemrahpekesen/math4kids-app/compare/main...HEAD
