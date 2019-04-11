// @ts-check
'use strict'

const app = require('restify').createServer()

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  app.get('/', (_, res) => {
    fetchAll()
      .then(result => res.json(200, result))
      .catch(err => res.json(500, err))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
