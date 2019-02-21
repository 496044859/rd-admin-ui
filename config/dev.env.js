'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"/npc_web"',
  BASE_DOC: '"http://172.16.100.24:8080/npc_web"',
  BASE_SOCKET: '"ws://172.16.100.24:8080/npc_web"'
})
