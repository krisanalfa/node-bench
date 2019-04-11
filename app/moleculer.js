// @ts-check
'use strict'

const ApiService = require('moleculer-web')
const { ServiceBroker } = require('moleculer')

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  const broker = new ServiceBroker({
    logger: false
  })

  // Load API Gateway
  broker.createService({
    name: 'http',
    mixins: [ApiService],
    settings: {
      routes: [{
        mappingPolicy: 'restrict',
        aliases: {
          'GET /': 'root.fetchAll'
        }
      }]
    }
  })

  broker.createService({
    name: 'root',
    actions: {
      async fetchAll (ctx) {
        try {
          const data = await fetchAll()

          ctx.meta.$responseType = 'application/json'
          ctx.meta.$statusCode = 200

          return data
        } catch (error) {
          ctx.meta.$responseType = 'application/json'
          ctx.meta.$statusCode = 500

          return error
        }
      }
    }
  })

  // Start server
  broker.start().then(() => {
    process.send && process.send(c['SERVER_EVENT::SERVER_START'])
  })
}
exports.createApp = createApp
