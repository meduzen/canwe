#!/usr/bin/env bash

# Remove deps not needed from `package.json` before running Playwright.
# This saves some time and disk space.

TIMEFORMAT='Pruned unneeded devDependencies in %3R seconds'

time npm pkg delete \
  "devDependencies.@eslint/js" \
  "devDependencies.@size-limit/preset-app" \
  "devDependencies.eslint-formatter-codeframe" \
  "devDependencies.eslint-plugin-playwright" \
  "devDependencies.eslint" \
  "devDependencies.globals" \
  "devDependencies.size-limit" \
  "devDependencies.typescript-eslint" \
  "devDependencies.typescript"
