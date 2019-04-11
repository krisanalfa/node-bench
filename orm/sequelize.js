// @ts-check
'use strict'

const { Sequelize, Model, STRING } = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: 'root',
  database: 'Geo',
  logging: false,
  pool: { min: 5, max: 50 }
})
exports.sequelize = sequelize

class CountryCode extends Model {}
CountryCode.init({
  Code: { type: STRING, primaryKey: true },
  Name: STRING
}, { sequelize, timestamps: false })
exports.Model = CountryCode

/**
 * @returns {import("../lib").ICountryCodePair[]}
 */
// @ts-ignore
const fetchAll = () => new Promise(
  (resolve, reject) => CountryCode.findAll()
    .then(result => resolve(result))
    .catch(reject)
)
exports.fetchAll = fetchAll
