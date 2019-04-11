// @ts-check

const app = new (require('foxify'))()

const { schema } = require('../schema')

const c = require('../constanta')

app.disable('x-powered-by')
app.set('workers', 1)

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  // @ts-ignore - Foxify doesn't support JSONSchema `items` :(
  app.get('/', { schema }, (_, reply) => {
    fetchAll()
      .then(result => reply.status(200).send(result))
      .catch(err => reply.status(500).send(err))
  })

  app.start(() => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
exports.createApp = createApp
