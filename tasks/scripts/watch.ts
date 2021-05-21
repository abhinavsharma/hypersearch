/* eslint-disable no-console */
import webpack, { StatsChunkGroup, StatsCompilation } from 'webpack';
import chalk from 'chalk';
import config from '../config/webpack.dev';

(async () => {
  let built = false;
  const project = 'is';
  webpack(config({ mode: 'development', PROJECT: project }), (err, stats) => {
    if (err?.message) {
      console.log(chalk.redBright('Unexpected error:', err));
      process.exit(1);
    }

    const errors = stats?.toJson().errors ?? [];

    const statData: StatsCompilation =
      stats?.toJson({
        colors: true,
        assets: true,
        builtAt: true,
        modules: true,
        chunksSort: '!size',
        groupAssetsByChunk: true,
      }) ?? Object.create(null);

    if (!built) {
      console.log(chalk.inverse.bold(' ---   GENERATING ASSETS   --- \n'));
      (Object.values(
        statData.namedChunkGroups ?? Object.create(null),
      ) as StatsChunkGroup[]).forEach((entry) => {
        entry.name &&
          console.log(
            chalk.greenBright.bold(entry.name),
            chalk[entry.isOverSizeLimit ? 'red' : 'black'].bold(
              `${(entry.assetsSize ?? 0) / 1000}KB`,
            ),
          );
      });
    }

    if (errors.length) {
      console.log(chalk.redBright.inverse.bold(`\n  FAILED  \n`));
      Object.values(
        errors.reduce((processed, error) => {
          if (error.loc && error.moduleName) {
            processed[error.moduleName] ??= [];
            processed[error.moduleName].push(error.message);
          } else {
            processed['unexpected'] ??= [];
            processed['unexpected'].push(error.message);
          }
          return processed;
        }, Object.create(null) as Record<string, string[]>),
      ).forEach((messages) => {
        messages.forEach((message) => {
          console.log(message);
        });
      });
    } else {
      console.log(
        chalk.greenBright.inverse.bold(`\n COMPILED `),
        chalk.cyanBright.bold(
          new Date(statData.builtAt ?? 0).toLocaleTimeString(),
          `- Completed in ${(statData.time ?? 0) / 1000} seconds`,
        ),
      );
    }

    if (!built) {
      built = true;
    }
  });
})();
