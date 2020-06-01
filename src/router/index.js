import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/randomview',
    name: 'Random',
    component: () => import('../views/RandomView.vue')
  },
  {
    path: '/iss',
    name: 'ISS',
    component: () => import('../views/ISS.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
