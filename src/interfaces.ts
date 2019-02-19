import { CronJobParameters } from 'cron';
import { UberCron } from './index';

/** Interface for a logger object used to print log messages */
export interface ILogger {
  /** Logging function for info messages (default: console.log) */
  info?: (msg: any) => void;
  /** Logging function for warnings (default: console.log) */
  warn?: (msg: any) => void;
  /** Logging function for errors (default: console.error) */
  err?: (msg: any) => void;
}

/** Interface for enhanced cron job parameters. Extends the original CronJobParameters interface, adding the enhanced functionality parameters */
export interface IUberCronJobParameters extends CronJobParameters {
  numParallelExecutions?: number;
  logger?: ILogger | null;
  stopOnError?: boolean;
}

export interface ICronJobEntry {
  instance?: UberCron;
  numRunning?: number;
  numExecutions?: number;
  started?: boolean;
}
