// @ts-check
'use strict'

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Geo'
  },
  pool: {
    min: 5,
    max: 50
  }
})
exports.knex = knex

/**
 * @returns {import("../lib").ICountryCodePair[]}
 */
// @ts-ignore
const fetchAll = () => new Promise(
  (resolve, reject) => knex.select().table('CountryCodes')
    .then(resolve)
    .catch(reject)
)
exports.fetchAll = fetchAll
