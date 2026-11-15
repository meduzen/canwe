#!/usr/bin/env bash

# Remove deps not needed from `package.json` before running size-limit.
# This saves some time and disk space.

TIMEFORMAT='Pruned unneeded devDependencies in %3R seconds'

time npm pkg delete \
  "devDependencies.@axe-core/playwright" \
  "devDependencies.@eslint/js" \
  "devDependencies.@playwright/test" \
  "devDependencies.axe-html-reporter" \
  "devDependencies.eslint-formatter-codeframe" \
  "devDependencies.eslint-plugin-playwright" \
  "devDependencies.eslint" \
  "devDependencies.globals" \
  "devDependencies.typescript-eslint" \
  "devDependencies.typescript"
