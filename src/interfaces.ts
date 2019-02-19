import { CronJobParameters } from 'cron';
import { UberCron } from './index';

/** Logger object used to print log messages */
export interface ILogger {
  /** Logging function for info messages (default: console.log) */
  info?: (msg: any) => void;
  /** Logging function for warnings (default: console.log) */
  warn?: (msg: any) => void;
  /** Logging function for errors (default: console.error) */
  err?: (msg: any) => void;
}

/** Uber cron job parameters. Extends the original CronJobParameters interface, adding additional uber-cron parameters */
export interface IUberCronJobParameters extends CronJobParameters {
  /** Maximum number of executions that run in parallel (additional execution attempts are ignored). Default: no limit  */
  numParallelExecutions?: number;
  /** Logging object for handling log messages. "null" means no log messages. Default: console */
  logger?: ILogger | null;
  /** Whether to stop the cron job if an error occured during execution. Default: false */
  stopOnError?: boolean;
}

/** Cron job entry used to manage the execution state of the cron job */
export interface ICronJobEntry {
  /** Reference to the cron job instance */
  instance?: UberCron;
  /** Number of job executions currently running */
  numRunning?: number;
  /** Total number of job executions since it was created */
  numExecutions?: number;
  /** Whether cron job has been started */
  started?: boolean;
}
