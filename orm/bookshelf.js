// @ts-check
'use strict'

const bookshelf = require('bookshelf')(require('./knex').knex)

const Model = new bookshelf.Model(
  {},
  { tableName: 'CountryCodes' }
)

/**
 * @returns {import("../lib").ICountryCodePair[]}
 */
// @ts-ignore
const fetchAll = () => new Promise(
  (resolve, reject) => Model.fetchAll({ columns: '*' })
    .then(result => resolve(result.toArray()))
    .catch(reject)
)
exports.fetchAll = fetchAll
