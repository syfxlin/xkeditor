<!--
  /**
  * TinuMCE编辑器
  * @module /components
  * @desc 对TinyMCE编辑器进行封装，数据实时同步至父组件，父组件通过调用函数将数据传入该组件，初始化数据通过props传输，之后通过setValue方法传输
  * @author Otstar Lin
  * @date 2019年4月
  * @param {String} [value]  - 初始数据
  * @example 调用示例
  *  <tinymce v-model="html_content" ref="tinymce"></tinymce>
  *  <button @click="switchEditor('tinymce')">switchToTinymce</button>
  * @import 导入
  *  import TinyMCE from './components/TinyMCE_Editor.vue'
  *  Vue.component('tinymce', TinyMCE)
  */
-->
<template>
  <div class="tinymce">
    <editor ref="tinymce" :init="init" v-model="tinymceHtml"></editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/code'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/textpattern'
export default {
  props: {
    value: String
  },
  data() {
    return {
      tinymceHtml: '',
      init: {
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        body_class: 'markdown-body',
        content_css: '/static/github-markdown.css',
        plugins: 'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
        toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat code | undo redo',
        image_advtab: true,
        importcss_append: true,
        height: '100%',
        template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
        image_caption: true,
        spellchecker_dialog: true,
        spellchecker_whitelist: ['Ephox', 'Moxiecode'],
        images_upload_handler: function(blobInfo, success, failure) {
          console.log('Upload')
        }
      }
    }
  },
  mounted () {
    tinymce.init({})
    //赋初值
    this.tinymceHtml = this.value
  },
  components: {
    'editor': Editor
  },
  watch: {
    tinymceHtml: function() {
      this.updateValue()
    }
  },
  methods: {
    setValue: function(val) {
      this.tinymceHtml = val
    },
    updateValue: function() {
      this.$emit('input', this.tinymceHtml)
    }
  }
}
</script>

<style scoped>
.tinymce {
  height: 100%;
}
</style>