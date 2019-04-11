// @ts-check
'use strict'

const fastify = require('fastify')

const c = require('../constanta')
const { schema } = require('../schema')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = fastify()

  app.get('/', { schema }, (_, reply) => {
    fetchAll()
      .then(result => reply.status(200).send(result))
      .catch(({ message }) => reply.status(500).send({ message }))
  })

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
