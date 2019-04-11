// @ts-check
'use strict'

const Koa = require('koa')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const app = new Koa()

  app.use(({ res }) => {
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

  app.listen(3000, () => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
