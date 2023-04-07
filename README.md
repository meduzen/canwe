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

Websites colors are CSS custom properties in [`/src/sass/site/_colors.scss`](/src/sass/site/_colors.scss)

### Tests

Tests use [Playwright](https://playwright.dev) and can be run with `npm test`.

Before being able to run tests:
- make sure the project is accessible from a URL;
- add this URL in the `PW_BASE_URL` entry of your `.env`;
- `npx playwright install` pulls the headless browsers used by the test.

You can also play with Playwright GUI by running `npm run test-gui`.

## Various

Last deployment:

[![Laravel Forge Site Deployment Status](https://img.shields.io/endpoint?url=https%3A%2F%2Fforge.laravel.com%2Fsite-badges%2F824c8534-5b03-4cf4-9fd5-4e0590d83a6f%3Fdate%3D1%26commit%3D1&style=for-the-badge)](https://forge.laravel.com)
