import 'colors';
import os from 'os';
import config from 'config';

import Node from './node';
import { masterLog } from "./logger";


const run = async () => {
  masterLog.info(`Logs level: ${(config.get('settings.log_level') + '' ).blue}`)
  const port = Number(config.get('settings.port'));
  const cpuCount = os.cpus().length;
  const poolSize = Number(config.get('settings.cluster_instances') || cpuCount);

  masterLog.info(`Total CPU's: ${cpuCount.toString().blue.bold} `)
  masterLog.info(`Worker pool count: ${poolSize.toString().blue.bold} `);
  
  const node = new Node(port);
  await node.configure(poolSize, config.get("is_test"));
  await node.start(port, config.get("name"));

};

run().catch((error) => {
  console.error(error);
  process.exit(1);
})