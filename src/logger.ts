import bunyan from "bunyan";
import PrettyStream from 'bunyan-prettystream';
import cluster from 'cluster';
import config from 'config';

const enum LOG_LEVEL {
  TRACE = "trace",
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

interface ISilentLog {
  level: LOG_LEVEL;
  msg: string;
}

class Logger {
  client: object;
  silentLogs: ISilentLog[] = [];

  constructor() {
    const prettyStdOut = new PrettyStream();
    prettyStdOut.pipe(process.stdout);
    this.client = bunyan.createLogger({
      name: config.get('name'),
      streams: [{
        level: config.get("settings.log_level"),
        type: "raw",
        stream: prettyStdOut,
      }]
    });
  }

  getColoredLogSync = (level: LOG_LEVEL, log: string, customColor?: string) => {
    if (customColor) {
      // @ts-ignore
      return log[customColor];
    }

    switch (level) {
      case LOG_LEVEL.FATAL:
        return log.black.bgWhite;
      case LOG_LEVEL.ERROR:
        return log.red;
      case LOG_LEVEL.WARN:
        return log.yellow;
      case LOG_LEVEL.DEBUG:
      case LOG_LEVEL.TRACE:
        return log.gray;
      default:
        return log;
    }
  };

  createLog = (level: LOG_LEVEL, message: string, color?: string) => {
    const log = message?.toString();
    const coloredLog = this.getColoredLogSync(level, log, color);
    if (config.get("is_test")) this.silentLogs.push({ level, msg: coloredLog });
    else {
      // @ts-ignore
      this.client[level](coloredLog);
    }
  };

  logOnFirstWorkerSync = () =>
    cluster && cluster.worker && cluster.worker.id && cluster.worker.id === 1;

  log = {
    trace: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.TRACE, message, color),
    debug: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.DEBUG, message, color),
    info: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.INFO, message, color),
    warn: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.WARN, message, color),
    error: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.ERROR, message, color),
    fatal: (message: string, color?: string) =>
      this.createLog(LOG_LEVEL.FATAL, message, color),
  };

  masterLog = {
    trace: (message: string, color?: string) =>
      cluster.isMaster && this.log.trace(message, color),
    debug: (message: string, color?: string) =>
      cluster.isMaster && this.log.debug(message, color),
    info: (message: string, color?: string) =>
      cluster.isMaster && this.log.info(message, color),
    warn: (message: string, color?: string) =>
      cluster.isMaster && this.log.warn(message, color),
    error: (message: string, color?: string) =>
      cluster.isMaster && this.log.error(message, color),
    fatal: (message: string, color?: string) =>
      cluster.isMaster && this.log.fatal(message, color),
  };

  allLog = {
    trace: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.trace(message, color),
    debug: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.debug(message, color),
    info: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.info(message, color),
    warn: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.warn(message, color),
    error: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.error(message, color),
    fatal: (message: string, color?: string) =>
      this.logOnFirstWorkerSync() && this.log.fatal(message, color),
  };
}

const logger = new Logger();
export const log = logger.log;
export const masterLog = logger.masterLog;
export const allLog = logger.allLog;
export const silentLogs = logger.silentLogs;
