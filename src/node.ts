import cors from "cors";
import helmet from "helmet";
import cluster from "cluster";
import bodyParser from "body-parser";
import express from "express";
import limit from "express-rate-limit";
import config from "config";

import { masterLog, allLog, log } from "./logger";

//@ts-ignore
import Blockchain from './lib/Blockchain'

export default class Node {
  instance: express.Express;

  constructor(port: number) {
    masterLog.info("Creating node instance");

    const blockchain = new Blockchain()
    const env = config.get("env");
    const corsOrigin = (config.get('settings.cors_origin') + '')
    const corsOptions = { origin: corsOrigin };

    masterLog.info("Cors origin: " + corsOptions.origin.blue);
    masterLog.info("Env: " + `${env}`.blue);

    this.instance = express();
    this.instance.use(helmet());
    this.instance.use(cors(corsOptions));
    this.instance.use(bodyParser.json({ limit: "1mb", }));
    this.instance.use(bodyParser.urlencoded({ extended: false}))
    this.instance.disable("x-powered-by");
    this.instance.use(
      "/api",
      limit({
        windowMs: 15 * 60 * 1000,
        max: 250,
      })
    );

    this.instance.get('/', function(req, res){
      res.json({
        message: 'Blockchain node up and running'
      });
    });

    this.instance.get('/blockchain', function(req, res){
      res.send({blockchain})
    })

  }
  

  configure = async (poolSize: number, isTest: boolean) => {
    if (cluster.isMaster) {
      masterLog.info("Configuring master instance");
      if (!isTest)
        for (let index = 0; index < poolSize; index += 1) cluster.fork();
    }
  };

  // addRoutesSync = (routes: IRoute[]) => {
  //   if (!cluster.isMaster)
  //     routes.forEach(({ method, path, cbs }: IRoute) => {
  //       allLog.info(`Adding route: ${`[${method}] ${path}`}`, "yellow");
  //       if (!path || !cbs || cbs.length === 0)
  //         throw new Error(
  //           "Route need to have defined method, path and callbacks"
  //         );

  //       switch (method) {
  //         case METHOD.GET:
  //           this.instance.get(path, cbs);
  //           break;
  //         case METHOD.POST:
  //           this.instance.post(path, cbs);
  //           break;
  //         case METHOD.PUT:
  //           this.instance.put(path, cbs);
  //           break;
  //         case METHOD.PATCH:
  //           this.instance.patch(path, cbs);
  //           break;
  //         case METHOD.DELETE:
  //           this.instance.delete(path, cbs);
  //           break;
  //         default:
  //           throw new Error("Unknown method");
  //       }
  //     });
  // };

  start = (port: number, name: string) => {
    if (cluster.isMaster)
      log.info(
        `Blockchain node: Listening for activity on http://localhost:${
          port.toString().green
        }`
      );
    else {
      log.info(`Starting worker ${cluster.worker.id}`);
      this.instance.listen(port, () =>
        log.info(`Worker ${cluster.worker.id} UP`.green)
      );
    }
  };
}
