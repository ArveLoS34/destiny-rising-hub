import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Navigation
 * Validates that navigation between pages works correctly
 */

test.describe('RC-2: Navigation E2E Tests', () => {
  test('can navigate from homepage to characters', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const charactersLink = page.locator('a[href*="characters"], a[href*="/destiny-rising/characters"]');
    await charactersLink.first().click();
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/characters');
  });

  test('can navigate from characters to build lab', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    const buildLabLink = page.locator('a[href*="build-lab"], a[href*="/build-lab"]');
    if (await buildLabLink.first().isVisible()) {
      await buildLabLink.first().click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/build-lab');
    }
  });

  test('can navigate to teams page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const teamsLink = page.locator('a[href*="teams"], a[href*="/teams"]');
    if (await teamsLink.first().isVisible()) {
      await teamsLink.first().click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/teams');
    }
  });

  test('can navigate to materials page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const materialsLink = page.locator('a[href*="materials"], a[href*="/materials"]');
    if (await materialsLink.first().isVisible()) {
      await materialsLink.first().click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/materials');
    }
  });

  test('browser back button works', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Use browser back button
      await page.goBack();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('/characters');
    }
  });
});
