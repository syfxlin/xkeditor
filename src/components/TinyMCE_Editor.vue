<template>
  <div class="tinymce">
    <editor ref="tinymce" :init="init">{{ value }}</editor>
    <button v-on:click="change">switch</button>
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
      init: {
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/ui/oxide',
        plugins: 'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
        toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough forecolor backcolor | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent blockquote code | removeformat | undo redo',
        image_advtab: true,
        importcss_append: true,
        height: 400,
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
  },
  components: {
    'editor': Editor
  },
  methods: {
    change () {
      this.$emit('input', this.aceEditor.getSession().getValue())
    }
  }
}
</script>
