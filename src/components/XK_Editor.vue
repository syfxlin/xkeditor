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
  <template  v-if="isRenderEditor">
  <div class="row">
    <div :class="aceDivClass" v-show="editorModeShow&&previewShow!='full'"><ace v-model="markdownContent" :setting="setting.aceSetting" ref="ace"></ace></div>
    <div :class="aceDivClass" v-show="editorModeShow&&previewShow!='hide'"><div class="markdown-body" v-html="htmlViewContent" id="previewHtml" ref="htmlView"></div></div>
    <div class="xk-col-24" v-show="!editorModeShow"><tinymce v-model="htmlContent" :setting="setting.tinymceSetting" ref="tinymce"></tinymce></div>
    <button class="xk-button close-preview-full" @click="switchPreviewFull()" v-show="editorModeShow&&previewShow=='full'">关闭</button>
    <transition name="slide-fade">
      <div id="toc" v-show="showToc"></div>
    </transition>
  </div>
  </template>
</div>
</template>

<script>
//导入基础组件
import '@/utils/dialogDrag'
import ACE from '@/components/ACE_Editor'
import TinyMCE from '@/components/TinyMCE_Editor'

import { axiosPro } from "@/utils/axiosPro"
//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from '../utils/switchContent.js'

import katex from "katex"
import "katex/dist/katex.min.css"
import renderMathInElement from "katex/dist/contrib/auto-render"
import mermaid from "mermaid"

export default {
  name: 'XK_Editor',
  components: {
    'ace': ACE,
    'tinymce': TinyMCE
  },
  props: {
  },
  data () {
    return {
      isRenderEditor: false,
      markdownContent: '',
      htmlContent: '',
      htmlViewContent: '',
      toc: '',
      showToc: false,
      EditorMode: "ace",
      previewShow: 'show',
      aceDivClass: "xk-col-12",
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
          spellchecker_whitelist: ['Ephox', 'Moxiecode'],
          images_upload_handler(blobInfo, success, failure) {
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
    }
  },
  computed: {
    editorModeShow() {
      if(this.EditorMode === 'ace') {
        return true
      } else if(this.EditorMode === 'tinymce') {
        return false
      }
    }
  },
  async mounted() {
    await this.load()
    this.htmlViewContent = toHtml(this.markdownContent, true, true)
    await this.initEditor()
    this.setInterface()
  },
  methods: {
    async load() {
      let md = await axiosPro.get('/static/md_content.md')
      let setting = await axiosPro.get('/static/setting.json')
      this.markdownContent = md
      this.setting = setting
      this.loadCss(setting.xkeditorSetting.previewCss)
      this.isRenderEditor = true
    },
    loadCss(url) {
      let css = document.createElement('link');
      css.href = url;
      css.rel = 'stylesheet';
      css.type = 'text/css';
      document.head.appendChild(css);
    },
    initEditor() {
      mermaid.initialize({startOnLoad:true})
      window.$ace = this.$refs.ace.aceEditor
      window.$switchEditor = this.switchEditor
      window.scrollBind = function(operate = null) {
        var currentTab = 1
        var editorDom = document.querySelector('.ace-editor')
        var previewHtmlDom = document.querySelector('#previewHtml')
        var aceContentHeight =  window.$ace.renderer.scrollBarV.scrollHeight - editorDom.offsetHeight
        var previewHtmlHeight = previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight
        window.scale = previewHtmlHeight/aceContentHeight
        if(operate === 'init') {
          editorDom.addEventListener('mouseover', function() {
            currentTab = 1
          })
          previewHtmlDom.addEventListener('mouseover', function() {
            currentTab = 2
          })
          window.$ace.session.on("changeScrollTop", function(data) {
            if(currentTab === 1) {
              previewHtmlDom.scrollTop = data * window.scale
            }
          });
          previewHtmlDom.addEventListener('scroll', function() {
            if (currentTab === 2) {
              window.$ace.session.setScrollTop(previewHtmlDom.scrollTop / window.scale)
            }
          })
        }
      }
      //初始化滚动绑定
      this.$nextTick(function() {
        setTimeout(function() {
          window.scrollBind('init')
        }, 1000)
      })
      //初始化TOC
      this.initTocTree()
      window.toggleToc = this.toggleToc
    },
    switchEditor() {
      if(this.EditorMode !== 'ace') {
        this.markdownContent = toMarkdown(this.htmlContent)
        this.$refs.ace.setValue(this.markdownContent)
        this.EditorMode = 'ace'
      } else if(this.EditorMode !== 'tinymce') {
        this.htmlContent = toHtml(this.markdownContent, false)
        this.$refs.tinymce.setValue(this.htmlContent)
        this.EditorMode = 'tinymce'
      }
    },
    switchPreviewShow() {
      if(this.previewShow == 'show') {
        this.previewShow = 'hide'
        this.aceDivClass = "xk-col-24"
      } else {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
      }
    },
    switchPreviewFull() {
      if(this.previewShow == 'full') {
        this.previewShow = 'show'
        this.aceDivClass = "xk-col-12"
      } else {
        this.previewShow = 'full'
        this.aceDivClass = "xk-col-24"
      }
    },
    renderNextTick() {
      this.$nextTick(function() {
        //制作TOC
        document.getElementById('toc').innerHTML = getTocHtml()
        //更新TOC icon
        this.initTocTree()
        //制作文章内TOC
        if(document.getElementsByClassName('toc').length > 0) {
          document.getElementsByClassName('toc')[0].innerHTML = getTocHtml()
        }
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
        //更新滚动绑定
        window.scrollBind()
      })
    },
    switchToc() {
      this.showToc = (!this.showToc)
    },
    initTocTree() {
      var items = document.querySelectorAll('#toc .toc-img ~ ul')
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.children[0].setAttribute('src', '/static/svg/minus-square.svg')
        items[i].parentNode.children[0].setAttribute('onclick', 'toggleToc(this)')
      }
    },
    toggleToc(ele) {
      var display = ele.nextElementSibling.nextElementSibling.style.display
      if(display === '' || display === 'block') {
        ele.nextElementSibling.nextElementSibling.style.display = 'none'
        ele.setAttribute('src', '/static/svg/plus-square.svg')
      } else {
        ele.nextElementSibling.nextElementSibling.style.display = 'block'
        ele.setAttribute('src', '/static/svg/minus-square.svg')
      }
    },
    setInterface() {
      var _this = this
      window.XKEditor = {
        getMarkdown: function() {
          return _this.markdownContent
        },
        getHTML: function() {
          return _this.htmlViewContent
        },
        switchEditor: function() {
          _this.switchEditor()
        },
        switchPreview: function() {
          _this.$refs.ace.execCommand('switchPreview')
        },
        switchFullPreview: function() {
          _this.$refs.ace.execCommand('fullPreview')
        },
        switchFullScreen: function() {
          _this.$refs.ace.execCommand('fullScreen')
        },
        toLine: function() {
          _this.$refs.ace.execCommand('toLine')
        },
        toc: function() {
          _this.$refs.ace.execCommand('toc')
        },
        toolbar: function() {
          _this.$refs.ace.execCommand('toolbar')
        },
        resize: function() {
          _this.$refs.ace.execCommand('resize')
        },
        addKeys: function(keys) { // keys = [{name,win,mac,exec},{name,win,mac,exec}]
          _this.$refs.ace.execCommand('addKeys', keys)
        },
        removeKeys: function(keys) { // keys = [name, name]
          _this.$refs.ace.execCommand('removeKeys', keys)
        },
        getEditor: function(name) {
          if(name === 'ace') {
            return window.$ace
          } else if(name === 'tinymce') {
            return window.tinymce
          }
        }
      }
    }
  },
  watch: {
    markdownContent (val) {
      this.htmlViewContent = toHtml(val, true)
      this.renderNextTick()
    },
    htmlContent(val) {
      this.htmlViewContent = val
      this.renderNextTick()
      this.$nextTick(function() {
        Prism.highlightAll()
      })
    }
  }
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
.xkeditor .row .xk-col-12 {
  height: 100%;
}
#previewHtml {
  overflow: auto;
  max-height: 100%;
  padding: 15px 15px;
  word-break: break-all;
  white-space: normal;
  box-sizing: border-box;
}
.toc ul,
#toc ul {
  margin: 0px;
  padding-left: 20px;
}
.toc li,
#toc li {
  list-style: none;
  padding-left: 5px;
}
.toc li img,
#toc li img {
  display: inline-block;
  width: 14px;
  vertical-align: middle;
  padding-right: 5px;
}
.row {
  margin: 0px;
}
.row .xk-col-12 {
  float: left;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
  
}
.xk-col-24 {
  padding: 0px;
  width: 100%;
  height: 100%;
}
.xk-col-12 {
  padding: 0px;
  width: 50%;
  height: 100%;
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
  background: #f5f5f5;
  overflow-y: auto;
  border-left: 1px solid #ddd;
}
.xk-button {
  display: inline-block;
  padding: 6px 16px;
  outline: 0;
  font-size: 0.85em;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #C5D9E8;
  border-radius: 4px;
  background-color: #FFF;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
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
