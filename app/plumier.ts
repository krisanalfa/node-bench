import Plumier, { route } from 'plumier'
import { ICountryCodePair } from '../lib'

const c = require('../constanta')

export const createApp = (fetchAll: () => Promise<ICountryCodePair>) => {
  class AppController {
    @route.get('/')
    index () {
      return fetchAll()
    }
  }

  new Plumier()
    .set({ controller: AppController })
    .set({ mode: 'production' })
    .initialize()
    .then(app => app.listen(3000))
    .then(_ => process.send && process.send(c['SERVER_EVENT::SERVER_START']))
}
