const postcssPresetEnv = require('postcss-preset-env')
const postcssSafeArea = require('postcss-safe-area')
const postcssShortSize = require('postcss-short-size')
const cssNano = require('cssnano')

const postcssPresetEnvOptions = {
  stage: 0,
  features: {
    // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/src/plugins/plugins-by-id.mjs
    'all-property': false,
    'color-functional-notation': false,

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nested-calc#options
    'nested-calc': { preserve: false },
  },
}

module.exports = ({ options, env }) => ({
  plugins: [
    postcssShortSize(),
    postcssSafeArea(),
    postcssPresetEnv(postcssPresetEnvOptions),
    env === 'production' ? cssNano() : false,
  ],
})
