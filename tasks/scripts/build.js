/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../config/webpack.prod');

(async () => {
  const project = 'is';
  webpack(config({ PROJECT: project, mode: 'production' })).run((err) => {
    if (err) {
      console.log(chalk.redBright('Unexpected error:', err));
      process.exit(1);
    }
    console.log(chalk.greenBright('Compiled successfully!\n'));
  });
})();
