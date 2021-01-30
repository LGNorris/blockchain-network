"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.silentLogs = exports.allLog = exports.masterLog = exports.log = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const bunyan_prettystream_1 = __importDefault(require("bunyan-prettystream"));
const cluster_1 = __importDefault(require("cluster"));
const config_1 = __importDefault(require("config"));
class Logger {
    constructor() {
        this.silentLogs = [];
        this.getColoredLogSync = (level, log, customColor) => {
            if (customColor) {
                // @ts-ignore
                return log[customColor];
            }
            switch (level) {
                case "fatal" /* FATAL */:
                    return log.black.bgWhite;
                case "error" /* ERROR */:
                    return log.red;
                case "warn" /* WARN */:
                    return log.yellow;
                case "debug" /* DEBUG */:
                case "trace" /* TRACE */:
                    return log.gray;
                default:
                    return log;
            }
        };
        this.createLog = (level, message, color) => {
            const log = message === null || message === void 0 ? void 0 : message.toString();
            const coloredLog = this.getColoredLogSync(level, log, color);
            if (config_1.default.get("is_test"))
                this.silentLogs.push({ level, msg: coloredLog });
            else {
                // @ts-ignore
                this.client[level](coloredLog);
            }
        };
        this.logOnFirstWorkerSync = () => cluster_1.default && cluster_1.default.worker && cluster_1.default.worker.id && cluster_1.default.worker.id === 1;
        this.log = {
            trace: (message, color) => this.createLog("trace" /* TRACE */, message, color),
            debug: (message, color) => this.createLog("debug" /* DEBUG */, message, color),
            info: (message, color) => this.createLog("info" /* INFO */, message, color),
            warn: (message, color) => this.createLog("warn" /* WARN */, message, color),
            error: (message, color) => this.createLog("error" /* ERROR */, message, color),
            fatal: (message, color) => this.createLog("fatal" /* FATAL */, message, color),
        };
        this.masterLog = {
            trace: (message, color) => cluster_1.default.isMaster && this.log.trace(message, color),
            debug: (message, color) => cluster_1.default.isMaster && this.log.debug(message, color),
            info: (message, color) => cluster_1.default.isMaster && this.log.info(message, color),
            warn: (message, color) => cluster_1.default.isMaster && this.log.warn(message, color),
            error: (message, color) => cluster_1.default.isMaster && this.log.error(message, color),
            fatal: (message, color) => cluster_1.default.isMaster && this.log.fatal(message, color),
        };
        this.allLog = {
            trace: (message, color) => this.logOnFirstWorkerSync() && this.log.trace(message, color),
            debug: (message, color) => this.logOnFirstWorkerSync() && this.log.debug(message, color),
            info: (message, color) => this.logOnFirstWorkerSync() && this.log.info(message, color),
            warn: (message, color) => this.logOnFirstWorkerSync() && this.log.warn(message, color),
            error: (message, color) => this.logOnFirstWorkerSync() && this.log.error(message, color),
            fatal: (message, color) => this.logOnFirstWorkerSync() && this.log.fatal(message, color),
        };
        const prettyStdOut = new bunyan_prettystream_1.default();
        prettyStdOut.pipe(process.stdout);
        this.client = bunyan_1.default.createLogger({
            name: config_1.default.get('name'),
            streams: [{
                    level: config_1.default.get("settings.log_level"),
                    type: "raw",
                    stream: prettyStdOut,
                }]
        });
    }
}
const logger = new Logger();
exports.log = logger.log;
exports.masterLog = logger.masterLog;
exports.allLog = logger.allLog;
exports.silentLogs = logger.silentLogs;
