// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AtComponents from 'at-ui'
import 'at-ui-style'
import './components/dialogDrag'
Vue.use(AtComponents)
import marked from 'marked'
//导入js，随处可用
Object.defineProperty(Vue.prototype, '$marked', { value: marked })

import ACE from './components/ACE_Editor.vue'
Vue.component('ace', ACE)
import TinyMCE from './components/TinyMCE_Editor.vue'
Vue.component('tinymce', TinyMCE)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
