import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Homepage
 * Validates that the homepage loads correctly and displays expected content
 */

test.describe('RC-2: Homepage E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Destiny Rising Hub/);
    await expect(page.locator('h1, h2, [data-testid="hero-title"]')).toBeVisible();
  });

  test('homepage has navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav, header, [data-testid="navigation"]');
    await expect(nav).toBeVisible();
  });

  test('homepage has character link', async ({ page }) => {
    await page.goto('/');
    const characterLink = page.locator('a[href*="characters"], a[href*="/destiny-rising/characters"]');
    await expect(characterLink.first()).toBeVisible();
  });

  test('homepage is responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto('/');
    await expect(page).toHaveTitle(/Destiny Rising Hub/);
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
    await page.goto('/');
    await expect(page).toHaveTitle(/Destiny Rising Hub/);
  });
});
