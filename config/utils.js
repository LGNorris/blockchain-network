const _ = require('lodash')

const noEnv = process.env.NO_ENV

if (_.isNil(noEnv)) {
  require("dotenv").config();
}

module.exports = {
  nodeEnv: process.env.NODE_ENV
}