// import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueAxios } from './utils/request'  

import './core/use'
import bootstrap from './core/bootstrap'
import './permission' // permission control
Vue.config.productionTip = false
Vue.use(VueAxios)

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
