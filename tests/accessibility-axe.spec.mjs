import { test, expect } from '@playwright/test'
import { axeCategories, createHtmlReport, testAccessibilty } from './utils/axe-core.mjs'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
});

axeCategories.forEach(({ name, tags, id }) =>
  test(`It has no automatically detectable accessibility issues of category “${name}”`, async ({
    page,
  }, testInfo) => {
    const { filename } = testInfo.config.metadata

    const results = await testAccessibilty(page, tags)
    const violationsCount = results.violations.flatMap(v => v.nodes).length
    const htmlReport = createHtmlReport(results, `${filename}-${id}`)

    // Attach JSON and HTML reports to the test results.
    await Promise.allSettled([
      testInfo.attach(`${id}-json-${filename}`, {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      }),
      testInfo.attach(`${id}-html-${filename}`, {
        body: htmlReport,
        contentType: 'text/html',
      })
    ])

    /**
     * Attach Axe results to the JSON report.
     * https://playwright.dev/docs/test-annotations#custom-annotations
     */
    testInfo.annotations.push({
      type: `${id}-violations-count`,
      description: `Accessibility violations (${name}): ${violationsCount}.`,
      results,
    });

    expect(violationsCount).toBe(0)
  })
)
