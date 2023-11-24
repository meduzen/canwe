# Can We

A collection of websites focused on browsers usage and features.

## I’d like to propose a _SuperCanSomething website_

Open an [issue](https://github.com/meduzen/canwe/issues) or (faster) a pull request.

## Development

### Content

All good `public/index.html` editing.

### Styles

- `npm install`
- create `.env` from `.env.example`, then edit it
- _(local)_ `npm run dev` or _(prod)_ `npm run build`

Websites colors are CSS custom properties in [`/src/css/config/sites.css`](/src/css/config/sites.css).

### Tests

Tests use [Playwright](https://playwright.dev) and can be run with `npm test`. They can all run locally or in a GitHub action.

Before running tests locally:
- make sure the project is accessible from a URL (e.g. using `npm run preview`);
- add this URL in the `PW_BASE_URL` entry of your `.env`;
- `npx playwright install` pulls the headless browsers used by the test.

You can also play with Playwright GUI by running `npm run test:ui`.

URLs are tested on merge requests using [Lychee](https://lychee.cli.rs) in a GitHub Action. To test URLs locally install Lychee and run `npm run test:absolute-links`.

#### Local tests results

When running the tests locally, the results are in `/tests/results`:
- `{tld}-{timestamp}.json`: JSON report of the test suites;
- `html/index.html`: HTML report of the latest test suites;
- `axe-html/{tld}-{timestamp}-{wcag2-a|wcag2-aa|others}.html`: HTML reports of the accessibility tests, split by category (WCAG 2 A, WCAG 2 AA, others);

#### GitHub Action tests results

When running in a GitHub action, the “summary” view of the GitHub Action has an _artifact_ section at the very bottom. The artifact archive contains the same HTML report as in `html/index.html` when you run tests locally.

When you open it and pick one of the accessibility tests, look into the “attachment” to find the HTML report dedicated to accessibility issues (as well as a JSON file).

## Various

Last deployment:

[![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2F824c8534-5b03-4cf4-9fd5-4e0590d83a6f%3Fdate%3D1%26commit%3D1&style=for-the-badge)](https://forge.laravel.com)
