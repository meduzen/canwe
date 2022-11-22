import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('All links have a non-empty `href` attribute', async ({ page }) => {
  const badLinks = await page.$('a:not([href]), a[href=""]')
  await expect(badLinks).toBeNull()
})

test('All links are valid `href` attribute', async ({ page }) => {
  const links = await page.$$('a[href]')

  const invalidUrls = []
  for (let index = 0; index < links.length; index++) {
    const url = await links[index].getAttribute('href')

    try { new URL(url) }
    catch (error) { invalidUrls.push(url) }
  }

  // Show wrong URLs.
  if (invalidUrls.length) {
    const urlStr = invalidUrls.length > 1 ? 'URLs' : 'URL'
    var errorStr = `${invalidUrls.length} invalid ${urlStr}: ${invalidUrls.join(', ')}`
  }

  await expect(invalidUrls.length, errorStr).toBe(0)
})

test('It links to the source code from the footer', async ({ page }) => {
  const repositoryLink = page.locator('footer [itemprop="codeRepository"]')
  await expect(repositoryLink).toHaveAttribute('href', /github.com/)
})
