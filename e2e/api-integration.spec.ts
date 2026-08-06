import { test, expect } from '@playwright/test';

/**
 * RC-2: E2E Functional Validation - API Integration
 * Validates that API endpoints work correctly from the browser
 */

test.describe('RC-2: API Integration E2E Tests', () => {
  test('health endpoint accessible from browser', async ({ page }) => {
    const response = await page.goto('/api/health');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    
    const content = await response!.text();
    const data = JSON.parse(content);
    expect(data.status).toBe('healthy');
    expect(data.checks).toBeDefined();
  });

  test('characters API accessible from browser', async ({ page }) => {
    const response = await page.goto('/api/v1/characters');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    
    const content = await response!.text();
    const data = JSON.parse(content);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('characters API pagination works', async ({ page }) => {
    const response = await page.goto('/api/v1/characters?page=1&limit=5');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    
    const content = await response!.text();
    const data = JSON.parse(content);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(5);
  });

  test('characters API filtering works', async ({ page }) => {
    const response = await page.goto('/api/v1/characters?filter[element]=Fire');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    
    const content = await response!.text();
    const data = JSON.parse(content);
    expect(data.data).toBeDefined();
    expect(data.data.length).toBeGreaterThan(0);
    
    // All returned characters should have Fire element
    for (const character of data.data) {
      expect(character.element).toBe('Fire');
    }
  });

  test('characters API sorting works', async ({ page }) => {
    const response = await page.goto('/api/v1/characters?sort=name&order=asc');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
    
    const content = await response!.text();
    const data = JSON.parse(content);
    expect(data.data).toBeDefined();
    expect(data.data.length).toBeGreaterThan(0);
    
    // Check if sorted alphabetically
    const names = data.data.map((c: any) => c.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });
});
