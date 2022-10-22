import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

/**
 * Parses .env file, using `dotenv`.
 *
 * We could use `loadEnv` (from 'vite'), but it exposes too much system values.
 * Despite being used by Vite under the hood, `dotenv` is among the project
 * dev dependencies due to a version difference: Vite sticks to v14.3.2
 * while the project uses v16.x.
 *
 * https://github.com/vitejs/vite/blob/main/packages/vite/package.json#L91
 * https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md
 */
const env = require('dotenv').config().parsed
// const isProd = env.NODE_ENV === 'production'

let outDir = env.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in ./.env) directory must stays inside root level. To fix this error, remove all `../` from `APP_BUILD_DIR`.')
}

// Shortcut to project root path
const thePath = (path = '') => resolve(__dirname, path)

export default defineConfig({
  root: 'src',

  build: {
    envDir: './',
    outDir: `../${outDir}`,
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        app: thePath('./src/index.html'),
      },
    }
  },

  // envPrefix: ['VITE_'],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  server: {
    open: env.BROWSER_OPEN == 'true',
  },

  plugins: [
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: false,
        removeComments: true,
        // removeRedundantAttributes: true,
        // removeScriptTypeAttributes: true,
        // removeStyleLinkTypeAttributes: true,
        // useShortDoctype: true,
        // minifyCSS: true,
      },
    }),
  ],
})
