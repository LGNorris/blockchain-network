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
require("colors");
const os_1 = __importDefault(require("os"));
const config_1 = __importDefault(require("config"));
const node_1 = __importDefault(require("./node"));
const logger_1 = require("./logger");
const routes_1 = __importDefault(require("./routes"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.masterLog.info(`Logs level: ${(config_1.default.get('settings.log_level') + '').blue}`);
    const port = Number(config_1.default.get('settings.port'));
    const cpuCount = os_1.default.cpus().length;
    const poolSize = Number(config_1.default.get('settings.cluster_instances') || cpuCount);
    logger_1.masterLog.info(`Total CPU's: ${cpuCount.toString().blue.bold} `);
    logger_1.masterLog.info(`Worker pool count: ${poolSize.toString().blue.bold} `);
    const node = new node_1.default(port);
    yield node.configure(poolSize, config_1.default.get("is_test"));
    node.addRoutesSync(routes_1.default);
    yield node.start(port, config_1.default.get("name"));
});
run().catch((error) => {
    console.error(error);
    process.exit(1);
});
