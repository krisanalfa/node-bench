// @ts-check
'use strict'

const { createServer } = require('restify')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = createServer()

  app.get('/', (_, res) => {
    fetchAll()
      .then(result => res.json(200, result))
      .catch(({ message }) => res.json(500, { message }))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
