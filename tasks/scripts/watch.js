/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../config/webpack.dev');

(async () => {
  const project = 'is';
  webpack(config({ PROJECT: project }), (err, stat) => {
    if (err) {
      console.log(chalk.redBright('Unexpected error:', err));
      process.exit(1);
    }
    console.log(
      stat.toJson().errors.length
        ? chalk.redBright.bold(
            stat
              .toJson()
              .errors.map(
                (error, i) =>
                  `\n${i + 1}.) Error in module: ${error.moduleName}\nCheck line: ${
                    error.loc || 'N/A'
                  }`,
              )
              .join('\n'),
          )
        : chalk.greenBright(`Compiled successfully at ${new Date(Date.now()).toISOString()}`),
    );
    built = true;
  });
})();
