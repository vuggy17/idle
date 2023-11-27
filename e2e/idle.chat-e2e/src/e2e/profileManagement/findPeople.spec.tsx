import { test, expect } from '@playwright/test';

test.describe('Search people popup', () => {
  test.beforeEach(async ({ page }) => {
    console.log('before each');
    await page.goto('http://localhost:4200/discover');
  });

  test.describe('when being trigged by search input', () => {
    test('should open on input typing', async ({ page }) => {
      await page.getByTestId('search-people-input').pressSequentially('John');
      expect(page.getByTestId('find-people-suggestion-popup')).toBeVisible();
    });

    test('should not open on input focus if user has not type anything', async ({
      page,
    }) => {
      const searchInput = page.getByTestId('search-people-input');
      await searchInput.focus();
      const popup = page.getByTestId('find-people-suggestion-popup');
      expect(popup).toBeHidden();
    });
    test('should open on input focus if user has type something', async ({
      page,
    }) => {
      const searchInput = page.getByTestId('search-people-input');
      await searchInput.fill('John');
      await searchInput.blur();

      await searchInput.focus();
      const popup = page.getByTestId('find-people-suggestion-popup');
      expect(popup).toBeVisible();
    });
  });

  test.describe('when being trigged by user action', () => {
    test.beforeEach(async ({ page }) => {
      // open popup
      const searchInput = page.getByTestId('search-people-input');
      await searchInput.pressSequentially('John');
    });
    test('should close on press Enter', async ({ page }) => {
      const searchInput = page.getByTestId('search-people-input');
      await searchInput.press('Enter');
      const searchPopup = page.getByTestId('find-people-suggestion-popup');
      expect(searchPopup).toBeHidden();
    });
    test('should close on click on search phrase', async ({ page }) => {
      const searchButton = page.getByTestId('find-people-search-phrase');
      await searchButton.click();

      const searchPopup = page.getByTestId('find-people-suggestion-popup');
      expect(searchPopup).toBeHidden();
    });
  });
});
