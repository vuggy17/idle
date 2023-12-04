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
    await page.routeFromHAR('./src/.cache/network/search-suggestions', {
      url: '**/search-suggestions?*',
      update: false,
    });
    await page.routeFromHAR(
      './src/.cache/network/search-result-with-query.har',
      {
        url: '**/search-result?*',
        update: false,
      },
    );
    await page.routeFromHAR('./src/.cache/network/search-result-detail.har', {
      url: '**/search-result/*',
      update: false,
    });
    await blockImageRequest(page);
  });
  test.describe('Search suggestion people popup', () => {
    test.describe('when being trigged by search input', () => {
      test('should open on input typing', async ({ page }) => {
        await typeIntoSearchInput(page);
        await expect(
          page.getByTestId('find-people-suggestion-popup'),
        ).toBeVisible();
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
      test('should close when user clear their query', async ({ page }) => {
        await typeIntoSearchInput(page);

        const searchInput = page.getByTestId('search-people-input');
        await searchInput.clear();

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

  test.describe('Search result list', () => {
    test.describe('when user hit enter on search input', () => {
      test('should display', async ({ page }) => {
        await typeIntoSearchInput(page);
        await page.getByTestId('search-people-input').press('Enter');

        await expect(page.getByTestId('find-people-friend-list')).toBeVisible();
      });
    });
    test.describe('when press see all button', () => {
      test('should expand', async ({ page }) => {
        await typeIntoSearchInput(page);
        await page.getByTestId('search-people-input').press('Enter');

        const friendList = page.getByTestId('find-people-friend-list');
        const before = await friendList.locator('li').count();
        await page.getByText('see all').click();

        await expect(page.getByText('see all')).toBeHidden();
        const after = await friendList.locator('li').count();
        expect(after).toBeGreaterThan(before);
      });
    });

    // THIS TEST SUITE RELY ON API RESULT, IT WOULD BREAK IF API RESULT HAS CHANGED
    test.describe('when click on add friend button', () => {
      test('should change to invitation sent button', async ({ page }) => {
        await typeIntoSearchInput(page);
        await page.getByTestId('search-people-input').press('Enter');
        const friendList = page.getByTestId('find-people-people-list');
        await expect(friendList).toBeVisible();

        const firstLi = friendList
          .locator('li')
          .first()
          .getByTestId('find-people-result-action-btn');
        expect(await firstLi.innerText()).toContain('Add friend');
        await firstLi.click();

        expect(await firstLi.innerText()).toContain('Invitation sent');
      });
      test('should change to add friend button', async ({ page }) => {
        await typeIntoSearchInput(page);
        await page.getByTestId('search-people-input').press('Enter');
        const friendList = page.getByTestId('find-people-people-list');
        await expect(friendList).toBeVisible();

        const lastItem = friendList
          .locator('li')
          .last()
          .getByTestId('find-people-result-action-btn');
        expect(await lastItem.innerText()).toContain('Invitation sent');
        await lastItem.click();

        expect(await lastItem.innerText()).toContain('Add friend');
      });
    });
  });
});
