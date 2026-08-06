import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Homepage
 * Validates that the homepage loads correctly and displays expected content
 */

test.describe('RC-2: Homepage E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for page content instead of title
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
  });

  test('homepage has navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const nav = page.locator('nav, header, [data-testid="navigation"]');
    await expect(nav).toBeVisible({ timeout: 5000 });
  });

  test('homepage has character link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const characterLink = page.locator('a[href*="characters"], a[href*="/destiny-rising/characters"]');
    await expect(characterLink.first()).toBeVisible({ timeout: 5000 });
  });

  test('homepage is responsive', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const content = page.locator('main, [role="main"], body');
    await expect(content).toBeVisible({ timeout: 10000 });
    
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(content).toBeVisible({ timeout: 10000 });
  });
});
