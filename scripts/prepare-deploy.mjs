/**
 * @file Running this script before `npm ci` (e.g. in a deployment script) will
 * remove the `devDependencies` that are not needed in order to deploy. This
 * way, `npm ci` will install less files and won’t bloat your disk space.
 *
 * This is an all-or-nothing script: if a dependency has an invalid name or if
 * NPM fails at removing one of them, none will be removed. This is because
 * `npm pkg delete` is called once with all dependencies (fast). This is
 * way faster than calling it once per dependency.
 */

import { execSync } from 'node:child_process'
import console, { warn } from 'node:console'

/** The list of `devDependencies` not needed to build the app. */
const USELESS_DEPS = [
  '@axe-core/playwright',
  '@eslint/js',
  '@playwright/test',
  '@size-limit/preset-app',
  'axe-html-reporter',
  'eslint-formatter-codeframe',
  'eslint-plugin-playwright',
  'eslint',
  'globals',
  'size-limit',
  'typescript-eslint',
  'typescript',
]

const benchmarkLabel = 'Cleaning of devDependencies list'

console.time(benchmarkLabel)

sliceDevDependencies(USELESS_DEPS)

console.timeEnd(benchmarkLabel);

/**
 * Remove `devDependencies` from `package.json`.
 *
 * @param {string[]} devDeps A list of devDependencies names.
 */
function sliceDevDependencies(devDeps) {
  const depsArgs = devDeps
    /**
     * Exclude invalid names, which reduces the risk of failure since we try
     * to remove all deps in one command: they’ll all be deleted or fail.
     */
    .filter(hasValidName)

    // Wrap dep names with single quotes, which is needed for `@scope/name` deps.
    .map(dep => `'${dep}'`)

    // Create a space-separated list of `devDepencies.'(@scope/)name'`.
    .join(` devDependencies.`)

  if (depsArgs.length) {
    try {
      execSync(`npm pkg delete devDependencies.${depsArgs}`, {
        stdio: 'inherit',
        timeout: 5000,
      })
    } catch (error) {
      warn(`Slicing of devDepencencies failed: ${error.message}`);
    }
  } else {
    warn('No devDepencencies to slice.');
  }
}

/** @param {string} name The name of the dependency. */
function hasValidName (name) {
  const isValid = /^[a-zA-Z0-9@/_.-]+$/.test(name)

  if (!isValid) {
    warn(`Invalid dependency name: ${name} will stay.`)
  }

  return isValid
}
