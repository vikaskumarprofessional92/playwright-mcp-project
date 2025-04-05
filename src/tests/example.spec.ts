import { test, expect } from '@playwright/test';

test('basic web interaction test', async ({ page }) => {
  // Using a more reliable test site
  await page.goto('https://example.com');
  
  // Wait for and verify the main heading
  const heading = page.locator('h1');
  await heading.waitFor();
  expect(await heading.textContent()).toBe('Example Domain');
  
  // Verify page content
  const content = page.locator('p');
  await content.first().waitFor();
  expect(await content.first().isVisible()).toBe(true);
});