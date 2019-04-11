/* eslint-disable no-undef */
// @ts-check
'use strict'

const path = require('path')

const { registrar, ioc } = require('@adonisjs/fold')
const { Helpers, setupResolver } = require('@adonisjs/sink')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  process.env.ENV_SILENT = 'true'

  ioc.bind('Adonis/Src/Helpers', () => new Helpers(path.join(__dirname, '../')))

  setupResolver()
  ioc.autoload(path.join(__dirname), 'App')

  registrar
    .providers([
      path.join(__dirname, '../node_modules/@adonisjs/framework/providers/AppProvider.js')
    ])
    .registerAndBoot()
    // @ts-ignore
    .then(() => {
      // @ts-ignore
      const Config = use('Config')
      Config.set('app', {
        logger: {
          transport: 'console',
          console: {
            driver: 'console',
            level: 'error'
          }
        }
      })
    })
    .then(() => {
      // @ts-ignore
      const Route = use('Route')
      Route.get('/', /** @type {(ctx: { response: import('express').Response }) => void} */ ({ response }) => {
        fetchAll()
          .then(data => response.status(200).json(data))
          .catch(({ message }) => response.status(500).json({ message }))
      })
    })
    .then(() => {
      // @ts-ignore
      const Server = use('Server')
      Server.listen('localhost', 3000, () => {
        process.send && process.send(c['SERVER_EVENT::SERVER_START'])
      })
    })
}
exports.createApp = createApp
