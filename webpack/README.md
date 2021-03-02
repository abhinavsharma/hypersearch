# Build configurations

The application is using [Webpack](https://webpack.js.org/concepts/) to build the source code. There are separated configurations for
*development* and *production* build. Both configuration outputs in the `dist` folder.

Development configuration creates source-maps and loads the extension with a pre-built custom fork of [webpack-chrome-extension-reloader](https://www.npmjs.com/package/webpack-chrome-extension-reloader). This is avalable from the `extensionReloader.js`, which is a compiled distibution code of the fork.

Production configuration omits source-maps and HMR server from the build. Also, this will run with `production` flag to minify and optimize the source code.