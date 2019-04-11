// @ts-check
'use strict'

const http = require('http')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = http.createServer((_, res) => {
    fetchAll()
      .then(result => {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end(JSON.stringify(result))
      })
      .catch(err => {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 500
        res.end(JSON.stringify(err))
      })
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
