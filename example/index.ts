// tslint:disable:no-console
// tslint:disable:no-console
// tslint:disable:no-magic-numbers

import { UberCron } from '../src/index';

/** Example using the uber-cron module */
class Example {

  static async simpleExecution() {
    const cronJob = new UberCron('simpleJob', {
      cronTime: '*/1 * * * * *',
      start: true,
      logger: null,
      onTick: () => console.log(`[${new Date().toISOString()}] Job being executed right now!`),
    });

    setTimeout(() => cronJob.stop(), 3500);
  }

  static async limitNumParallelExecutions() {
    const cronJob = new UberCron('parallelJob', {
      cronTime: '*/1 * * * * *',
      start: true,
      numParallelExecutions: 1,
      onTick: async () => { await new Promise((resolve, reject) => setTimeout(resolve, 3500)); },
    });

    setTimeout(() => cronJob.stop(), 5500);
  }

  static async errorOnJobExecution() {
    const cronJob = new UberCron('errorJob', {
      cronTime: '*/1 * * * * *',
      onTick: async () => { throw new Error('Error thrown during job execution'); },
      stopOnError: true,
    });
    cronJob.start();
  }
}

Example.simpleExecution();
