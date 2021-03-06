// @ts-check
'use strict'

const connect = require('connect')
const { createServer } = require('http')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = connect()

  app.use('/', (_, res) => {
    fetchAll()
      .then(result => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      })
      .catch(({ message }) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.statusCode = 500
        res.end(JSON.stringify({ message }))
      })
  })

  createServer(app)
    .listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
