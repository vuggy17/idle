import test, { expect } from '@playwright/test';

test.describe('Global nav bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./src/.cache/network/account.har', {
      url: '**/account*',
      update: false,
    });

    // ensure user is logged in
    await page.goto('/');
    await page.waitForURL('home');
  });
  test.describe('when click on home button', () => {
    test('should navigate to /home', async ({ page }) => {
      await page.getByTestId('gnb-home').click();
      await page.waitForURL('/home');
      expect(page.url()).toContain('/home');
    });
  });
  test.describe('when click on dm button', () => {
    test('should navigate to /dm', async ({ page }) => {
      await page.getByTestId('gnb-dm').click();
      await page.waitForURL('/dm');
      expect(page.url()).toContain('/dm');
    });
  });
  test.describe('when click on activity button', () => {
    test('should navigate to /activity', async ({ page }) => {
      await page.getByTestId('gnb-activity').click();
      await page.waitForURL('/activity');
      expect(page.url()).toContain('/activity');
    });
  });
  test.describe('when click on discover button', () => {
    test('should navigate to /discover', async ({ page }) => {
      await page.getByTestId('gnb-discover').click();
      await page.waitForURL('/discover');
      expect(page.url()).toContain('/discover');
    });
  });
});
