import { test, expect } from '@playwright/test'
import { isNotAnchorLink, isInvalidUrl, getAllHrefAttr } from './utils/url.mjs'

test.describe('links', () => {
  /**
   * @type {import('@playwright/test').Page}
   */
  let page

  const $links = () => page.locator('a')
  const $anchorLinks = () => page.locator('a[href^="#"]') // `href=#…`

  test.beforeAll(async ({ browser }) => page = await browser.newPage())
  test.afterAll(async () => await page.close())
  test.beforeEach(async () => await page.goto('/'))

  test('All links have a valid `href` attribute', async () => {
    // @todo: improve this
    const badNonAnchorLinks = (await $links().evaluateAll(getAllHrefAttr)).filter(isInvalidUrl).filter(isNotAnchorLink)
    expect(badNonAnchorLinks).toHaveLength(0)
  })

  test('All external links have a valid URL', async () => {
    const externalUrls = (await $links().evaluateAll(getAllHrefAttr)).filter(isNotAnchorLink)

    const invalidUrls = externalUrls.filter(isInvalidUrl)

    // Prepare error message with the list of invalid URLs.

    if (invalidUrls.length) {
      const urlStr = invalidUrls.length == 1 ? 'URL' : 'URLs'
      var errorStr = `${invalidUrls.length} invalid ${urlStr}: ${invalidUrls.join(', ')}`
    }

    expect(externalUrls, errorStr).toHaveLength(externalUrls.length - invalidUrls.length)
  })

  test('Each anchor link has 1 matching target', async () => {
    const hashes = await $anchorLinks().evaluateAll(getAllHrefAttr)

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

    expect(invalidHashs, errorStr).toHaveLength(0)
  })

  test('It links to the source code from the footer', async () => {
    const repositoryLink = page.locator('footer [itemprop="codeRepository"]')
    await expect(repositoryLink).toHaveAttribute('href', /github.com/)
  })
})
