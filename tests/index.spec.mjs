import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('/')
})

test('Can We is the title', async ({ page }) => {
  await expect(page).toHaveTitle(/Can We/)

  const title = page.locator('h1')
  await expect(title).toHaveText('Can We')
})

test('All links have a non-empty `href` attribute', async ({ page }) => {
  const badLinks = await page.$('a:not([href]), a[href=""]')
  await expect(badLinks).toBeNull()
})

test('It links to the source code from the footer', async ({ page }) => {
  const repositoryLink = page.locator('footer [itemprop="codeRepository"]')
  await expect(repositoryLink).toHaveAttribute('href', /github.com/)
})
