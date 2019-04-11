// @ts-check
'use strict'

const express = require('express')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair>} fetchAll
 */
const createApp = fetchAll => {
  const app = express()

  app.get('/', (_, res) => {
    fetchAll()
      .then(result => res.status(200).json(result))
      .catch(({ message }) => res.status(500).json({ message }))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
