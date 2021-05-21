import { merge } from 'webpack-merge';
import common from './webpack.common';

export default () =>
  merge(common({ mode: 'production', PROJECT: 'is' }), {
    mode: 'production',
  });
