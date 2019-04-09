<template>
<div>
  <div class="row">
    <div class="col-md-12"><tinymce v-model="html_content" ref="tinymce"></tinymce></div>
    <div class="col-md-12"><ace v-model="md_content" ref="ace"></ace></div>
    <div class="col-md-24" v-html="html_content"></div>
    <button @click="$refs.ace.setValue(md_content)">switchToAce</button>
    <button @click="$refs.tinymce.setValue(html_content)">switchToTinymce</button>
  </div>
</div>
</template>

<script>
//HTML和Markdown互转
import { toHtml, toMarkdown } from './switchContent.js'

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
      this.html_content = toHtml(val)
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    },
    html_content: function(val) {
      this.md_content = toMarkdown(val)
      // this.$refs.ace.setValue()
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  },
}
</script>

<style scoped>
</style>
