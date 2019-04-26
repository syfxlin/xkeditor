<template>
  <div id="app">
    <xk-editor :settingProps="setting" :contentProps="content"/>
  </div>
</template>

<script>
import XK_Editor from '@/components/XK_Editor'
export default {
  name: 'App',
  components: {
    'xk-editor': XK_Editor
  },
  data() {
    return {
      setting: {
        tinymceSetting: {
          language_url: '/static/tinymce/langs/zh_CN.js',
          language: 'zh_CN',
          skin_url: '/static/tinymce/skins/ui/oxide',
          body_class: 'markdown-body',
          content_css: '/static/github-markdown.css',
          plugins: 'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
          toolbar: 'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo',
          image_advtab: true,
          importcss_append: true,
          height: '100%',
          template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
          template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
          image_caption: true,
          spellchecker_dialog: true,
          spellchecker_whitelist: ['Ephox', 'Moxiecode']
        },
        aceSetting: {
          minLines: 10,
          fontSize: 14,
          theme: "ace/theme/solarized_light",
          mode: "ace/mode/markdown",
          tabSize: 4,
          fontSize: "17px",
          wrap: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true
        },
        xkSetting: {
          apiBaseUrl: "",
          previewCss: "/static/github-markdown.css",
          previewClass: "markdown-body",
          delayToHtml: 500,
          scrollBind: 'both',
          imgUpload: false
        }
      },
      content: '# 123'
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style>
body {
  background-color: #FFF;
  color: #3F536E;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

html, body {
  width: 100%;
  height: 100%;
}
body {
  margin: 0;
}
p {
  margin: 0;
}
/* 滚动槽 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.06);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
#app {
  width: 100%;
  height: 100%;
}
</style>
