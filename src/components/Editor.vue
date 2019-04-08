<template>
<div>
  <div class="row">
    <div class="col-md-12"><tinymce v-model="html_content"></tinymce></div>
    <div class="col-md-12"><ace v-model="md_content"></ace></div>
    <div class="col-md-24" v-html="html_content"></div>
  </div>
</div>
</template>

<script>
//HTML和Markdown互转
import turndown from 'turndown'
var turndownGfm = require('turndown-plugin-gfm')
import marked from 'marked'

export default {
  name: 'Editor',
  data () {
    return {
      md_content: '# Welcome to Your Vue.js App',
      html_content: "wsg",
    }
  },
  watch: {
    md_content: function (val) {
      var markedRenderer = new marked.Renderer()
      markedRenderer.tex = function(text) {
        if(/\$\$(.*)\$\$/g.test(text)) {
          text = text.replace(/(\$\$([^\$]*)\$\$)/g, function($1, $2) {
            return $2.replace(/\$/g, "")
          })
        }
        return text
      }
      marked.setOptions({
        langPrefix: "line-numbers language-",
        renderer: markedRenderer
      })
      this.html_content = marked(val)
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    },
    // html_content: function(val) {
    //   var turndownService = new turndown({
    //     headingStyle: 'atx',
    //     hr: '---',
    //     bulletListMarker: '-',
    //     codeBlockStyle: 'fenced',
    //     emDelimiter: '*',
    //   })
    //   turndownService.keep([
    //     'iframe',
    //     'style',
    //     'script',
    //     'title',
    //     'span',
    //     'font'
    //   ])
    //   turndownService.use(turndownGfm.gfm)
    //   this.md_content = turndownService.turndown(val)
    //   this.$nextTick(function() {
    //     Prism.highlightAll()
    //   })
    // }
  },
}
</script>

<style scoped>
</style>
