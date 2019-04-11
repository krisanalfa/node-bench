# Benchmark Tool
This repo is intended to measure performance of all popular Node.js web frameworks alongside with the ORM.

List of web framework included in test:
- bare (pure Node.js)
- [Connect](https://github.com/senchalabs/connect)
- [Express](https://expressjs.com)
- [Fastify](https://www.fastify.io)
- [Foxify](https://foxify.js.org/)
- [Hapi](https://hapijs.com)
- [Koa](https://koajs.com/)
- [Moleculer](https://moleculer.services)
- [Restify](http://restify.com/)

List of ORM included in test:
- [Bookshelf](https://bookshelfjs.org/)
- [Knex](https://knexjs.org/)
- [mysql](https://github.com/mysqljs/mysql)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [Sequelize](https://github.com/sequelize/sequelize)
- static (hardcoded using `Promise.resolve`)

## Running

Running benchmark
```sh
node bench.js
```

Running individual web framework + specific ORM:
```sh
# node index.js [web-framework] [orm]
node index.js bare static # open http://localhost:3000
```

To run the ORM benchmark:
1. You need to have a MySQL running in your machine.
2. Create a database and import the `CountryCodes.sql` file.

```sh
mysql -u root -p -e 'CREATE DATABASE Geo' # create new database
mysql -u root -p Geo < CountryCodes.sql   # import from file
```

---

## Project Structure

```
app
  [name].js
orm
  [name].js
```

The `app` folder contains web framework entrypoint. Meanwhile the `orm` folder contains ORM definition.

### Writing New Web Framework to be Tested

```js
// @ts-check
'use strict'

const c = require('../constanta')

/**
 * @param {() => Promise<import("../lib").ICountryCodePair[]>} fetchAll
 */
const createApp = fetchAll => {
  // 1. Initialize your application
  const app = new MyApp()

  // 2. Overview: fetchAll is an async function, your ROOT route of your application
  //    should be able to handle incoming GET request.
  app.get('/', (req, res) => {
    fetchAll()
      .then(data => {
        // If there is no error:
        // 2.1. The status code must be 200.
        // 2.2. The response must have `Content-Type: application/json` header.
        // 2.3. The response body must be a valid JSON, which it must be the representation of
        //      anything that fetchAll function returns.
        res.status(200).json(data)
      })
      .catch(error => {
        // If there's an error:
        // 2.4. The status code must be 500.
        // 2.5. The response must have `Content-Type: application/json` header.
        // 2.6. The response body must be a valid JSON, which it must be the representation of
        //      the error object thrown.
        res.status(500).json(error)
      })
  })

  // 3. The application must listen on port 3000.
  app.listen(3000, () => {
    // 3.1. After the application ready to serve connection, send a message to parent process.
    process.send && process.send(c['SERVER_EVENT::SERVER_START'])
  })
}
```

### Writing New ORM to be Tested

```js
// @ts-check
'use strict'

// The ORM should use MySQL as it's datasource
const orm = new MyOrm({
  host: 'localhost',
  user: 'root',
  password: 's3cr3t',
  database: 'Geo',
  // If you use pool connection, use this configuration:
  // - minimum number of connection in your pool: 5
  // - maximum number of connection in your pool: 50
  pool: {
    min: 5,
    max: 50
  }
})


/**
 * @returns {Promise<import("../lib").ICountryCodePair[]>}
 */
const fetchAll = () => new Promise((resolve, reject) => {
  // The fetchAll should get all contents in `CountryCodes` table.
  orm.fetchAll('CountryCodes', (err, result) {
    if (err) {
      reject(err)

      return
    }

    resolve(result)
  })
})
// Lastly, export the fetchAll function.
exports.fetchAll = fetchAll
```

---

## Result

Configuration:
- ORM: `static`
- AWS tier: t2.large
- Node.js version: v11.13.0
- OS: Ubuntu 18.04.2 LTS
- Kernel: 4.15.0-1032-aws
```
┌──────────────────┬───────────────┬──────────────┬───────────────────┐
│     (index)      │ Request (rps) │ Latency (ms) │ Throughput (Mbps) │
├──────────────────┼───────────────┼──────────────┼───────────────────┤
│  fastify:static  │   7,841.280   │    12.563    │      210.710      │
│  foxify:static   │   7,698.963   │    12.790    │      206.539      │
│  connect:static  │   7,459.340   │    13.197    │      200.108      │
│   bare:static    │   7,458.003   │    13.193    │      200.058      │
│    koa:static    │   7,138.040   │    13.787    │      191.502      │
│   hapi:static    │   5,527.333   │    17.887    │      149.684      │
│  express:static  │   5,502.013   │    17.963    │      148.947      │
│  restify:static  │   4,582.670   │    21.447    │      123.172      │
│ moleculer:static │   4,099.633   │    24.023    │      109.964      │
└──────────────────┴───────────────┴──────────────┴───────────────────┘
```
