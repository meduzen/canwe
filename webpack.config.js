const webpack = require('webpack')

// env
const env = require('dotenv').config().parsed
const isProd = process.env.NODE_ENV === 'production'
const mode = isProd ? 'production' : 'development'

// path
const path = require('path')
const thePath = (folder = '') => path.resolve(__dirname, folder)
const assets = 'src'

// plugins: folder cleaning
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// plugins: reload & cli output
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const NotifierPlugin = require('webpack-build-notifier')

// plugins: CSS & JS
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Notifications options
const NotifierPluginOptions = {
  logo: thePath('src/app/android-chrome-192x192.png'),
  sound: false,
  notifyOptions: { timeout: 2 },
  messageFormatter: (error, filepath) => filepath,
}

/* BrowserSync HTTPS with Laravel Valet
 *
 * BrowserSync HTTPS: https://www.browsersync.io/docs/options#option-https
 * Laravel Valet HTTPS: https://laravel.com/docs/5.7/valet#securing-sites
 */

let browserSyncHttps = false

if (
  env.VALET_HTTPS === 'true'
  && typeof(env.VALET_USER) === 'string'
  && env.VALET_CERTIFICATES_PATH
) {
  let certificatesPath = `/Users/${env.VALET_USER}/${env.VALET_CERTIFICATES_PATH}/${env.MIX_BS_LOCAL_URL.substring(8)}`

  browserSyncHttps = {
    key: `${certificatesPath}.key`,
    cert: `${certificatesPath}.crt`,
  }
}

/* CSS */

config = {

  entry: {
    app: `./${assets}/sass/app.scss`,
  },

  output: {
    path: thePath('public'),
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: thePath(`${assets}/sass`),
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 2, url: false, sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: {
            implementation: require('node-sass'),
            sassOptions: { outputStyle: 'expanded' },
            sourceMap: true
          }},
        ],
      },
      {
        test: /\.(jpg|png)$/,
        include: thePath(`${assets}/img`),
        type: 'asset/resource',
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyPlugin({ patterns: [
      { from: `${assets}/fonts/`, to: thePath('public/fonts') },
      { from: `${assets}/img/`, to: thePath('public/img') },
      { from: `${assets}/manifest/`, to: thePath('public') },
    ]}),
    // new CleanWebpackPlugin(),
    new FriendlyErrorsPlugin(),
    new NotifierPlugin({ title: 'CSS', ...NotifierPluginOptions }),
    new BrowserSyncPlugin({
      https: browserSyncHttps,
      host: env.MIX_BS_HOST,
      proxy: env.MIX_BS_LOCAL_URL,
      browser: env.MIX_BS_BROWSER,
      open: env.MIX_BS_OPEN,
      logPrefix: env.APP_NAME,
      files: [
        'src/**/*.*',
        'public/**/*.*',
      ],
    }, {
      injectCss: true, // will work once PR merged: https://github.com/Va1/browser-sync-webpack-plugin/pull/79
    }),
  ],

  mode,

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  devServer: {
    quiet: true,
  },

  performance: {
    hints: false,
  },

  stats: {
    children: false,
    entrypoints: false,
    excludeAssets: /^((?!\.css$).)*$/,
    hash: false,
    modules: false,
    version: false,
  },
}

module.exports = [config]
