module.exports = {
  is_dev: true,
  name: "blockchain-network-dev",
  settings : {
    cluster_instances: 2,
    log_level: process.env.LOG_LEVEL || "TRACE"
  }
}