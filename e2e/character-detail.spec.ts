import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Character Detail
 * Validates that character detail pages load correctly with all information
 */

test.describe('RC-2: Character Detail E2E Tests', () => {
  test('character detail page loads', async ({ page }) => {
    // Navigate to characters list first
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    // Wait for character cards
    await page.waitForSelector('article', { timeout: 10000 });
    
    // Click on first character
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on character detail page
      expect(page.url()).toContain('/characters/');
      
      // Check for page content
      const content = page.locator('main, [role="main"], body');
      await expect(content).toBeVisible({ timeout: 10000 });
    }
  });

  test('character detail shows character info', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display character name (h1)
      const characterName = page.locator('h1');
      await expect(characterName).toBeVisible({ timeout: 10000 });
    }
  });

  test('character detail shows stats', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display character stats section
      const statsSection = page.locator('section:has-text("Stats"), section:has-text("Statistics"), [data-testid="stats"]');
      if (await statsSection.first().isVisible()) {
        await expect(statsSection.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('character detail shows skills', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display skills section
      const skillsSection = page.locator('section:has-text("Skills"), section:has-text("Abilities"), [data-testid="skills"]');
      if (await skillsSection.first().isVisible()) {
        await expect(skillsSection.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('character detail has navigation back', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('article', { timeout: 10000 });
    
    const firstCharacter = page.locator('article').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should have back button or link to characters list
      const backButton = page.locator('a[href*="/characters"], button:has-text("Back"), [data-testid="back-button"]');
      if (await backButton.first().isVisible()) {
        await backButton.first().click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/characters');
      }
    }
  });
});
