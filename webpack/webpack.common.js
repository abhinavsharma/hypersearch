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
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: ["node_modules", path.join(__dirname, srcDir)],
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({ patterns: [{ from: '.', to: '../', context: 'public' }] }),
  ],
};
