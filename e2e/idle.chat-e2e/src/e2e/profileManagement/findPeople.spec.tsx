import { test, expect, Page } from '@playwright/test';

async function typeIntoSearchInput(page: Page) {
  const searchInput = page.getByTestId('search-people-input');
  await searchInput.pressSequentially('John');
  return searchInput;
}

async function blockImageRequest(page: Page) {
  await page.route('**/*', (route) => {
    if (route.request().resourceType() === 'image') route.abort();
    else route.fallback();
  });
}

test.describe('Find people', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/discover');
    await page.routeFromHAR('./networksCache/findPeople.har', {
      url: '**/anime?*',
      update: false,
    });
    await blockImageRequest(page);
  });
  test.describe('Search suggestion people popup', () => {
    test.describe('when being trigged by search input', () => {
      test('should open on input typing', async ({ page }) => {
        await typeIntoSearchInput(page);
        await expect(page.getByTestId('find-people-suggestion-popup')).toBeVisible();
      });

      test('should not open on input focus if user has not type anything', async ({
        page,
      }) => {
        const searchInput = page.getByTestId('search-people-input');
        await searchInput.focus();
        const popup = page.getByTestId('find-people-suggestion-popup');
        await expect(popup).toBeHidden();
      });
      test('should open on input focus if user has type something', async ({
        page,
      }) => {
        const searchInput = page.getByTestId('search-people-input');
        await searchInput.fill('John');
        await searchInput.blur();

        await searchInput.focus();
        const popup = page.getByTestId('find-people-suggestion-popup');
        await expect(popup).toBeVisible();
      });
    });

    test.describe('when being trigged by user action', () => {
      test('should close on press Enter', async ({ page }) => {
        await typeIntoSearchInput(page);

        const searchInput = page.getByTestId('search-people-input');
        await searchInput.press('Enter');
        const searchPopup = page.getByTestId('find-people-suggestion-popup');

        await expect(searchPopup).toBeHidden();
      });
      test('should close on click on search phrase', async ({ page }) => {
        await typeIntoSearchInput(page);

        const searchButton = page.getByTestId('find-people-search-phrase');
        await searchButton.click();
        const searchPopup = page.getByTestId('find-people-suggestion-popup');

        await expect(searchPopup).toBeHidden();
      });
      test('should close on click on suggestion item', async ({ page }) => {
        await typeIntoSearchInput(page);

        const suggestionItem = page.getByTestId('find-people-suggestion-item');
        await suggestionItem.first().click();
        const searchPopup = page.getByTestId('find-people-suggestion-popup');

        await expect(searchPopup).toBeHidden();
      });
    });
  });

  test.describe('Profile view popup', () => {
    test.describe('when being trigger by user event', () => {
      test('should open when user click on an suggestion item', async ({
        page,
      }) => {
        await typeIntoSearchInput(page);

        const suggestionItem = page.getByTestId('find-people-suggestion-item');
        await suggestionItem.first().click();

        const profileViewPopup = page.getByTestId(
          'find-people-profile-view-popup',
        );
        await profileViewPopup.waitFor({ state: 'attached' });
        await expect(profileViewPopup).toBeVisible();
      });
    });
  });
});
