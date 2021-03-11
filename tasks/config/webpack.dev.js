/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ChromeExtensionReloader = require('../lib/extensionReloader');

module.exports = (env) =>
  merge(common(env), {
    mode: 'development',
    watch: true,
    devtool: 'cheap-module-source-map',
    plugins: [
      new ChromeExtensionReloader({
        port: 9090,
        reloadPage: true,
        entries: {
          contentScript: ['content_script', 'content_frames', 'content_blocker'],
          background: 'background',
        },
      }),
    ],
  });
