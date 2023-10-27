import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRouterMap } from '../config/router.config'

Vue.use(VueRouter)



const router = new VueRouter({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes : constantRouterMap
})

export default router
