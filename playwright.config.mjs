import dotenv from 'dotenv'
import { devices } from '@playwright/test'
import { dateToKebab } from './tests/utils/date.mjs'
import { isInvalidUrl } from './tests/utils/url.mjs'

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

const filename = `${process.env.SERVER_HOST}-${dateToKebab(new Date())}`

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  // testIgnore: '**accessibility-axe**',

  // Metadata can be used by test suites.
  metadata: {
    filename,
  },

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  ...(process.env.CI
    ? { webServer: {
      // @todo: consider the following 👇, but consider the value of baseURL first (local Valet environment: no need for a WebServer)…
      // command: process.env.CI ? 'vite preview --port 5173' : 'vite dev',
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

  // In CI environment, only run Chromium
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
  ].filter(({ name }) => name == 'chromium' || !process.env.CI),

  reporter: process.env.CI
    ? [['github'], ['html']]
    : [
      // ['dot'],
      // ['list'],
      ['html', {
        open: 'never',
        outputFile: `${filename}.html`, // ignored…, index.html must have its subfolder, otherwise it erases other existing files
        outputFolder: `tests/results/html`,
      }],
      ['json', {
        outputFile: `tests/results/${filename}.json`,
      }],
    ]
  ,
}
