import { test, expect } from '@playwright/test';

test('should redirect user to login page if they are not logged in', async ({
  page,
}) => {
  await page.goto('/');

  await page.waitForURL('/login');
  expect(page.url()).toContain('/login');
  expect(await page.locator('h2').innerText()).toContain('Sign in to idle.app');
});
