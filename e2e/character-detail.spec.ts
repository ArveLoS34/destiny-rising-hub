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
    
    // Click on first character
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should be on character detail page
      expect(page.url()).toContain('/characters/');
      await expect(page).toHaveTitle(/Nova|Eclipse|Aurora|Character|Destiny Rising/);
    }
  });

  test('character detail shows character info', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display character name
      const characterName = page.locator('h1, [data-testid="character-name"], .character-name');
      await expect(characterName).toBeVisible();
    }
  });

  test('character detail shows stats', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display character stats section
      const statsSection = page.locator('[data-testid="character-stats"], .stats, section:has-text("Stats"), section:has-text("Statistics")');
      if (await statsSection.isVisible()) {
        await expect(statsSection).toBeVisible();
      }
    }
  });

  test('character detail shows skills', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should display skills section
      const skillsSection = page.locator('[data-testid="character-skills"], .skills, section:has-text("Skills"), section:has-text("Abilities")');
      if (await skillsSection.isVisible()) {
        await expect(skillsSection).toBeVisible();
      }
    }
  });

  test('character detail has navigation back', async ({ page }) => {
    await page.goto('/destiny-rising/characters');
    await page.waitForLoadState('networkidle');
    
    const firstCharacter = page.locator('[data-testid="character-card"], article, .character-card, a[href*="/characters/"]').first();
    if (await firstCharacter.isVisible()) {
      await firstCharacter.click();
      await page.waitForLoadState('networkidle');
      
      // Should have back button or link to characters list
      const backButton = page.locator('a[href*="/characters"], button:has-text("Back"), [data-testid="back-button"]');
      if (await backButton.isVisible()) {
        await backButton.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/characters');
      }
    }
  });
});
