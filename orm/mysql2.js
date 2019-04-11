// @ts-check
'use strict'

const mysql = require('mysql2').createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'Geo',
  connectionLimit: 50
})
exports.mysql = mysql

/**
 * @returns {import("../lib").ICountryCodePair[]}
 */
// @ts-ignore
const fetchAll = () => new Promise((resolve, reject) => {
  mysql.query('SELECT * FROM `CountryCodes`', (err, value, fields) => {
    if (err) return reject(err)

    resolve(value)
  })
})
exports.fetchAll = fetchAll
