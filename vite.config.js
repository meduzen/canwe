import { defineConfig } from 'vite'
import { resolve } from 'path'

// env
const env = require('dotenv').config().parsed
console.log(env)
// const isProd = env.NODE_ENV === 'production'

let outDir = env.APP_BUILD_DIR || 'public'

// Prevents to output app files outside of the project root.
if (outDir.includes('../')) {
  throw new Error('APP_BUILD_DIR (in the .env file) can’t point to an upper-level directory. Remove all `../`.')
}

// helper to root project path
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
})
