import { resolve } from 'node:path'
import { homedir } from 'node:os'
import { env } from 'node:process'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import eslintPlugin from 'vite-plugin-eslint'

const isProd = env?.NODE_ENV === 'production'

let outDir = env?.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in ./.env) directory must stays inside root level. To fix this error, remove all `../` from `APP_BUILD_DIR`.')
}

// ESLint Options
const esLintOptions = {
  cache: false, // cache is cleaned on `npm install`
  cacheStrategy: 'content',
  fix: env?.ES_LINT_AUTOFIX == 'true',
  formatter: env?.ES_LINT_FORMATTER ?? 'stylish',
}

/**
 * HTTPS, works well with Laravel Valet (macOS)
 * Laravel Valet HTTPS: https://github.com/laravel/docs/blob/master/valet.md#securing-sites-with-tls
 * Not tested with other setups.
 */

const host = env?.SERVER_HOST ?? null
let https = env?.SERVER_HTTPS === 'true'

if (https && host && env.SERVER_CERTIFICATES_DIR) {
  const certificatesPath = `${homedir()}/${env.SERVER_CERTIFICATES_DIR}/${host}`

  https = {
    key: `${certificatesPath}.key`,
    cert: `${certificatesPath}.crt`,
  }
}

export default defineConfig({
  root: 'src',

  css: {
    devSourcemap: true,
  },

  build: {
    envDir: './',
    outDir: `../${outDir}`,
    emptyOutDir: true,
    cssCodeSplit: false,
    /**
     * esbuild compensates https://github.com/cssnano/cssnano/issues/1488.
     * `cssMinify` won’t be disabled until the issue is fixed.
     */
    // cssMinify: false,
    rollupOptions: {
      input: {
        app: resolve('./src/index.html'),
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
    open: env?.BROWSER_OPEN === 'true',
    ...(host ? { host } : null),
    https,
  },

  plugins: [
    ...(isProd ? [] : [{
      ...eslintPlugin(esLintOptions),
      enforce: 'pre',
    }]),

    /**
     * Minify HTML: if unmaintained in the long run, see alternatives in
     * https://github.com/vbenjs/vite-plugin-html/issues/112#issuecomment-1455160080
     */
    createHtmlPlugin({
      viteNext: true, // prevent deprecation messages output by Vite 5
      minify: {
        collapseWhitespace: false, // create bug: https://github.com/meduzen/canwe/issues/129
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
