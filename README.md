# UBER CRON

[![](https://img.shields.io/badge/TypeScript-v3-blue.svg?style=flat)](https://github.com/decentro-gmbh/uber-cron/blob/master/package.json
) [![](https://img.shields.io/npm/v/uber-cron.svg)](https://www.npmjs.com/package/uber-cron
) [![](https://img.shields.io/snyk/vulnerabilities/npm/uber-cron.svg)](https://snyk.io/test/npm/uber-cron
) [![](https://img.shields.io/github/license/decentro-gmbh/uber-cron.svg?style=flat)](https://github.com/decentro-gmbh/uber-cron/blob/master/LICENSE)

Enhanced cron job scheduling with features you didn't know you need!
Based on cron: https://www.npmjs.com/package/cron

# What has been added

The following functionality was implemented on top of the [cron](https://www.npmjs.com/package/cron) package:

* Control the number of executions that run in parallel using the `numParallelExecutions` paramter.
* Configure whether a job should be stopped if an execution error occurs.
* Uses a provided logger object to log the following events:
  * `JOB_STARTED`: A job has been started
  * `JOB_STOPPED`: A job has been stoppped
  * `JOB_EXECUTION_STARTING`: The onTick method of a job is about to be executed
  * `JOB_EXECUTION_FINISHED`: The onTick method of a job finished successfully
  * `JOB_EXECUTION_ERROR`: An error occured during the execution of the job's onTick method
  * `REACHED_MAX_PARALLEL_EXECUTIONS`: The maximum number of parallel job executions has been reached (the request to start another job execution has been ignored)


# Installation

Installation is straight forward with npm:
```
npm i uber-cron
```

# Examples

```ts
const cronJob = new UberCron('simpleJob', {
  cronTime: '*/1 * * * * *',
  start: true,
  logger: null,
  onTick: () => console.log(`Job being executed right now!`),
});

setTimeout(() => cronJob.stop(), 3500);

/**
OUTPUT:

root@uber-cron:/app# npm run start
> uber-cron@1.0.0 start /app
> ts-node --project tsconfig.json example/index.ts

Job being executed right now!
Job being executed right now!
Job being executed right now!
 */
```

## API Documentation

The full API documentation can be found here: https://decentro-gmbh.github.io/uber-cron/
