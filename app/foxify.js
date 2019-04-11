// @ts-check
'use strict'

const Foxify = require('foxify')

const c = require('../constanta')
const { schema } = require('../schema')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = new Foxify()

  app.disable('x-powered-by')
  app.set('workers', 1)

  app.get(
    '/',
    // @ts-ignore - Foxify doesn't support JSONSchema `items` :(
    { schema },
    /** @type {import('foxify').Handler} */
    (_, reply) => {
      fetchAll()
        .then(result => reply.status(200).json(result))
        .catch(({ message }) => reply.status(500).json({ message }))
    }
  )

  app.start(() => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
