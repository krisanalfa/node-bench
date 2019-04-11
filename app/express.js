// @ts-check
'use strict'

const app = require('express')()

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair>} fetchAll
 */
const createApp = fetchAll => {
  app.get('/', (_, res) => {
    fetchAll()
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
