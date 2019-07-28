import Vue from 'vue'
import Router from 'vue-router'
import menu from './menu'

Vue.use(Router)

let list = menu.menu

const router = new Router({
  // 地址栏去掉#
  mode: 'history',
  routes: list
})

export default router
