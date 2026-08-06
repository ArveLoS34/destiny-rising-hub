import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Teams & Materials
 * Validates that Teams and Materials pages load correctly
 */

test.describe('RC-2: Teams Page E2E Tests', () => {
  test('teams page loads', async ({ page }) => {
    await page.goto('/destiny-rising/teams');
    await expect(page).toHaveTitle(/Team|Destiny Rising/);
  });

  test('teams page displays content', async ({ page }) => {
    await page.goto('/destiny-rising/teams');
    await page.waitForLoadState('networkidle');
    
    const content = page.locator('main, [data-testid="teams-content"], .teams');
    await expect(content).toBeVisible();
  });
});

test.describe('RC-2: Materials Page E2E Tests', () => {
  test('materials page loads', async ({ page }) => {
    await page.goto('/destiny-rising/materials');
    await expect(page).toHaveTitle(/Material|Destiny Rising/);
  });

  test('materials page displays materials list', async ({ page }) => {
    await page.goto('/destiny-rising/materials');
    await page.waitForLoadState('networkidle');
    
    // Should have materials listed
    const materials = page.locator('[data-testid="material-item"], article, .material-card, li');
    const count = await materials.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can click on material detail', async ({ page }) => {
    await page.goto('/destiny-rising/materials');
    await page.waitForLoadState('networkidle');
    
    const firstMaterial = page.locator('[data-testid="material-item"], article, .material-card, a[href*="/materials/"]').first();
    if (await firstMaterial.isVisible()) {
      await firstMaterial.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/materials/');
    }
  });
});

test.describe('RC-2: Combat Lab Page E2E Tests', () => {
  test('combat lab page loads', async ({ page }) => {
    await page.goto('/destiny-rising/combat-lab');
    await expect(page).toHaveTitle(/Combat|Destiny Rising/);
  });

  test('combat lab displays content', async ({ page }) => {
    await page.goto('/destiny-rising/combat-lab');
    await page.waitForLoadState('networkidle');
    
    const content = page.locator('main, [data-testid="combat-lab-content"], .combat-lab');
    await expect(content).toBeVisible();
  });
});
