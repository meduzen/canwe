const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

module.exports = ({ options, env }) => ({
  plugins: [
    postcssPresetEnv({
      stage: 0,
      features: {
        // https://github.com/csstools/postcss-preset-env/blob/master/src/lib/plugins-by-id.js
        'all-property': false,
        'color-functional-notation': false,
        'focus-within-pseudo-class': false,
        'prefers-color-scheme-query': false,
      },
    }),
    env === 'production' ? cssNano() : false,
  ],
})
