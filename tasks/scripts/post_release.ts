/* eslint-disable no-console */
import chalk from 'chalk';
import mv from 'mv';
import rimraf from 'rimraf';

(() => {
  const dateTime = new Date().toISOString().split('T');
  mv(
    'dist/web-ext-artifacts',
    `releases/${dateTime[0]}-${dateTime[1].split(':').slice(0, 2).join('-')}`,
    { mkdirp: true },
    (err) => {
      if (err) {
        console.log(chalk.redBright.inverse.bold(`\n  FAILED  \n`));
        console.log(err);
        process.exit(1);
      }
      console.log(chalk.inverse.bold(' ---    CREATED PACKAGE    --- \n'));
    },
  );
  rimraf('dist/web-ext-artifacts', {}, (err) => {
    if (err) {
      console.log(chalk.redBright.inverse.bold(`\n  FAILED  \n`));
      console.log(err);
      process.exit(1);
    }
    console.log(chalk.inverse.bold(' ---   REMOVED ARTIFACT    --- \n'));
  });
})();
