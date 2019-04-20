// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import AtComponents from 'at-ui'
// import 'at-ui-style'
import './utils/dialogDrag'
// Vue.use(AtComponents)

import ACE from '@/components/ACE_Editor'
Vue.component('ace', ACE)
import TinyMCE from '@/components/TinyMCE_Editor'
Vue.component('tinymce', TinyMCE)
import Editor from '@/components/Editor'
Vue.component('editor', Editor)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})
