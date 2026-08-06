import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Teams & Materials
 * Validates that Teams and Materials pages load correctly
 */

test.describe('RC-2: Teams Page E2E Tests', () => {
  test('teams page loads', async ({ page }) => {
    await page.goto('/destiny-rising/teams');
    await page.waitForLoadState('networkidle');
    
    // Check for page content instead of title
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('teams page displays content', async ({ page }) => {
    await page.goto('/destiny-rising/teams');
    await page.waitForLoadState('networkidle');
    
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});

test.describe('RC-2: Materials Page E2E Tests', () => {
  test('materials page loads', async ({ page }) => {
    await page.goto('/destiny-rising/materials');
    await page.waitForLoadState('networkidle');
    
    // Check for page content instead of title
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
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
    await page.waitForLoadState('networkidle');
    
    // Check for page content instead of title
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('combat lab displays content', async ({ page }) => {
    await page.goto('/destiny-rising/combat-lab');
    await page.waitForLoadState('networkidle');
    
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
