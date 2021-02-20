const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const srcDir = '../src/';

module.exports = {
  entry: {
    background: path.join(__dirname, srcDir + 'background_script.ts'),
    content_script: path.join(__dirname, srcDir + 'content_script.ts'),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        // Using TypeScript requires `ts-loader` to process the source files. This
        // module will take care of compile accroding to the root `tsconfig.json`.
        // Explicit use of any `@babel` plugins is not required, since transpilation
        // is made by `ts-loader`. Specify the ECMAScript target level in the config.
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        // Chaining through style modules allow us to use SaSS files. Comparing this
        // method agains CSS-in-JS libraries, show that SaSS has better performance,
        // also smaller bundle size and memory pollution.
        test: /\.s?[ac]ss$/i,
        use: [
          {
            loader: "style-loader",
            // We have to specify that style are being appended at `document.documentElement`,
            // since loading `style-loader` with the default configuration object will break
            // the workflow and enforeces the `content_script` to be loaded at `document_idle`
            // state which is not acceptable. As a workarond we use this configuration.
            options: {
              insert: "html",
              injectType: "singletonStyleTag"
            }
          },
          'css-loader',
          "sass-loader",
        ],

      },
    ],
  },
  resolve: {
    // We are using absolute paths to for module resolution, so we have to
    // add the root source direactory explicitly here. Now, in code we can
    // write imports as `dir/module` instead `../../dir/module` format.
    modules: ["node_modules", path.join(__dirname, srcDir)],
    // Allow `.js` extension as well, since some externals are not available
    // as TypeScript modules. For example, removing `.js` will throw error
    // when loading `uuid` library.
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: '.', to: '../', context: 'public' }] }),
  ],
};
