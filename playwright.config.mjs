import dotenv from 'dotenv';
import { devices } from '@playwright/test'
import { isInvalidUrl } from './tests/utils/url.mjs';

/**
 * Inject `.env` file entries into `process.env` if `.env` file exists.
 * If a variable is transmitted through the command line and already
 * exists in the `.env` file, the one from the command line wins.
 */
dotenv.config()

const baseURL = process.env.PW_BASE_URL

if (isInvalidUrl(baseURL)) {
  throw new Error(`PW_BASE_URL is not a valid URL: ${baseURL}`)
}

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,

  ...(process.env.CI
    ? { webServer: {
      command: 'npm run preview',
      url: baseURL,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env.CI,
    } }
    : null
  ),

  // tons of interesting options: https://playwright.dev/docs/api/class-testoptions
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  // preserveOutput: 'never',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  reporter: process.env.CI ? [['github'], ['html']] : 'list',
}
