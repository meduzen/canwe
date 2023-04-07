import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Can We is the title', async ({ page }) => {
  await expect(page).toHaveTitle(/Can We/)

  const title = page.locator('h1')
await expect(title).toHaveText('Can We')
})
