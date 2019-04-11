// @ts-check
'use strict'

const { Server } = require('hapi')
const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const server = new Server({
    port: 3000,
    host: 'localhost',
    compression: false
  })

  server.route({
    method: 'GET',
    path: '/',
    async handler (_, h) {
      try {
        const data = await fetchAll()

        return h.response(data).header('Content-Type', 'application/json; charset=utf-8').code(200)
      } catch ({ message }) {
        return h.response({ message }).header('Content-Type', 'application/json; charset=utf-8').code(500)
      }
    }
  })

  server.start().then(() => {
    process.send && process.send(c['SERVER_EVENT::SERVER_START'])
  })
}
exports.createApp = createApp
