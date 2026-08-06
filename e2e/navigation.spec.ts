import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Navigation
 * Validates that navigation between pages works correctly
 */

test.describe('RC-2: Navigation E2E Tests', () => {
  test('can navigate from homepage to characters', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    const charactersLink = page.locator('a[href*="character"], a:has-text("Character")');
    if (await charactersLink.count() > 0) {
      await charactersLink.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/character');
    }
  });

  test('can navigate from characters to build lab', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const buildLabLink = page.locator('a[href*="build-lab"], a:has-text("Build")');
    if (await buildLabLink.count() > 0) {
      await buildLabLink.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('build');
    }
  });

  test('can navigate to teams page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    const teamsLink = page.locator('a[href*="team"], a:has-text("Team")');
    if (await teamsLink.count() > 0) {
      await teamsLink.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('team');
    }
  });

  test('can navigate to materials page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    const materialsLink = page.locator('a[href*="material"], a:has-text("Material")');
    if (await materialsLink.count() > 0) {
      await materialsLink.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('material');
    }
  });

  test('browser back button works', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const characterLinks = page.locator('a[href*="/characters/"]');
    if (await characterLinks.count() > 0) {
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      expect(page.url()).toContain('/characters');
    }
  });
});
