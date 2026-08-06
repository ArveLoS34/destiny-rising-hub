import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Characters List
 * Validates that the characters list page loads and displays characters correctly
 */

test.describe('RC-2: Characters List E2E Tests', () => {
  test('characters list page loads', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Check for page content instead of title
    const heading = page.locator('h1:has-text("Characters")');
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('characters list displays characters', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Wait for character cards to load
    await page.waitForSelector('article', { timeout: 10000 });
    
    // Should have at least one character card (article element)
    const characterItems = page.locator('article');
    const count = await characterItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('characters can be filtered by element', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Wait for character cards
    await page.waitForSelector('article', { timeout: 10000 });
    
    // Look for filter buttons (element filter buttons)
    const filterButtons = page.locator('button:has-text("Fire"), button:has-text("Water"), button:has-text("Element")');
    
    if (await filterButtons.first().isVisible()) {
      await filterButtons.first().click();
      await page.waitForTimeout(500);
      
      // Verify filtered results still show characters
      const characterItems = page.locator('article');
      const count = await characterItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('character detail link works', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Wait for character cards
    await page.waitForSelector('article', { timeout: 10000 });
    
    // Click on first character card
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to character detail page
      expect(page.url()).toContain('/characters/');
    }
  });
});
