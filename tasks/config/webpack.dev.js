/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = (env) =>
  merge(common(env), {
    mode: 'development',
    watch: true,
    watchOptions: {
      poll: 1000,
      followSymlinks: true,
      aggregateTimeout: 500,
    },
    devServer: {
      stats: 'errors-only',
    },
    devtool: 'cheap-module-source-map',
  });
