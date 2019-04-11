// @ts-check
'use strict'

const app = require('fastify')()
const { schema } = require('../schema')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  app.get('/', { schema }, (_, reply) => {
    fetchAll()
      .then(result => reply.status(200).send(result))
      .catch(err => reply.status(500).send(err))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
