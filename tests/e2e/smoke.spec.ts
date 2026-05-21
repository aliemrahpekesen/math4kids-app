import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Math4KidsApp — smoke', () => {
  test('renders the heading on the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /math4kids/i })).toBeVisible();
  });

  test('uses mobile viewport sized for Pixel 5', async ({ page }) => {
    await page.goto('/');
    const viewportSize = page.viewportSize();
    expect(viewportSize?.width).toBeLessThanOrEqual(500);
  });

  test('passes axe-core baseline a11y on landing', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
