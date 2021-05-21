import { merge } from 'webpack-merge';
import common from './webpack.common';

export default () =>
  merge(common({ PROJECT: 'is' }), {
    mode: 'production',
  });
