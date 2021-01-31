const { nodeEnv } = require("./utils");

module.exports = {
  is_test: false,
  env: nodeEnv,
  name: "blockchain-network",
  settings: {
    log_level: process.env.LOG_LEVEL || "ERROR",
    cluster_instances: process.env.CLUSTER_INSTANCES || null,
    port: process.env.PORT || 3001,
    cors_origin: process.env.CORS_ORIGIN,
    ip: process.env.IP
  }
}