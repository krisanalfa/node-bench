const [app, orm] = process.argv.slice(-2)

console.log('Starting application: %s + %s ...', app, orm)

const { createApp } = require(`./app/${app}`)
const { fetchAll } = require(`./orm/${orm}`)

createApp(fetchAll)
