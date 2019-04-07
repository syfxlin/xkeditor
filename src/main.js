// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import AtComponents from 'at-ui'
import 'at-ui-style'
Vue.use(AtComponents)
import marked from 'marked'
//导入js，随处可用
Object.defineProperty(Vue.prototype, '$marked', { value: marked })

import 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min'
import 'prismjs/plugins/show-language/prism-show-language.min'
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
