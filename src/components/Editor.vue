<template>
<div class="xkeditor">
  <div class="row">
    <div :class="aceDivClass" v-show="EditorModeShow&&previewShow!='full'"><ace v-model="markdownContent" ref="ace"></ace></div>
    <div :class="aceDivClass" v-html="htmlViewContent" id="previewHtml" ref="htmlView" v-show="EditorModeShow&&previewShow!='hide'"></div>
    <div class="col-md-24" v-show="!EditorModeShow"><tinymce v-model="htmlContent" ref="tinymce"></tinymce></div>
    <at-button icon="icon-x" circle class="close-preview-full" @click="switchPreviewFull()" v-show="EditorModeShow&&previewShow=='full'"></at-button>
    <transition name="slide-fade">
      <div id="toc" v-show="showToc"></div>
    </transition>
  </div>
  <div class="fixed-button">
    <button @click="switchToc">toc</button>
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
      showToc: false,
      EditorMode: "ace",
      previewShow: 'show',
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
      this.renderNextTick()
    },
    htmlContent: function(val) {
      this.htmlViewContent = val
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
      if(this.previewShow == 'show') {
        this.previewShow = 'hide'
        this.aceDivClass = "col-md-24"
      } else {
        this.previewShow = 'show'
        this.aceDivClass = "col-md-12"
      }
    },
    switchPreviewFull: function() {
      if(this.previewShow == 'full') {
        this.previewShow = 'show'
        this.aceDivClass = "col-md-12"
      } else {
        this.previewShow = 'full'
        this.aceDivClass = "col-md-24"
      }
    },
    renderNextTick: function() {
      this.$nextTick(function() {
        //制作TOC
        document.getElementById('toc').innerHTML = getTocHtml();
        //代码高亮
        Prism.highlightAll()
        //转换Tex公式
        renderMathInElement(document.getElementById('previewHtml'), {
          delimiters: [
            {left: "$$", right: "$$"},
            {left: "```math", right: "```"},
            {left: "```tex", right: "```"}
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        });
        //转换Mermaid图
        try {
          mermaid.init({noteMargin: 10}, ".xkeditor-mermaid");
        } catch (error) {
          console.log("May have errors")
        }
      })
    },
    switchToc: function() {
      this.showToc = (!this.showToc)
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
.xkeditor {
  height: 100%;
  overflow-x: hidden;
}
.xkeditor .row {
  height: 100%;
  transform:translate(0,0);
}
.xkeditor .row .col-md-12 {
  height: 100%;
}
#previewHtml {
  overflow: auto;
  max-height: 100%;
  padding: 15px;
  word-break: break-all;
  white-space: normal;
}
.toc ul {
  margin-left: 20px;
}
.row {
  margin: 0px;
}
.col-md-24 {
  padding: 0px;
}
.col-md-12 {
  padding: 0px;
}
.fixed-button {
  position: fixed;
  left: 10px;
  bottom: 10px;
  z-index: 1000;
}
.close-preview-full {
  position: fixed;
  right: 10px;
  top: 10px;
}
#toc {
  position: fixed;
  right: 0px;
  width: 30%;
  height: 100%;
  background: #fff;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
