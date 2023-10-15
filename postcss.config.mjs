import postcssPresetEnv from 'postcss-preset-env'
import postcssSafeArea from 'postcss-safe-area'
import postcssSize from 'postcss-size'
import cssNano from 'cssnano'

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

export default ({ options, env }) => ({
  plugins: [
    postcssSize(),
    postcssSafeArea(),
    postcssPresetEnv(postcssPresetEnvOptions),
    env === 'production' ? cssNano() : false,
  ],
})
