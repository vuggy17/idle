import { defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';

import { workspaceRoot } from '@nx/devkit';
import path = require('path');

export const STORAGE_STATE = path.join(
  __dirname,
  'src/.cache/storage/user.json',
);
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm exec nx serve idle.chat',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global.setup\.ts/,
    },
    {
      name: 'profile-management',
      testDir: 'src/e2e/profile-management',
      // enable this line when login toke expire
      // dependencies: ['setup'],
      use: {
        ...devices['Desktop Edge'],
        storageState: STORAGE_STATE,
      },
    },
    {
      name: 'app',
      testDir: 'src/e2e/app',
      // enable this line when login toke expire
      // dependencies: ['setup'],
      use: {
        ...devices['Desktop Edge'],
        storageState: STORAGE_STATE,
      },
    },
  ],
});
