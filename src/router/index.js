import Vue from 'vue'
import Router from 'vue-router'
import MD_Editor from '@/components/MD_Editor'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'MD_Editor',
      component: MD_Editor
    }
  ]
})
