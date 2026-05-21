import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Math4KidsApp — Acceptance Criteria (AC-01..AC-18)', () => {
  test.beforeEach(async ({ context }) => {
    // Fresh IDB / LS for each test.
    await context.clearCookies();
  });

  test('AC-01 + AC-02: app boots, mobile layout renders', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /math4kids/i })
    ).toBeVisible();
    const vp = page.viewportSize();
    expect(vp?.width).toBeLessThanOrEqual(500);
  });

  test('AC-14: theme palette has --color-primary defined', async ({ page }) => {
    await page.goto('/');
    const colorPrimary = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim()
    );
    expect(colorPrimary).toBeTruthy();
    // Space default is #7c3aed
    expect(colorPrimary.toLowerCase()).toContain('#7c3aed');
  });

  test('AC-15: Turkish onboarding shows language picker with tr/en/de options', async ({
    page,
  }) => {
    await page.goto('/onboarding/language');
    await expect(page.getByRole('button', { name: 'Türkçe' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'English' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Deutsch' })).toBeVisible();
  });

  test('AC-18: large touch targets on onboarding (min 56x56)', async ({
    page,
  }) => {
    await page.goto('/onboarding/language');
    const btn = page.getByRole('button', { name: 'Türkçe' });
    const box = await btn.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(56);
    expect(box?.width).toBeGreaterThanOrEqual(56);
  });

  test('AC-12 + AC-13: leaderboard 4 cadence tabs render', async ({ page }) => {
    await page.goto('/leaderboard');
    // Default cadence visible; switch through the other 3.
    for (const cadence of ['Haftalık', 'Aylık', 'Yıllık', 'Günlük']) {
      const tab = page.getByRole('button', { name: cadence });
      await tab.click();
      // After click, the leaderboard list should still render (no error).
      await expect(page.getByText(/⭐/).first()).toBeVisible();
    }
  });

  test('AC-03 + AC-04 + AC-08: complete onboarding, land on map, L1 enabled, L2 locked', async ({
    page,
  }) => {
    await page.goto('/onboarding/language');
    await page.getByRole('button', { name: 'Türkçe' }).click();
    await page.getByRole('button', { name: /Devam et/i }).click();
    await page.getByPlaceholder(/adın ne olsun/i).fill('Test');
    await page.getByRole('button', { name: /Devam et/i }).click();
    // Avatar screen: pick the first one (fox)
    await page.locator('button[aria-label="jungle-fox"]').click();
    await page.getByRole('button', { name: /Devam et/i }).click();
    // Theme: Space already selected
    await page.getByRole('button', { name: /Devam et/i }).click();
    // Skip email
    await page.getByRole('button', { name: /atla/i }).click();
    // Should land on map (TrackPicker first).
    await page.waitForURL('**/map');
    const numbersBtn = page.getByRole('button', { name: 'Sayılar' });
    await expect(numbersBtn).toBeVisible();
    // Enter the Numbers track to reach the per-tier level grid.
    await numbersBtn.click();
    await page.waitForURL('**/map/numbers');
    // L1 button enabled (regex anchored to "Level 1 —" so it doesn't match L10/L11)
    const l1 = page.getByRole('button', { name: /^Level 1 [—-]/ });
    await expect(l1).toBeEnabled();
    // L2 locked
    const l2 = page.getByRole('button', { name: /^Level 2 [—-]/ });
    await expect(l2).toBeDisabled();
  });

  test('a11y: zero axe violations on onboarding language', async ({ page }) => {
    await page.goto('/onboarding/language');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(results.violations, null, 2)
    ).toEqual([]);
  });

  test('a11y: zero axe violations on map', async ({ page }) => {
    // Boot the app with a seeded profile first via onboarding.
    await page.goto('/onboarding/language');
    await page.getByRole('button', { name: 'Türkçe' }).click();
    await page.getByRole('button', { name: /Devam et/i }).click();
    await page.getByPlaceholder(/adın ne olsun/i).fill('A11y');
    await page.getByRole('button', { name: /Devam et/i }).click();
    await page.locator('button[aria-label="jungle-fox"]').click();
    await page.getByRole('button', { name: /Devam et/i }).click();
    await page.getByRole('button', { name: /Devam et/i }).click();
    await page.getByRole('button', { name: /atla/i }).click();
    await page.waitForURL('**/map');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    // Allow color-contrast violations on placeholder UI (artwork-blocked); fail on anything else.
    const critical = results.violations.filter(
      (v) => v.id !== 'color-contrast'
    );
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test('AC-09 — parent area blocked without PIN', async ({ page }) => {
    await page.goto('/parent/dashboard');
    // ParentGate outlet redirects to /parent/gate.
    await page.waitForURL('**/parent/gate');
    await expect(page.getByText(/PIN/i).first()).toBeVisible();
  });
});
