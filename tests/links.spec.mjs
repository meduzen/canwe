import { test, expect } from '@playwright/test'
import { isNotAnchorLink, isInvalidUrl, getAllHrefAttr } from './utils/url.mjs'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('All links have a non-empty `href` attribute', async ({ page }) => {
  const badLinksCount = await page.locator('css=a:not([href]), a[href=""]').count()
  expect(badLinksCount).toBe(0)
})

test('All external links have a valid URL', async ({ page }) => {
  const a = page.locator('a')

  const externalUrls = (await a.evaluateAll(getAllHrefAttr)).filter(isNotAnchorLink)

  const invalidUrls = externalUrls.filter(isInvalidUrl)

  // Prepare error message with the list of invalid URLs.

  if (invalidUrls.length) {
    const urlStr = invalidUrls.length == 1 ? 'URL' : 'URLs'
    var errorStr = `${invalidUrls.length} invalid ${urlStr}: ${invalidUrls.join(', ')}`
  }

  expect(externalUrls, errorStr).toHaveLength(externalUrls.length - invalidUrls.length)
})

test('Each anchor link has 1 matching target', async ({ page }) => {
  const a = page.locator('a[href^="#"]') // `href` starting by `#`.

  const hashes = await a.evaluateAll(getAllHrefAttr)

  // Check the targets of anchor links. Each hash must have exactly 1 target.

  const invalidHashs = []

  await Promise.allSettled(hashes.map(hash =>
    page.locator(hash)
      .count()
      .then(count => {
        if (count !== 1) { throw new Error() }
      })
      .catch(() => invalidHashs.push(hash))
  ))

  // Prepare error message with the list of invalid hashes.

  if (invalidHashs.length) {
    const hashStr = invalidHashs.length == 1 ? 'hash' : 'hashes'
    var errorStr = `${invalidHashs.length} invalid ${hashStr}: ${invalidHashs.join(', ')}`
  }

  expect(hashes, errorStr).toHaveLength(hashes.length - invalidHashs.length)
})

test('It links to the source code from the footer', async ({ page }) => {
  const repositoryLink = page.locator('footer [itemprop="codeRepository"]')
  await expect(repositoryLink).toHaveAttribute('href', /github.com/)
})
