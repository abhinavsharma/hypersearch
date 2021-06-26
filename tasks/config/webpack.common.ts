import { Configuration, DefinePlugin, Module } from 'webpack';
import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssAutoprefixer from 'autoprefixer';
import PATHS from '../lib/path';

export default (env: { mode: string; PROJECT: 'is' | 'sc' }): Configuration => {
  return {
    entry: {
      insight_background: path.join(__dirname, PATHS.src + '/scripts/background/index.ts'),
      insight_content: path.join(__dirname, PATHS.src + '/scripts/content/index.tsx'),
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
            test: (m: Module) => m.constructor.name === 'CssModule',
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  compileType: 'icss',
                },
              },
            },
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
        'process.env.mode': JSON.stringify(env.mode),
        'process.env.NODE_ENV': JSON.stringify(env.mode),
        'process.env.PROJECT': JSON.stringify(env.PROJECT),
      }),
    ],
  };
};
