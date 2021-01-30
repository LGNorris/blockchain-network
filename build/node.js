"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cluster_1 = __importDefault(require("cluster"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("config"));
const logger_1 = require("./logger");
const IRoute_1 = require("./interfaces/IRoute");
const blockchain_1 = __importDefault(require("./lib/blockchain"));
class Node {
    constructor(port) {
        this.configure = (poolSize, isTest) => __awaiter(this, void 0, void 0, function* () {
            if (cluster_1.default.isMaster) {
                logger_1.masterLog.info("Configuring master instance");
                if (!isTest)
                    for (let index = 0; index < poolSize; index += 1)
                        cluster_1.default.fork();
            }
        });
        this.addRoutesSync = (routes) => {
            if (!cluster_1.default.isMaster)
                routes.forEach(({ method, path, cbs }) => {
                    logger_1.allLog.info(`Adding route: ${`[${method}] ${path}`}`, "yellow");
                    if (!path || !cbs || cbs.length === 0)
                        throw new Error("Route need to have defined method, path and callbacks");
                    switch (method) {
                        case IRoute_1.METHOD.GET:
                            this.instance.get(path, cbs);
                            break;
                        case IRoute_1.METHOD.POST:
                            this.instance.post(path, cbs);
                            break;
                        case IRoute_1.METHOD.PUT:
                            this.instance.put(path, cbs);
                            break;
                        case IRoute_1.METHOD.PATCH:
                            this.instance.patch(path, cbs);
                            break;
                        case IRoute_1.METHOD.DELETE:
                            this.instance.delete(path, cbs);
                            break;
                        default:
                            throw new Error("Unknown method");
                    }
                });
        };
        this.start = (port, name) => {
            if (cluster_1.default.isMaster)
                logger_1.log.info(`Blockchain node: Listening for activity on http://localhost:${port.toString().green}`);
            else {
                logger_1.log.info(`Starting worker ${cluster_1.default.worker.id}`);
                this.instance.listen(port, () => logger_1.log.info(`Worker ${cluster_1.default.worker.id} UP`.green));
            }
        };
        logger_1.masterLog.info("Creating node instance");
        const env = config_1.default.get("env");
        const corsOrigin = (config_1.default.get('settings.cors_origin') + '');
        const corsOptions = { origin: corsOrigin };
        const blockchain = new (blockchain_1.default());
        logger_1.masterLog.info("Cors origin: " + corsOptions.origin.blue);
        logger_1.masterLog.info("Env: " + `${env}`.blue);
        this.instance = express_1.default();
        this.instance.use(helmet_1.default());
        this.instance.use(cors_1.default(corsOptions));
        this.instance.use(body_parser_1.default.json({ limit: "1mb", }));
        this.instance.use(body_parser_1.default.urlencoded({ extended: false }));
        this.instance.disable("x-powered-by");
        this.instance.use("/api", express_rate_limit_1.default({
            windowMs: 15 * 60 * 1000,
            max: 250,
        }));
    }
}
exports.default = Node;
