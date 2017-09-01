import Observer from './Observer'
import Emitter from './Emitter'

export default {

  install (Vue, config, store) {
    if (!config) throw new Error('[vue-spacebro-client] cannot locate config')

    let observer = new Observer(config, store)

    Vue.prototype.$spacebro = observer.spacebroClient

    Vue.mixin({
      created () {
        let spacebroEvents = this.$options['spacebroEvents']

        this.$options.spacebroEvents = new Proxy({}, {
          set: (target, key, value) => {
            Emitter.addListener(key, value, this)
            target[key] = value
            return true
          },
          deleteProperty: (target, key) => {
            Emitter.removeListener(key, this.$options.spacebroEvents[key], this)
            delete target.key
            return true
          }
        })

        if (spacebroEvents) {
          Object.keys(spacebroEvents).forEach((key) => {
            this.$options.spacebroEvents[key] = spacebroEvents[key]
          })
        }
      },
      beforeDestroy () {
        let spacebroEvents = this.$options['spacebroEvents']

        if (spacebroEvents) {
          Object.keys(spacebroEvents).forEach((key) => {
            delete this.$options.spacebroEvents[key]
          })
        }
      }
    })
  }

}
