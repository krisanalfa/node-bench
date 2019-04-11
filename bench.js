// @ts-check
'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const spawn = require('cross-spawn')

const reduce = require('lodash.reduce')
const autocannon = require('autocannon')
const groupBy = require('lodash.groupby')
const flattenDepth = require('lodash.flattendepth')

/** @type {string[]} */
const servers = [
  'adonis',
  'connect',
  'express',
  'fastify',
  'foxify',
  'hapi',
  'koa',
  'moleculer',
  'plumier',
  'restify',
  'sails',
  'bare'
]
/** @type {string[]} */
const orms = [
  // 'bookshelf',
  // 'knex',
  // 'mysql',
  // 'mysql2',
  // 'sequelize',
  'static'
]
/** @type {import('./lib').runnable[]} */
const runnables = flattenDepth(servers.map(server => orms.map(orm => [server, orm])), 1)

const writeFileAsync = util.promisify(fs.writeFile)

/**
 * @type {import('./lib').autocannonAsync}
 */
const autocannonAsync = util.promisify(autocannon)

/**
 * @param {number} number
 */
const numberFormat = number => new Intl.NumberFormat('en-US').format(number)

/**
 * @param {number} time
 */
const delay = time => setTimeout(() => Promise.resolve(true), time)

/**
 * @param {import('./lib').runnable} runnable
 *
 * @returns {Promise<import('./lib').IBenchmarkResult[]>}
 */
const benchmark = async runnable => new Promise((resolve, reject) => {
  const app = runnable[0].toString()
  const orm = runnable[1].toString()

  const childProcess = spawn(
    'node',
    ['index.js', app, orm],
    { stdio: ['ignore', 'ignore', 'ignore', 'ipc'] }
  )

  const overall = []

  childProcess
    .on('message', async () => {
      try {
        const totalRun = 2
        for (let timesOfRun = 1; timesOfRun <= totalRun; timesOfRun++) {
          const result = await measurePerf(runnable, timesOfRun, totalRun)

          // Delay to run another benchmark
          await delay(500)

          // The first run is warming up, no need to add this result to
          // our measurement
          if (timesOfRun === 1) continue

          overall.push(result)
        }

        childProcess.kill()

        resolve(overall)
      } catch (error) {
        childProcess.kill()
        reject(error)
      }
    })
})

/**
 * @param {import('./lib').runnable} runnable
 * @param {number} timesOfRun
 * @param {number} totalRun
 *
 * @returns {Promise<import('./lib').IBenchmarkResult>}
 */
const measurePerf = async (runnable, timesOfRun, totalRun) => {
  const app = runnable[0].toString()
  const orm = runnable[1].toString()

  console.log('%s %s:%s (%s/%s) ...', timesOfRun === 1 ? 'Warming up' : 'Benchmarking', app, orm, timesOfRun, totalRun)

  const result = await autocannonAsync({
    title: `${app}:${orm}`,
    url: 'http://localhost:3000',
    connections: timesOfRun === 1 ? 50 : 100,
    pipelining: timesOfRun === 1 ? 5 : 10,
    duration: timesOfRun === 1 ? 2.5 : 5
  })

  const { title, requests, latency, throughput } = result
  const { average: requestAverage } = requests
  const { average: latencyAverage } = latency
  const { average: throughputAverage } = throughput

  return {
    title,
    requestAverage,
    latencyAverage,
    throughputAverage
  }
}

/**
 *
 * @param {import('./lib').IBenchmarkResult[]} benchmarkResults
 */
const printResult = benchmarkResults => {
  const results = reduce(
    groupBy(benchmarkResults, o => o.title),
    (result, value, key) => {
      return Object.assign({}, result, {
        [key]: {
          'Request (rps)': numberFormat((value.reduce((a, c) => a + c.requestAverage, 0) / value.length)),
          'Latency (ms)': numberFormat((value.reduce((a, c) => a + c.latencyAverage, 0) / value.length)),
          'Throughput (Mbps)': numberFormat((value.reduce((a, c) => a + c.throughputAverage, 0)) / 1e6)
        }
      })
    },
    {}
  )
  console.table(results)
}

;(async () => {
  try {
    /** @type {import('./lib').IBenchmarkResult[]} */
    const benchmarkResults = []

    let n = 1
    const total = runnables.length
    for (const runnable of runnables) {
      const app = runnable[0].toString()
      const orm = runnable[1].toString()

      console.log('Running %s:%s (%s/%s) ...', app, orm, n, total)

      const results = await benchmark(runnable)

      benchmarkResults.push(...results)

      // Delay to spawn another webservice
      await delay(1000)

      n++
    }

    await writeFileAsync(
      path.resolve(__dirname, 'result.json'),
      JSON.stringify(benchmarkResults)
    )

    printResult(benchmarkResults)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
