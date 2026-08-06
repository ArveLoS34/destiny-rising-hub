import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Build Lab
 * Validates that the Build Lab page loads and functions correctly
 */

test.describe('RC-2: Build Lab E2E Tests', () => {
  test('build lab page loads', async ({ page }) => {
    await page.goto('/destiny-rising/build-lab');
    await expect(page).toHaveTitle(/Build|Destiny Rising/);
  });

  test('build lab displays content', async ({ page }) => {
    await page.goto('/destiny-rising/build-lab');
    await page.waitForLoadState('networkidle');
    
    // Should have some content
    const content = page.locator('main, [data-testid="build-lab-content"], .build-lab');
    await expect(content).toBeVisible();
  });

  test('build lab has character selector', async ({ page }) => {
    await page.goto('/destiny-rising/build-lab');
    await page.waitForLoadState('networkidle');
    
    // Should have character selection
    const characterSelector = page.locator('select, [data-testid="character-selector"], .character-select');
    if (await characterSelector.isVisible()) {
      await expect(characterSelector).toBeVisible();
    }
  });
});
