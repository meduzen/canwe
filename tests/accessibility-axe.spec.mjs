import { test, expect } from '@playwright/test'

// https://playwright.dev/docs/accessibility-testing
// https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright
import AxeCorePlaywright from '@axe-core/playwright'

import { createHtmlReport } from 'axe-html-reporter'
import fs from 'fs'

// Work around https://github.com/dequelabs/axe-core-npm/issues/601
/** @type {import('@axe-core/playwright').default} */
const AxeBuilder = AxeCorePlaywright.default;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('It has no automatically detectable accessibility issues', async ({
  page,
}, testInfo) => {
  const { filename } = testInfo.config.metadata

  const results = await new AxeBuilder({ page }).analyze();

  const violationsCount = results.violations.flatMap(v => v.nodes).length

  await testInfo.attach(`axe-json-${filename}`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  /**
   * Send Axe results to the JSON report.
   *
   * https://playwright.dev/docs/test-annotations#custom-annotations
   */
  // testInfo.annotations.push(results);
  testInfo.annotations.push({
    type: 'axe-violations-count',
    description: `Accessibility violations: ${violationsCount}.`,
    results,
  });

  /**
   * HTML REPORT
   */

  // 1. Generate HTML string from results

  const htmlReport = createHtmlReport({
    results,
    options: {
      doNotCreateReportFile: true,
    }
  })
    // fix syntax highlighting for `file://` protocol
    .replaceAll('//cdnjs', 'https://cdnjs')

  // 2. Save HTML string in file

  const htmlReportDir = 'tests/results/axe-html'
  if (!fs.existsSync(htmlReportDir)) {
    fs.mkdirSync(htmlReportDir, { recursive: true })
  }
  fs.writeFileSync(`${htmlReportDir}/${filename}.html`, htmlReport)

  // 3. Attach HTML report to main Playwright report

  await testInfo.attach(`axe-html-${filename}`, {
    body: htmlReport,
    contentType: 'text/html',
  })

  // console.table(results.violations, [
  //   'index',
  //   'id',
  //   'impact',
  //   'tags',
  //   'description',
  //   'help',
  //   'helpUrl',
  //   'nodes',
  // ])

  // expect(violations.length).toBe(0)
  expect(results.violations.length).toBe(0);
});
