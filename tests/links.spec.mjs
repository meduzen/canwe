import { test, expect } from '@playwright/test'
import { isInvalidUrl } from './utils/url.mjs'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('All links have a non-empty `href` attribute', async ({ page }) => {
  const badLinks = await page.$('a:not([href]), a[href=""]')
  expect(badLinks).toBeNull()
})

test('All links have a valid external URL', async ({ page }) => {
  const a = page.locator('a')

  /**
   * Gather all `href` attributes from `<a>` elements.
   *
   * We use `.getAttribute('href')` instead of `.href` because the latter one
   * resolves to a relative URL when the URL protocol is missing. It works
   * for this website where all the links are expected to be external.
   *
   * - `link.getAttribute('href')`: 'something' (invalid URL)
   * - resolved `link.href`: 'http://127.0.0.1:5173/something' (valid URL)
   */
  const urls = await a.evaluateAll($els => $els.map(link => link.getAttribute('href')))

  const invalidUrls = urls.filter(isInvalidUrl)

  // Prepare error message with the list of invalid URLs.

  if (invalidUrls.length) {
    const urlStr = invalidUrls.length > 1 ? 'URLs' : 'URL'
    var errorStr = `${invalidUrls.length} invalid ${urlStr}: ${invalidUrls.join(', ')}`
  }

  expect(invalidUrls.length, errorStr).toBe(0)
})

test('It links to the source code from the footer', async ({ page }) => {
  const repositoryLink = page.locator('footer [itemprop="codeRepository"]')
  await expect(repositoryLink).toHaveAttribute('href', /github.com/)
})
