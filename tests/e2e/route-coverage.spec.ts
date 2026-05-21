import { test, expect, type Page } from '@playwright/test';

/**
 * Regression net: navigate to every public route and assert that no console
 * error (and no Router "Unexpected Application Error" screen) appears.
 *
 * This catches the entire class of bug where a Zustand selector returns a
 * freshly-built reference each call (e.g., `.filter(...)`), which sends
 * React into an infinite re-render loop ("Maximum update depth exceeded").
 *
 * Why this is its own spec rather than a per-screen test: per-screen tests
 * miss screens we forgot to test. A route-iterating spec catches any new
 * screen the moment its route is added.
 */

const PUBLIC_ROUTES = [
  '/',
  '/onboarding/language',
  '/onboarding/profile',
  '/onboarding/avatar',
  '/onboarding/theme',
  '/onboarding/parent-email',
  '/profile-picker',
  '/map',
  '/lesson/1',
  '/lesson/1/practice',
  '/lesson/1/quiz',
  '/lesson/1/result',
  '/rewards',
  '/leaderboard',
  '/parent/gate',
] as const;

/**
 * Parent-area routes always redirect to /parent/gate when not authenticated,
 * but the redirect itself should not crash. We test them via the gate.
 */
const GATED_ROUTES = [
  '/parent/dashboard',
  '/parent/reports/daily',
  '/parent/reports/weekly',
  '/parent/reports/monthly',
  '/parent/reports/yearly',
  '/parent/settings',
  '/parent/profiles',
  '/parent/email-preview',
] as const;

async function assertNoError(page: Page) {
  // Router's default error screen.
  await expect(page.getByText('Unexpected Application Error!')).toHaveCount(0);
  await expect(page.getByText('Maximum update depth exceeded')).toHaveCount(0);
}

function listenForFatalErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    // i18next missing-key warnings and PWA-register debug noise are not fatal.
    if (text.includes('i18next')) return;
    if (text.includes('[pwa] register skipped')) return;
    errors.push(text);
  });
  return errors;
}

test.describe('route coverage — no crashes anywhere', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`renders ${route} without crashing`, async ({ page }) => {
      const errors = listenForFatalErrors(page);
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Give React 200ms to settle any state machine.
      await page.waitForTimeout(200);
      await assertNoError(page);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  for (const route of GATED_ROUTES) {
    test(`gated route ${route} redirects to gate without crashing`, async ({
      page,
    }) => {
      const errors = listenForFatalErrors(page);
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(200);
      // Should land on the gate (or render the gate inline).
      await assertNoError(page);
      expect(errors, errors.join('\n')).toEqual([]);
      // URL should redirect to /parent/gate.
      expect(page.url()).toContain('/parent/gate');
    });
  }

  test('parent area: PIN unlock + in-app navigation through every gated screen', async ({
    page,
  }) => {
    const errors = listenForFatalErrors(page);

    // Onboard so there's an active profile.
    await page.goto('/onboarding/language');
    await page.getByRole('button', { name: 'Türkçe' }).click();
    await page.getByPlaceholder(/adın ne olsun/i).fill('Route');
    await page.getByRole('button', { name: /İleri/i }).click();
    await page.getByRole('button', { name: 'fox' }).click();
    await page.getByRole('button', { name: /İleri/i }).click();
    await page.getByRole('button', { name: /İleri/i }).click();
    await page.getByRole('button', { name: /atla/i }).click();
    await page.waitForURL('**/map');

    // Set PIN (first visit triggers SET mode).
    await page.goto('/parent/gate');
    for (const digit of ['1', '2', '3', '4']) {
      await page.getByRole('button', { name: digit }).click();
    }
    await page.getByRole('button', { name: 'Tamam' }).click();
    // Confirm PIN.
    for (const digit of ['1', '2', '3', '4']) {
      await page.getByRole('button', { name: digit }).click();
    }
    await page.getByRole('button', { name: 'Tamam' }).click();
    await page.waitForURL('**/parent/dashboard');
    await assertNoError(page);

    // In-app navigation (no page.goto — that would reload and drop the
    // in-memory parent-gate token, which is intentional behavior).
    await page.getByRole('button', { name: /Raporlar/i }).click();
    await page.waitForURL('**/parent/reports/daily');
    await assertNoError(page);

    // Tab through the 4 cadences.
    for (const tab of ['Haftalık', 'Aylık', 'Yıllık', 'Günlük']) {
      await page.getByRole('button', { name: tab }).click();
      await assertNoError(page);
    }

    // Back to dashboard via back arrow.
    await page.getByRole('button', { name: '←' }).first().click();
    await page.waitForURL('**/parent/dashboard');

    // Settings.
    await page.getByRole('button', { name: /Ayarlar/i }).click();
    await page.waitForURL('**/parent/settings');
    await assertNoError(page);
    await page.getByRole('button', { name: '←' }).first().click();
    await page.waitForURL('**/parent/dashboard');

    // **Profile management — the route that originally crashed.**
    await page.getByRole('button', { name: /Profilleri yönet/i }).click();
    await page.waitForURL('**/parent/profiles');
    await assertNoError(page);
    await page.getByRole('button', { name: '←' }).first().click();
    await page.waitForURL('**/parent/dashboard');

    // Email preview.
    await page.getByRole('button', { name: /Rapor gönder/i }).click();
    await page.waitForURL('**/parent/email-preview');
    await assertNoError(page);

    expect(errors, errors.join('\n')).toEqual([]);
  });
});
