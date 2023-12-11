import test, { expect } from '@playwright/test';
import { friendRequests } from './../../fixtures/profileManagement.json';
test.describe('Friend request', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/discover/friend_requests');
  });
  test.describe('request list', () => {
    test('should display normally', async ({ page }) => {
      await page.route('**/*/invitation', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(friendRequests),
        });
      });

      await expect(page.getByTestId('friend-invitation_list')).toBeVisible();
    });
    test('should display error result when server error', async ({ page }) => {
      await expect(page.getByTestId('friend-invitation_error')).toBeVisible();
    });
  });
  test.describe('when click on accept request button', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/*/invitation?*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            isValid: true,
          }),
        });
      });
      await page.route('**/*/invitation', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(friendRequests),
        });
      });
    });
    test('should display accepted message', async ({ page }) => {
      await page.getByTestId('friend-invitation__accept').first().click();

      await expect(
        page.getByTestId('friend-invitation__accept--accepted'),
      ).toBeVisible();

      expect(
        await page
          .getByTestId('friend-invitation__accept--accepted')
          .innerText(),
      ).toContain('Accepted friend request');
    });
    test('should display deleted message', async ({ page }) => {
      await page.getByTestId('friend-invitation__delete').first().click();

      await expect(
        page.getByTestId('friend-invitation__delete--deleted'),
      ).toBeVisible();

      expect(
        await page
          .getByTestId('friend-invitation__delete--deleted')
          .innerText(),
      ).toContain('Deleted');
    });
  });

  test.describe('when server cannot verify the request', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/*/invitation', (route) => {
        const method = route.request().method();
        if (method == 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(friendRequests),
          });
        } else if (method == 'POST') route.abort();
        else route.fallback();
      });

      await page.route('**/*/invitation?*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            isValid: true,
          }),
        });
      });
    });
    test('should handle server error when accepting a friend request', async ({
      page,
    }) => {
      await page.getByTestId('friend-invitation__accept').first().click();
      await expect(page.getByRole('alert')).toBeVisible();
    });
    test('should handle server error when declining a friend request', async ({
      page,
    }) => {
      await page.getByTestId('friend-invitation__accept').first().click();
      await expect(page.getByRole('alert')).toBeVisible();
    });
  });

  test.describe('when server encountered unknown error with accept/decline request', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/*/invitation', (route) => {
        const method = route.request().method();
        if (method == 'GET') {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(friendRequests),
          });
        } else if (method == 'POST') {
          route.abort();
        } else route.fallback();
      });

      await page.route('**/*/invitation?*', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            isValid: true,
          }),
        });
      });
    });
    test('should handle server error when accepting a friend request', async ({
      page,
    }) => {
      await page.getByTestId('friend-invitation__accept').first().click();
      await expect(page.getByRole('alert')).toBeVisible();
    });
    test('should handle server error when declining a friend request', async ({
      page,
    }) => {
      await page.getByTestId('friend-invitation__accept').first().click();
      await expect(page.getByRole('alert')).toBeVisible();
    });
  });
});
