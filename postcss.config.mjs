import postcssPresetEnv from 'postcss-preset-env'
import postcssSize from 'postcss-size'
import cssNano from 'cssnano'

/** @type {import('postcss-preset-env').pluginOptions} */
const postcssPresetEnvOptions = {
  stage: 0,

  // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
  features: {

    // https://github.com/maximkoretskiy/postcss-initial
    'all-property': false,

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-color-functional-notation
    'color-functional-notation': false,

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nested-calc#options
    'nested-calc': { preserve: false },

    // https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting
    'nesting-rules': true,
  },
}

export default ({ options, env }) => ({
  /**
   * The SCSS parser is used to allow inline comments in CSS files and to avoid
   * crashes on some unknown keywords like `@container`.
   */
  parser: 'postcss-scss',
  plugins: [
    postcssSize(),
    postcssPresetEnv(postcssPresetEnvOptions),
    env === 'production' ? cssNano() : false,
  ],
})
