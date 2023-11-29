import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../../../playwright.config';

import user from '../../fixtures/user.json';

setup('do login', async ({ page }) => {
  await page.goto('/');

  await page.waitForURL('/login');
  expect(page.url()).toContain('/login');
  expect(await page.locator('h2').innerText()).toContain('Sign in to idle.app');

  const userNameInput = page.getByTestId('login-email-input');
  const passwordInput = page.getByTestId('login-password-input');

  await userNameInput.fill(user.email);
  await passwordInput.fill(user.password);
  await page.locator('[type=submit]').click();

  // Wait until the page actually signs in.
  await page.waitForURL('home');

  await page.context().storageState({ path: STORAGE_STATE });
});
