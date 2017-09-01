# Vue-spacebro-client

[![NPM version](https://img.shields.io/npm/v/vue-spacebro-client.svg)](https://www.npmjs.com/package/vue-spacebro-client)
![VueJS v2 compatible](https://img.shields.io/badge/Vuejs%202-compatible-green.svg)
<a href="https://www.npmjs.com/package/vue-spacebro-client"><img src="https://img.shields.io/npm/dt/vue-spacebro-client.svg" alt="Downloads"></a>
<img id="dependency_badge" src="https://www.versioneye.com/javascript/spacebro:vue-spacebro-client/2.0.1/badge.svg" alt="Dependency Badge" rel="nofollow">
<a href="https://www.npmjs.com/package/vue-spacebro-client"><img src="https://img.shields.io/npm/l/vue-spacebro-client.svg" alt="License"></a>

spacebro-client implementation for Vuejs 2 and Vuex

## Install

``` bash
npm install vue-spacebro-client --save
```

## Usage
#### Configuration
Automatic spacebro connection from a config object
``` js
import VueSpacebroClient from 'vue-spacebro-client'
Vue.use(VueSpacebroClient, {
  host: 'spacebro.space',
  port: 3333,
  channelName: 'media-stream'
  client: {
    name: 'vue-example',
    description: 'exemple app',
    in: {
      inMedia: {
        eventName: 'inMedia',
        description: 'Input media',
        type: 'all'
      }
    },
    out: {
      outMedia: {
        eventName: 'outMedia',
        description: 'Output media',
        type: 'all'
      }
    }
  }
})
```

Enable Vuex integration
``` js
import store from './yourstore'
Vue.use(VueSpacebroClient, config, store));
```

#### On Vuejs instance usage
``` js
var vm = new Vue({
  spacebroEvents: {
    connect: function () {
      console.log('spacebro connected')
    },
    inMedia: function (val) {
      console.log('this method was fired by a message on spacebro. eg: spacebro.emit("newMedia", data)')
    }
  },
  methods: {
    clickButton: function(val){
        // $spacebro is spacebro-client instance
        this.$spacebro.emit(this.$spacebro.config.client.out.outMedia.eventName, val);
    }
  }
})
```

#### Dynamic spacebro event listeners
Create a new listener
``` js
this.$options.spacebroEvents.event_name = (data) => {
    console.log(data)
}
```
Remove existing listener
``` js
delete this.$options.spacebroEvents.event_name;
```

#### Vuex Store integration

spacebro **mutations** always have `SPACEBRO_` prefix.

spacebro **actions** always have `spacebro_` prefix and the spacebro event name is `camelCased` (ex. `SPACEBRO_USER_MESSAGE` => `spacebro_userMessage`) 

You can use either one or another or both in your store. Namespaced modules are supported.

``` js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        connect: false,
        message: null
    },
    mutations:{
        SPACEBRO_CONNECT: (state,  status ) => {
            state.connect = true;
        },
        SPACEBRO_USER_MESSAGE: (state,  message) => {
            state.message = message;
        }
    },
    actions: {
        otherAction: (context, type) => {
            return true;
        },
        spacebro_userMessage: (context, message) => {
            context.dispatch('newMessage', message);
            context.commit('NEW_MESSAGE_RECEIVED', message);
            if (message.is_important) {
                context.dispatch('alertImportantMessage', message);
            }
            ...
        }
    }
})
```

## Example

There is an example in [electron-vue](https://github.com/soixantecircuits/electron-vue)  
To generate an example, do 

```
npm install -g vue-cli
vue init soixantecircuits/electron-vue simple-electron-vue-spacebro
```

And select option to add spacebro-client in project.

## Credits

This is largely based on MetinSeylan's awesome [Vue-Socket.io](https://github.com/MetinSeylan/Vue-Socket.io)
