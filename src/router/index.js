import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Goods from 'components/goods/Goods'
import Ratings from 'components/ratings/Ratings'
import Seller from 'components/seller/Seller'

import 'common/scss/index.scss'

Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings
    },
    {
      path: '/seller',
      name: 'Seller',
      component: Seller
    }
  ],
  linkActiveClass: 'v-active'
})