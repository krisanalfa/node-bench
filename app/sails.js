// @ts-check
'use strict'

const { constructor: Sails } = require('sails')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = new Sails()

  app.lift({
    port: 3000,
    hooks: { grunt: false, session: false },
    globals: false,
    log: { level: 'silent' },
    http: {
      middleware: { order: [] }
    },
    /**
     *
     * @param {Function} cb
     */
    bootstrap (cb) {
      app.hooks.http.app.disable('etag')

      cb()
    },
    routes: {
      /**
       * @param {import('express').Request} _
       * @param {import('express').Response} res
       */
      'get /' (_, res) {
        fetchAll()
          .then(data => res.status(200).json(data))
          .catch(({ message }) => res.status(500).json({ message }))
      }
    }
  }, /** @type {(err: Error) => void} */ err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    process.send && process.send(c['SERVER_EVENT::SERVER_START'])
  })
}
exports.createApp = createApp
