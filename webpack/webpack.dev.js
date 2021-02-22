const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ChromeExtensionReloader = require('./extensionReloader');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new ChromeExtensionReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: 'content_script',
        background: 'background',
      },
    }),
  ],
});
