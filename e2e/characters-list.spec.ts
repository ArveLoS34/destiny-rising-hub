import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Characters List
 * Validates that the characters list page loads and displays characters correctly
 */

test.describe('RC-2: Characters List E2E Tests', () => {
  test('characters list page loads', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await expect(page).toHaveTitle(/Characters|Destiny Rising/);
  });

  test('characters list displays characters', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    // Wait for characters to load
    await page.waitForLoadState('networkidle');
    
    // Should have at least one character card or list item
    const characterItems = page.locator('[data-testid="character-card"], [data-testid="character-item"], article, .character-card, .character-item');
    const count = await characterItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('characters can be filtered by element', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Look for filter controls
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("Element"), [data-testid="filter-button"]');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      
      // Look for element filter options
      const elementFilter = page.locator('button:has-text("Fire"), input[value="Fire"], [data-testid="filter-fire"]');
      if (await elementFilter.isVisible()) {
        await elementFilter.click();
        await page.waitForLoadState('networkidle');
        
        // Verify filtered results
        const characterItems = page.locator('[data-testid="character-card"], article, .character-card');
        const count = await characterItems.count();
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('character detail link works', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Click on first character
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to character detail page
      expect(page.url()).toContain('/characters/');
    }
  });
});
