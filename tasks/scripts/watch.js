/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const prompts = require('prompts');
const config = require('../config/webpack.dev');
const PATHS = require('../lib/path').default;

(async () => {
  let built = false;
  const { project } = await prompts({
    type: 'select',
    name: 'project',
    message: 'Select which project you want to build',
    choices: [
      { title: 'Insight', description: 'The Insight Browser Extension', value: 'is' },
      { title: 'SearchClub', description: 'The SearchClub Browser Extension', value: 'sc' },
    ],
    initial: 1,
  });
  webpack(config({ PROJECT: project }), (err) => {
    if (err) {
      console.log(chalk.redBright('Unexpected error:', err));
      process.exit(1);
    }
    const handleError = (err) => {
      if (err) {
        console.log(chalk.redBright('Unexpected error:', err));
        process.exit(1);
      }
    };
    if (!built) {
      const root = path.join(__dirname, `${PATHS.build}_${project}`);
      fs.rename(`${root}/${project}.logo128-active.png`, `${root}/logo128-active.png`, handleError);
      fs.rename(`${root}/${project}.logo128.png`, `${root}/logo128.png`, handleError);
      fs.rename(`${root}/${project}.manifest.json`, `${root}/manifest.json`, handleError);
    }
    console.log(
      chalk.greenBright(`Compiled successfully at ${new Date(Date.now()).toISOString()}`),
    );
    built = true;
  });
})();
