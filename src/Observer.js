import Emitter from './Emitter'
import {SpacebroClient} from 'spacebro-client'

export default class {
  constructor (config, store) {
    this.spacebroClient = new SpacebroClient(config)

    if (store) this.store = store

    this.onEvent(config)
  }

  onEvent (config) {
    let _this = this

    let userEvents = []
    for (let ev in config.client['in']) {
      userEvents.push((config.client['in'][ev].eventName))
    }

    [...userEvents, 'connect', 'error', 'disconnect', 'reconnect', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed', 'connect_error', 'connect_timeout', 'connecting', 'ping', 'pong']
            .forEach((value) => {
              _this.spacebroClient.on(value, (data) => {
                Emitter.emit(value, data)
                if (_this.store) _this.passToStore('SPACEBRO_' + value, data)
              })
            })
  }

  passToStore (event, payload) {
    if (!event.startsWith('SPACEBRO_')) return

    for (let namespaced in this.store._mutations) {
      let mutation = namespaced.split('/').pop()
      if (mutation === event.toUpperCase()) this.store.commit(namespaced, payload)
    }

    for (let namespaced in this.store._actions) {
      let action = namespaced.split('/').pop()

      if (!action.startsWith('spacebro_')) continue

      let camelcased = 'spacebro_' + event
                    .replace('SPACEBRO_', '')
                    .replace(/^([A-Z])|[\W\s_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase())

      if (action === camelcased) this.store.dispatch(namespaced, payload)
    }
  }
}
