<!--
  /**

  当前架构
  ACE_Editor -> Editor(markdownContent)
  TinyMCE_Editor -> Editor(htmlContent)
  预览的HTML == htmlViewContent
  markdownContent.toHtmlFull -> htmlViewContent
  htmlContent -> htmlViewContent
  
  Set:
  switch时
  htmlContent.toMarkdown -> markdownContent => ACE_Editor
  markdownContent.toHtml -> htmlContent => TinyMCE_Editor
  
  Render:
  Prism.js 在转换时就渲染
  Mermaid  在转换后推送到DOM后渲染
  KaTex    在转换后推送到DOM后渲染
  TOC      在转换后推送到DOM后渲染
  
  滚动绑定 在每次输入推送到DOM后进行重新计算
  
  TODO:
  优化界面
  提升TinyMCE编辑体验
  重构，集中设置项
  添加设置面板，存放部分设置
  */
-->

<template>
<div class="xkeditor">
  <div class="row">
    <div :class="aceDivClass" v-show="EditorModeShow&&previewShow!='full'"><ace v-model="markdownContent" :setting="aceSetting" ref="ace"></ace></div>
    <div :class="aceDivClass + ' markdown-body'" v-html="htmlViewContent" id="previewHtml" ref="htmlView" v-show="EditorModeShow&&previewShow!='hide'"></div>
    <div class="col-md-24" v-show="!EditorModeShow"><tinymce v-model="htmlContent" :setting="tinymceSetting" ref="tinymce"></tinymce></div>
    <at-button icon="icon-x" circle class="close-preview-full" @click="switchPreviewFull()" v-show="EditorModeShow&&previewShow=='full'">Close</at-button>
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
      aceDivClass: "col-md-12",
      tinymceSetting: {
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
      }
    }
  },
  created:function(){
    this.markdownContent = '# XK-Editor'
    this.htmlViewContent = toHtml(this.markdownContent, true, true)
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
      this.htmlViewContent = toHtml(val, true)
      this.renderNextTick()
    },
    htmlContent: function(val) {
      this.htmlViewContent = val
      this.renderNextTick()
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  },
  methods: {
    switchEditor: function() {
      if(this.EditorMode !== 'ace') {
        this.markdownContent = toMarkdown(this.htmlContent)
        this.$refs.ace.setValue(this.markdownContent)
        this.EditorMode = 'ace'
      } else if(this.EditorMode !== 'tinymce') {
        //TODO: TinyMCE在代码互转的情况下体验不佳
        this.htmlContent = toHtml(this.markdownContent, false)
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
        //TODO: 性能消耗严重，导致卡顿出现，已经移至输出渲染（部分渲染部分更新）
        // Prism.highlightAll()
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
        //双向滚动绑定
        var currentTab = 1
        var editorDom = document.querySelector('.ace-editor')
        var previewHtmlDom = document.querySelector('#previewHtml')
        var aceContentHeight =  this.$refs.ace.aceEditor.renderer.scrollBarV.scrollHeight - editorDom.offsetHeight
        var previewHtmlHeight = previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight
        var scale = previewHtmlHeight/aceContentHeight
        editorDom.addEventListener('mouseover', function() {
          // 1 表示表示当前鼠标位于 .left元素范围内
          currentTab = 1
        })
        previewHtmlDom.addEventListener('mouseover', function() {
          // 2 表示表示当前鼠标位于 .right元素范围内
          currentTab = 2
        })
        this.$refs.ace.aceEditor.session.on("changeScrollTop", function(data) {
          if(currentTab === 1) {
            previewHtmlDom.scrollTop = data * scale
          }
        });
        previewHtmlDom.addEventListener('scroll', function() {
          if (currentTab === 2) {
            window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / scale)
          }
        })
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
    },
  },
  mounted() {
    mermaid.initialize({startOnLoad:true})
    window.scrollToAnchor = this.scrollToAnchor
    //TODO: 删除
    window.$ace = this.$refs.ace.aceEditor
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
  width: 20%;
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
