import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';

export default (env: { mode: string; PROJECT: 'is' | 'sc' }) =>
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
  } as Configuration);
