const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new ChromeExtensionReloader({
            port: 9090,
            reloadPage: true,
            entries: {
                contentScript: 'content_script',
                background: 'background'
            }
        })
    ],
});