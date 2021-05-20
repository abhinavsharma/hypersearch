/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssAutoprefixer = require('autoprefixer');
const PATHS = require('../lib/path').default;

module.exports = (env) => {
  return {
    entry: {
      insight_background: path.join(__dirname, PATHS.src + '/scripts/background.ts'),
      insight_hot_reload: path.join(__dirname, PATHS.src + '/scripts/hot.ts'),
      insight_main_content: path.join(__dirname, PATHS.src + '/scripts/main.ts'),
      insight_frame_content: path.join(__dirname, PATHS.src + '/scripts/frame.ts'),
      insight_block_content: path.join(__dirname, PATHS.src + '/scripts/block.ts'),
      insight_reorder_content: path.join(__dirname, PATHS.src + '/scripts/reorder.ts'),
      insight_introduction_content: path.join(__dirname, PATHS.src + '/scripts/introduction.tsx'),
    },
    output: {
      path: path.join(__dirname, `${env.mode === 'production' ? PATHS.dist : PATHS.build}/js`),
      filename: '[name].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'bundle',
            test: (m) => m.constructor.name === 'CssModule',
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s?[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [CssAutoprefixer],
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      modules: ['node_modules', path.join(__dirname, PATHS.src)],
      extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '../[name].css',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: `./*.(css|html|svg|json|png)`,
            to: '../',
            context: 'public',
          },
        ],
      }),
      new DefinePlugin({
        'process.env.PROJECT': JSON.stringify(env.PROJECT),
      }),
    ],
  };
};
