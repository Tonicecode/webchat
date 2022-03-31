import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import router from './router'

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://server.mygood.top')
}));
Vue.config.productionTip = false
Vue.use(VueRouter)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
