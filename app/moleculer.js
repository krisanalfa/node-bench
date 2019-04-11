// @ts-check
'use strict'

const WebService = require('moleculer-web')
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
    mixins: [WebService],
    settings: {
      routes: [{
        aliases: {
          'GET /': 'http.fetchAll'
        }
      }]
    },
    actions: {
      async fetchAll (ctx) {
        try {
          const data = await fetchAll()

          ctx.meta.$responseType = 'application/json; charset=utf-8'
          ctx.meta.$statusCode = 200

          return data
        } catch ({ message }) {
          ctx.meta.$responseType = 'application/json; charset=utf-8'
          ctx.meta.$statusCode = 500

          return { message }
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
