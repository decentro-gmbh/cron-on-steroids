import { CronJob } from 'cron';
import { ICronJobEntry, ILogger, IUberCronJobParameters } from './interfaces';

/**
 * Uber-cron: Enhanced cron job scheduling. Based on cron: https://www.npmjs.com/package/cron
 */
export class UberCron extends CronJob {
  /** Global jobs object holding all cron job entries for each created cron job */
  static jobs: { [jobName: string]: ICronJobEntry } = {};

  private jobName: string;
  private stopOnError: boolean;
  private numParallelExecutions: number;
  private logger: ILogger;

  /**
   * Create a new uber cron job
   * @param jobName Unique name of the job
   * @param uberOptions Cron job options
   */
  constructor(jobName: string, uberOptions: IUberCronJobParameters) {
    // Check if a job with this name has already been registered
    if (UberCron.jobs[jobName]) {
      throw new Error(`Job with name '${jobName}' already exists!`);
    }

    // Add job to global job list
    UberCron.jobs[jobName] = {
      numRunning: 0,
      numExecutions: 0,
      started: false,
    };

    // Create CronJob parameters
    const options = Object.assign({}, uberOptions);

    // Replace onTick method
    options.onTick = () => {
      this.wrapTick(uberOptions.onTick);
    };

    // Call CronJob constructor
    super(options);

    // Set uber-cron instance properties
    this.jobName = jobName;
    this.stopOnError = options.stopOnError !== undefined ? options.stopOnError : false;
    this.numParallelExecutions = options.numParallelExecutions;

    // Set logger (default logger: console, null: no logging)
    if (options.logger === null) {
      this.logger = {
        info: () => { },
        warn: () => { },
        err: () => { },
      };
    } else if (options.logger === undefined) {
      this.logger = {
        info: (msg) => console.log(`[INFO] ${JSON.stringify(msg)}`), // tslint:disable-line:no-console
        warn: (msg) => console.log(`[WARNING] ${JSON.stringify(msg)}`), // tslint:disable-line:no-console
        err: (msg) => console.error(`[ERROR] ${JSON.stringify(msg)}`), // tslint:disable-line:no-console
      };
    } else {
      this.logger = options.logger;
    }

    // Save reference to instance
    this.job.instance = this;

  }

  /** Getter for the global cron job entry of this cron job */
  get job() {
    return UberCron.jobs[this.jobName];
  }

  /** Wrap the onTick method for extended functionality */
  async wrapTick(onTick: () => void) {
    // Check if the maximum number of parallel executions for the job is reached (if one is set)
    if (this.numParallelExecutions !== undefined && this.job.numRunning >= this.numParallelExecutions) {
      this.logger.warn({ msg: 'REACHED_MAX_PARALLEL_EXECUTIONS', jobName: this.jobName, numParallelExecutions: this.numParallelExecutions });
      return;
    }

    // Job starting: increase number of running jobs
    this.logger.info({ msg: 'JOB_EXECUTION_STARTING', jobName: this.jobName });
    this.job.numRunning += 1;
    this.job.numExecutions += 1;

    try {
      await onTick();
    } catch (err) {
      this.logger.err({ msg: 'JOB_EXECUTION_ERROR', name: err.name, message: err.message, stack: err.stack });
      if (this.stopOnError) {
        this.stop();
      }
    }

    // Job finished: decrease number of running jobs
    this.logger.info({ msg: 'JOB_EXECUTION_FINISHED', jobName: this.jobName });
    this.job.numRunning -= 1;
  }

  /** Start the cron job */
  start() {
    if (!this.job.started) {
      this.logger.info({ msg: 'JOB_STARTED', jobName: this.jobName });
      this.job.started = true;
    }
    super.start();
  }

  /** Stop the cron job */
  stop() {
    if (this.job.started) {
      this.logger.info({ msg: 'JOB_STOPPED', jobName: this.jobName });
      this.job.started = false;
    }
    super.stop();
  }

}
