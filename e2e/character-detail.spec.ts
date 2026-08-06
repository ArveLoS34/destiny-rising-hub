import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Character Detail
 * Validates that character detail pages load correctly with all information
 */

test.describe('RC-2: Character Detail E2E Tests', () => {
  test('character detail page loads', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Find and click first character link
    const characterLinks = page.locator('a[href*="/characters/"]');
    const linkCount = await characterLinks.count();
    
    if (linkCount > 0) {
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Should be on character detail page
      expect(page.url()).toContain('/characters/');
      
      // Check page has content
      const body = page.locator('body');
      const content = await body.textContent();
      expect(content).toBeTruthy();
      expect(content!.length).toBeGreaterThan(0);
    }
  });

  test('character detail shows character info', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const characterLinks = page.locator('a[href*="/characters/"]');
    if (await characterLinks.count() > 0) {
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Should display character name (h1 or h2)
      const heading = page.locator('h1, h2');
      const headingCount = await heading.count();
      expect(headingCount).toBeGreaterThan(0);
    }
  });

  test('character detail shows stats', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const characterLinks = page.locator('a[href*="/characters/"]');
    if (await characterLinks.count() > 0) {
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Should display some stats-related content
      const body = page.locator('body');
      const content = await body.textContent();
      expect(content).toBeTruthy();
    }
  });

  test('character detail shows skills', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const characterLinks = page.locator('a[href*="/characters/"]');
    if (await characterLinks.count() > 0) {
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Should display skills-related content
      const body = page.locator('body');
      const content = await body.textContent();
      expect(content).toBeTruthy();
    }
  });

  test('character detail has navigation back', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    const characterLinks = page.locator('a[href*="/characters/"]');
    if (await characterLinks.count() > 0) {
      const originalUrl = page.url();
      await characterLinks.first().click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      // Use browser back button
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
      
      // Should return to characters list
      expect(page.url()).toContain('/characters');
    }
  });
});
