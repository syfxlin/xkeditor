<template>
<div>
  <div class="row">
    <div :class="aceDivClass"><ace v-model="markdownContent" ref="ace" v-show="EditorModeShow"></ace></div>
    <div class="col-md-12" v-html="htmlViewContent" id="previewHtml" ref="htmlView" v-show="EditorModeShow&&previewShow"></div>
    <div id="toc"></div>
    <div class="col-md-24"><tinymce v-model="htmlContent" ref="tinymce" v-show="!EditorModeShow"></tinymce></div>
    <button @click="getToc">toc</button>
    <button @click="switchEditor()">switchEditor</button>
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
      markdownContent: '',
      htmlContent: '',
      htmlViewContent: '',
      toc: '',
      EditorMode: "ace",
      previewShow: true,
      aceDivClass: "col-md-12"
    }
  },
  created:function(){
    this.markdownContent = '# XK-Editor'
    this.htmlViewContent = toHtml(this.markdownContent)
  },
  computed: {
    EditorModeShow: function() {
      if(this.EditorMode === 'ace') {
        return true
      } else if(this.EditorMode === 'tinymce') {
        return false
      }
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
      this.htmlViewContent = val
      this.$nextTick(function() {
        Prism.highlightAll()
      })
      this.renderNextTick()
    }
  },
  methods: {
    switchEditor: function() {
      if(this.EditorMode !== 'ace') {
        this.markdownContent = toMarkdown(this.htmlContent)
        this.$refs.ace.setValue(this.markdownContent)
        this.EditorMode = 'ace'
      } else if(this.EditorMode !== 'tinymce') {
        this.htmlContent = toHtml(this.markdownContent)
        this.$refs.tinymce.setValue(this.htmlContent)
        this.EditorMode = 'tinymce'
      }
    },
    switchPreviewShow: function() {
      if(this.previewShow) {
        this.previewShow = false
        this.aceDivClass = "col-md-24"
      } else {
        this.previewShow = true
        this.aceDivClass = "col-md-12"
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
