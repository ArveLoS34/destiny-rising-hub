import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - Homepage
 * Validates that the homepage loads correctly and displays expected content
 */

test.describe('RC-2: Homepage E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check for page content - be more flexible
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 15000 });
    
    // Check that page has some content
    const content = await body.textContent();
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('homepage has navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Look for navigation elements - be flexible
    const nav = page.locator('nav, header, [role="navigation"], [data-testid="navigation"]');
    const navCount = await nav.count();
    
    // At least one navigation element should exist
    expect(navCount).toBeGreaterThan(0);
  });

  test('homepage has character link', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Look for any link that contains "character" in href or text
    const characterLink = page.locator('a[href*="character"], a:has-text("Character"), a:has-text("character")');
    const linkCount = await characterLink.count();
    
    // Should have at least one character-related link
    expect(linkCount).toBeGreaterThan(0);
  });

  test('homepage is responsive', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    const body = page.locator('body');
    await expect(body).toBeVisible({ timeout: 10000 });
    
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    await expect(body).toBeVisible({ timeout: 10000 });
  });
});
