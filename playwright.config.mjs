import { env } from 'node:process'
import { devices } from '@playwright/test'
import { dateToKebab } from './tests/utils/date.mjs'
import { isInvalidUrl } from './tests/utils/url.mjs'

const baseURL = env.PW_BASE_URL

if (isInvalidUrl(baseURL)) {
  throw new Error(`PW_BASE_URL is not a valid URL: ${baseURL}`)
}

const filename = `${env.SERVER_HOST}-${dateToKebab(new Date())}`

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  // testIgnore: '**accessibility-axe**',

  // Metadata can be used by test suites.
  metadata: {
    filename,
  },

  forbidOnly: !!env.CI,

  retries: env.CI ? 2 : 0,
  workers: env.CI ? 2 : undefined,

  ...(env.CI
    ? { webServer: {
      // @todo: consider the following 👇, but consider the value of baseURL first (local Valet environment: no need for a WebServer)…
      // command: env.CI ? 'vite preview --port 5173' : 'vite dev',
      command: 'npm run preview',
      url: baseURL,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !env.CI,
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
  ].filter(({ name }) => name == 'chromium' || !env.CI),

  reporter: env.CI
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
