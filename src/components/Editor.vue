<template>
<div>
  <div class="row">
    <div class="col-md-12"><tinymce v-model="htmlContent" ref="tinymce"></tinymce></div>
    <div class="col-md-12"><ace v-model="markdownContent" ref="ace"></ace></div>
    <div class="col-md-12" v-html="htmlViewContent" id="previewHtml" ref="htmlView"></div>
    <div id="toc"></div>
    <button @click="getToc">out</button>
    <button @click="switchEditor('ace')">switchToAce</button>
    <button @click="switchEditor('tinymce')">switchToTinymce</button>
  </div>
</div>
</template>

<script>
//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from './switchContent.js'

import katex from "katex"
import "katex/dist/katex.min.css"
import renderMathInElement from "katex/dist/contrib/auto-render"
import mermaid from "mermaid"

export default {
  name: 'Editor',
  data () {
    return {
      markdownContent: '# Welcome to Your Vue.js App',
      htmlContent: "wsg",
      htmlViewContent: "",
      toc: ''
    }
  },
  watch: {
    markdownContent: function (val) {
      this.htmlViewContent = toHtml(val)
      this.$nextTick(function() {
        Prism.highlightAll()
      })
      this.renderNextTick()
    },
    htmlContent: function(val) {
      // this.markdownContent = toMarkdown(val)
      this.htmlViewContent = val
      this.$nextTick(function() {
        Prism.highlightAll()
      })
      this.renderNextTick()
    }
  },
  methods: {
    switchEditor: function(to) {
      if(to === 'ace') {
        this.markdownContent = toMarkdown(this.htmlContent)
        this.$refs.ace.setValue(this.markdownContent)
      } else if(to === 'tinymce') {
        this.htmlContent = toHtml(this.markdownContent)
        this.$refs.tinymce.setValue(this.htmlContent)
      }
    },
    renderNextTick: function() {
      this.$nextTick(function() {
        //转换Tex公式
        renderMathInElement(document.getElementById('previewHtml'), {
          delimiters: [
            {left: "$$", right: "$$"},
            {left: "```math", right: "```"},
            {left: "```tex", right: "```"}
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        });
        try {
          mermaid.init({noteMargin: 10}, ".xkeditor-mermaid");
        } catch (error) {
          console.log("May have errors")
        }
      })
    },
    getToc: function() {
      var html = getTocHtml()
      document.getElementById('toc').innerHTML = html;
    },
    scrollToAnchor: function(anchorName) {
      if (anchorName) {
        let anchorElement = document.getElementById(anchorName);
        if(anchorElement) {
          anchorElement.scrollIntoView(true);
        }
      }
    }
  },
  mounted() {
    mermaid.initialize({startOnLoad:true})
    window.scrollToAnchor = this.scrollToAnchor
  },
}
</script>

<style>
.toc ul {
  margin-left: 20px;
}
</style>
