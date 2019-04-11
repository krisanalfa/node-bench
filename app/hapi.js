// @ts-check
'use strict'

const Hapi = require('hapi')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const server = new Hapi.Server({
    port: 3000,
    host: 'localhost'
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: fetchAll
  })

  server.start().then(() => {
    process.send && process.send(c['SERVER_EVENT::SERVER_START'])
  })
}
exports.createApp = createApp
