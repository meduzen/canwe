// https://playwright.dev/docs/accessibility-testing
// https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright
import AxeCorePlaywright from '@axe-core/playwright'
import { createHtmlReport as createAxeHtmlReport } from 'axe-html-reporter'
import fs from 'fs'

// Types workaround https://github.com/dequelabs/axe-core-npm/issues/601
/** @type {import('@axe-core/playwright').default} */
const AxeBuilder = AxeCorePlaywright.default

export const axeCategories = [
  {
    id: 'axe-wcag2-a',
    name: 'WCAG 2.0 Level A',
    tags: ['wcag2a', 'wcag21a'],
  },
  {
    id: 'axe-wcag2-aa',
    name: 'WCAG 2.0 Level AA',
    tags: ['wcag2aa', 'wcag21aa', 'wcag22aa'],
  },
  {
    id: 'axe-others',
    name: 'Best Practices and experimental rules',
    tags: ['best-practice', 'experimental'],
  },
]

/**
 * Test the accessibility of a page using Axe.
 *
 * https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
 * https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#axe-core-tags
 * https://www.deque.com/axe/core-documentation/api-documentation/#api-notes
 *
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string|string[]} tags Axe tags
 * @returns {Promise<import('axe-core').AxeResults>}
 */
export const testAccessibilty = (page, tags = null) => {
  const axeBuilder = new AxeBuilder({ page })

  if (tags) {
    axeBuilder.withTags(tags)
  }

  return axeBuilder.analyze()
}

/**
 * Create HTML report from Axe results and save it to filesystem.
 *
 * @param {import('axe-core').AxeResults} results Axe results
 * @param {string} filename
 * @returns {string}
 */
export const createHtmlReport = (results, filename) => {

  // Generate HTML report from results.

  const htmlReport = createAxeHtmlReport({
    results,
    options: {
      doNotCreateReportFile: true,
    }
  })
    // fix syntax highlighting for `file://` protocol
    .replaceAll('//cdnjs', 'https://cdnjs')

  // Save HTML report in filesystem.

  const htmlReportDir = 'tests/results/axe-html'
  if (!fs.existsSync(htmlReportDir)) {
    fs.mkdirSync(htmlReportDir, { recursive: true })
  }
  fs.writeFileSync(`${htmlReportDir}/${filename}.html`, htmlReport)

  return htmlReport
}
