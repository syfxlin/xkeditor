<!--
  /**
  * Ace编辑器
  * @module /components
  * @desc 将Ace编辑器封装为Markdown编辑器，数据实时同步至父组件，父组件通过调用函数将数据传入该组件，初始化数据通过props传输，之后通过setValue方法传输
  * @author Otstar Lin
  * @date 2019年4月
  * @param {String} [value]  - 初始数据
  * @example 调用示例
  *  <ace v-model="md_content" ref="ace"></ace>
  *  <button @click="switchEditor('ace')">switchToAce</button>
  * @import 导入
  *  import ACE from './components/ACE_Editor.vue'
  *  Vue.component('ace', ACE)
  */
-->
<template>
  <div class="ace-container">
    <div class="ace-toolbar" v-show="aceToolbarShow">
      <template v-for="num in 6">
        <button class="xk-button" type="text" :key="num.id" :title="'标题' + num" @click="toolbarClick('h' + num)">
          <b>H{{ num }}</b>
        </button>
      </template>
      <template v-for="item in aceToolbarButtons">
        <template v-if="item.icon === '|'">
          <span :key="item.id">|</span>
        </template>
        <template v-else>
          <button
            class="xk-button" 
            :key="item.id"
            type="text"
            :title="item.title"
            @click="toolbarClick(item.operate)"
          >
            <fa-icon :icon="item.icon"/>
          </button>
        </template>
      </template>
    </div>
    <div class="ace-toolbar-html ace-toolbar" v-show="!aceToolbarShow&&aceToolbarHtmlShow">
      <button class="xk-button" type="text" title="转换为Markdown模式" @click="function(){aceToolbarShow = true;switchEditorMode()}"><fa-icon icon="file-code"/> 转换为Markdown模式</button>
    </div>
    <div class="ace-editor" ref="ace"></div>
    <div class="ace-toolbar-modal" v-show="aceToolbarModal.base.isShowModal" v-dialogDrag>
      <div class="xk-modal-wrapper">
        <div class="xk-modal">
          <div class="xk-modal-header">
            <div class="xk-modal-title">
              <p>{{ aceToolbarModal.data.modalTitle }}</p>
            </div>
          </div>
          <div class="xk-modal-body">
            <div v-show="aceToolbarModal.link">
              <label>链接</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.href" placeholder="请输入链接" autofocus></input>
              </div>
              <label>标题</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.title" placeholder="请输入标题"></input>
              </div>
            </div>
            <div v-show="aceToolbarModal.image">
              <label>图片链接</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.src" placeholder="请输入图片链接" autofocus></input>
              </div>
              <label>图片描述</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.art" placeholder="请输入图片描述"></input>
              </div>
            </div>
            <div v-show="aceToolbarModal.video">
              <label>视频链接</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.src" placeholder="请输入视频链接" autofocus></input>
              </div>
              <div class="xk-row">
                <div class="xk-input xk-col-12">
                  <input v-model="aceToolbarModal.data.width" placeholder="请输入宽"></input>
                </div>
                <div class="xk-input xk-col-12">
                  <input v-model="aceToolbarModal.data.height" placeholder="请输入高"></input>
                </div>
              </div>
            </div>
            <div v-show="aceToolbarModal.toLine">
              <label>行号(1-{{ aceToolbarModal.data.allLine }})</label>
              <div class="xk-input">
                <input v-model="aceToolbarModal.data.line" placeholder="请输入行号" autofocus></input>
              </div>
            </div>
            <div v-show="aceToolbarModal.table">
              <label>单元格数</label>
              <div class="xk-row">
                <div class="xk-input xk-col-12">
                  <input v-model="aceToolbarModal.data.row" placeholder="请输入行数" autofocus></input>
                </div>
                <div class="xk-input xk-col-12">
                  <input v-model="aceToolbarModal.data.column" placeholder="请输入列数"></input>
                </div>
              </div>
              <label>对齐方式</label>
              <div>
                <div class="xk-radio-group">
                  <div class="xk-radio">
                    <input type="radio" value="normal" v-model="aceToolbarModal.data.type" id="xk-type-normal" />
                    <label for="xk-type-normal"><div class="advice"></div><fa-icon icon="align-justify"/></label>
                  </div>
                  <div class="xk-radio">
                    <input type="radio" value="left" v-model="aceToolbarModal.data.type" id="xk-type-left" />
                    <label for="xk-type-left"><div class="advice"></div><fa-icon icon="align-left"/></label>
                  </div>
                  <div class="xk-radio">
                    <input type="radio" value="center" v-model="aceToolbarModal.data.type" id="xk-type-center" />
                    <label for="xk-type-center"><div class="advice"></div><fa-icon icon="align-center"/></label>
                  </div>
                  <div class="xk-radio">
                    <input type="radio" value="right" v-model="aceToolbarModal.data.type" id="xk-type-right" />
                    <label for="xk-type-right"><div class="advice"></div><fa-icon icon="align-right"/></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="xk-clear"></div>
          <div class="xk-modal-footer">
            <button class="xk-button" @click="aceToolbarCancer">取消</button>
            <button class="xk-button xk-button-primary" @click="aceToolbarSubmit">确定</button>
          </div>
          <span class="xk-modal-close" @click="aceToolbarCancer">
            <fa-icon icon="times"/>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ace from "ace-builds";
import "ace-builds/webpack-resolver"; // 在 webpack 环境中使用必须要导入
import "ace-builds/src-noconflict/theme-solarized_light"; // 默认设置的主题
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/snippets/markdown";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/ext-language_tools";

//fa icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

//switch markdown and html
import { toHtml, toMarkdown } from '@/utils/switchContent'

export default {
  components: {
    "fa-icon": FontAwesomeIcon
  },
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      aceEditor: null,
      isMarkdownMode: true,
      aceToolbarShow: true,
      aceToolbarHtmlShow: true,
      aceToolbarModal: {
        base: {
          isShowModal: false,
        },
        data: {
          modalTitle: ' ',
          allLine: 1,
        },
        link: false,
        image: false,
        video: false,
        toLine: false,
        search: false,
        table: false
      },
      aceToolbarButtons: [
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "粗体",
          operate: "bold",
          icon: "bold"
        },
        {
          title: "斜体",
          operate: "italic",
          icon: "italic"
        },
        {
          title: "下划线",
          operate: "underline",
          icon: "underline"
        },
        {
          title: "删除线",
          operate: "strikethrough",
          icon: "strikethrough"
        },
        {
          title: "引用",
          operate: "quote",
          icon: "quote-left"
        },
        {
          title: "标记块",
          operate: "mark",
          icon: "code"
        },
        {
          title: "代码块",
          operate: "code",
          icon: "terminal"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "上标",
          operate: "sup",
          icon: "superscript"
        },
        {
          title: "下标",
          operate: "sub",
          icon: "subscript"
        },
        {
          title: "添加行内公式",
          operate: "tex-$",
          icon: "dollar-sign"
        },
        {
          title: "添加块公式",
          operate: "tex-math",
          icon: "divide"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "添加流程图",
          operate: "flow",
          icon: "ellipsis-h"
        },
        {
          title: "添加时序图",
          operate: "seq",
          icon: "circle"
        },
        {
          title: "添加甘特图",
          operate: "gantt",
          icon: "square"
        },
        {
          title: "添加图",
          operate: "mermaid",
          icon: "cubes"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "无序列表",
          operate: "ul",
          icon: "list-ul"
        },
        {
          title: "有序列表",
          operate: "ol",
          icon: "list-ol"
        },
        {
          title: "分割线",
          operate: "minus",
          icon: "minus"
        },
        {
          title: "表格",
          operate: "table",
          icon: "table"
        },
        {
          title: "时间",
          operate: "time",
          icon: "clock"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "链接",
          operate: "link",
          icon: "link"
        },
        {
          title: "图片",
          operate: "image",
          icon: "image"
        },
        {
          title: "媒体",
          operate: "video",
          icon: "video"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "跳转到指定行",
          operate: "toLine",
          icon: "level-down-alt"
        },
        {
          title: "搜索",
          operate: "search",
          icon: "search"
        },
        {
          title: "显示/隐藏目录",
          operate: "toc",
          icon: "bars"
        },
        {
          title: "切换实时预览",
          operate: "switchPreview",
          icon: "eye"
        },
        {
          title: "全窗口预览",
          operate: "fullPreview",
          icon: "tv"
        },
        {
          title: "全屏",
          operate: "fullScreen",
          icon: "arrows-alt"
        },
        {
          title: "转换为HTML编辑",
          operate: "toHtmlEditor",
          icon: "file-code"
        },
        {
          title: "转换为TinyMCE编辑器",
          operate: "toTinyMCE",
          icon: "sync-alt"
        },
        {
          title: "清空",
          operate: "empty",
          icon: "eraser"
        },
        {
          title: "设置",
          operate: "setting",
          icon: "cog"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "撤销",
          operate: "undo",
          icon: "undo"
        },
        {
          title: "重做",
          operate: "redo",
          icon: "redo"
        },
        {
          title: "",
          operate: "|",
          icon: "|"
        },
        {
          title: "帮助",
          operate: "help",
          icon: "question-circle"
        },
        {
          title: "关于",
          operate: "about",
          icon: "info-circle"
        }
      ]
    };
  },
  mounted() {
    //初始化Value
    this.setting.value = this.value ? this.value : ""
    this.aceEditor = ace.edit(this.$refs.ace, 
      this.setting
    )
    this.aceEditor.getSession().on('change', this.updateValue)
  },
  methods: {
    setValue(val) {
      this.aceEditor.setValue(val);
    },
    updateValue() {
      this.$emit("input", this.aceEditor.getSession().getValue())
    },
    switchEditorMode() {
      if(this.isMarkdownMode) {
        this.switchToHtml()
      } else {
        this.switchToMarkdown()
      }
    },
    switchToHtml() {
      if (this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/html");
        this.aceEditor.setValue(toHtml(this.aceEditor.getSession().getValue()))
        this.isMarkdownMode = false;
      }
    },
    switchToMarkdown() {
      if (!this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/markdown");
        this.aceEditor.setValue(toMarkdown(this.aceEditor.getSession().getValue()));
        this.isMarkdownMode = true;
      }
    },
    toolbarClick(operate) {
      this.aceToolbarModal.data.operate = operate
      let str = '';
      let isStart = false;
      let toLeft = 0;
      let selectText = this.aceEditor.getSelectedText();
      if (operate.match(/^h(\d)/)) {
        str = "#".repeat(operate.substring(1)) + " ";
        isStart = true;
      } else if (operate === "bold") {
        str = "**" + selectText + "**";
        toLeft = 2;
      } else if (operate === "italic") {
        str = "*" + selectText + "*";
        toLeft = 1;
      } else if (operate === "underline") {
        str = '<span style="text-decoration: underline;">' + selectText + "</span>";
        toLeft = 7;
      } else if (operate === "strikethrough") {
        str = "~" + selectText + "~";
        toLeft = 1;
      } else if (operate === "quote") {
        str = "> ";
        isStart = true;
      } else if (operate === "mark") {
        str = "`" + selectText + "`";
        toLeft = 1;
      } else if (operate === "code") {
        str = "```\n```";
        toLeft = 4;
      } else if(operate === "sup") {
        str = "<sup>" + selectText + "</sup>"
        toLeft = 6
      } else if(operate === "sub") {
        str = "<sub>" + selectText + "</sub>"
        toLeft = 6
      } else if(operate === "tex-$") {
        str = "$$" + selectText + "$$"
        toLeft = 2
      } else if(operate === "tex-math") {
        str = "```math\n\n```"
        toLeft = 4
      } else if(operate === "flow") {
        str = "```flow\n```"
        toLeft = 4
      } else if(operate === "seq") {
        str = "```seq\n\n```"
        toLeft = 4
      } else if(operate === "gantt") {
        str = "```gantt\n\n```"
        toLeft = 4
      } else if(operate === "mermaid") {
        str = "```mermaid\n\n```"
        toLeft = 4
      } else if (operate === "ul") {
        str = "- ";
        isStart = true;
      } else if (operate === "ol") {
        str = "1. ";
        isStart = true;
      } else if (operate === "minus") {
        str = "\n---\n\n";
        isStart = true;
      } else if (operate === "table") {
        this.operateModal(operate, true, '添加表格')
        return;
      } else if (operate === "time") {
        str = new Date().toLocaleString();
      } else if (operate === "link") {
        this.operateModal(operate, true, '添加链接')
        return;
      } else if (operate === "image") {
        this.operateModal(operate, true, '添加图片')
        return;
      } else if (operate === "video") {
        this.operateModal(operate, true, '添加视频')
        return;
      } else if (/(toLine|search|toc|switchPreview|fullPreview|fullScreen|toHtmlEditor|toTinyMCE|empty|setting|undo|redo)/g.test(operate)) {
        this.execCommand(operate)
      }
      this.operateAceContent(isStart, toLeft, str)
    },
    operateModal(operate, isShow, title = '') {
      if(!isShow) {
        this.aceToolbarModal[operate] = false
        return;
      }
      this.aceToolbarModal[operate] = true;
      this.aceToolbarModal.data.modalTitle = title
      this.aceToolbarModal.base.isShowModal = true;
    },
    operateAceContent(isStart, toLeft, str) {
      let range = this.aceEditor.getSelectionRange();
      if (isStart) {
        for (let i = range.start.row; i <= range.end.row; i++) {
          this.aceEditor.session.replace(new ace.Range(i, 0, i, 0), str);
        }
      } else {
        this.aceEditor.session.replace(range, str);
      }
      if (toLeft) {
        this.aceEditor.navigateLeft(toLeft);
      }
      this.aceEditor.focus();
    },
    aceToolbarSubmit() {
      let str = ''
      let data = this.aceToolbarModal.data
      if(data.operate === 'table') {
        if(data.row > 1) {
          data.row = parseInt(data.row) + 1
        }
        for (let i = 0; i < data.row; i++) {
          for (let j = 0; j < data.column; j++) {
            str += '| '
            if(i == 1) {
              if(data.type === 'left' || data.type === 'center') {
                str += ':'
              }
              str += '----------'
              if(data.type === 'right' || data.type === 'center') {
                str += ':'
              }
            }
            str += ' '
          }
          str += '|\n'
        }
      } else if(data.operate === 'link') {
        str = '[' + data.title + '](' + data.href + ')'
      } else if(data.operate === 'image') {
        str = '![' + data.art + '](' + data.src + ')'
      } else if(data.operate === 'video') {
        if(!/\w+\.(\w+)$/.test(data.src)) {
          this.$Message.error('地址输入有误！请重新输入(无法识别扩展名)')
          return
        }
        let type = data.src.match(/\w+\.(\w+)$/)
        str = '<video controls="controls" width="' + data.width + '" height="' + data.height + '"><source src="' + data.src + '" type="video/' + type[1] + '" /></video>'
      } else if(data.operate === 'toLine') {
        this.aceEditor.gotoLine(data.line)
        this.aceEditor.focus()
        this.operateModal(data.operate, false)
        this.aceToolbarCancer()
        return
      }
      this.operateModal(data.operate, false)
      this.operateAceContent(false, 0, str)
      this.aceToolbarCancer()
    },
    aceToolbarCancer() {
      this.aceToolbarModal.link =  false
      this.aceToolbarModal.image = false
      this.aceToolbarModal.video = false
      this.aceToolbarModal.toLine = false
      this.aceToolbarModal.search = false
      this.aceToolbarModal.table = false
      this.aceToolbarModal.base.isShowModal = false
    },
    operateFullScreen() {
      if(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
        if(document.exitFullscreen) {
          return document.exitFullscreen()
        } else if(document.webkitExitFullscreen) {
          return document.webkitExitFullscreen()
        } else if(document.mozCancelFullScreen) {
          return document.mozCancelFullScreen()
        } else if(document.msExitFullscreen) {
          return document.msExitFullscreen()
        }
      } else {
        var root = document.documentElement
        if(root.requestFullscreen) {
          return root.requestFullscreen()
        } else if(root.webkitRequestFullscreen) {
          return root.webkitRequestFullscreen()
        } else if(root.mozRequestFullScreen) {
          return root.mozRequestFullScreen()
        } else if(root.msRequestFullscreen) {
          return root.msRequestFullscreen()
        }
      }
    },
    execCommand(command, data = null) {
      if (command === "toLine") {
        this.aceToolbarModal.data.allLine = this.aceEditor.session.getLength();
        this.operateModal(command, true, '跳转到指定行')
        return;
      } else if (command === "search") {
        this.aceEditor.commands.commands.find.exec(this.aceEditor);
        return;
      } else if(command === "toc") {
        this.$parent.switchToc()
        return;
      } else if(command === "switchPreview") {
        this.$parent.switchPreviewShow()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return;
      } else if(command === "fullPreview") {
        this.$parent.switchPreviewFull()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return;
      } else if(command === "fullScreen") {
        this.operateFullScreen()
        return;
      } else if (command === "toHtmlEditor") {
        this.switchEditorMode()
        this.aceToolbarShow = false;
        return;
      } else if(command === "toTinyMCE") {
        window.$switchEditor()
        return;
      } else if (command === "empty") {
        this.aceEditor.setValue("");
        return;
      } else if (command === "setting") {
        this.aceEditor.commands.commands.showSettingsMenu.exec(this.aceEditor);
        return;
      } else if(command === "undo") {
        this.aceEditor.undo()
        return;
      } else if(command === "redo") {
        this.aceEditor.redo()
        return;
      } else if(command === "toolbar") {
        this.aceToolbarShow = !this.aceToolbarShow
        this.aceToolbarHtmlShow = !this.aceToolbarHtmlShow
        return
      } else if(command === "resize") {
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return
      } else if(command === "addKeys") {
        for(let i = 0; i < data.length; i++) {
          this.aceEditor.commands.addCommand({
            name: data[i].name,
            bindKey: {win: data[i].win,  mac: data[i].mac},
            exec: data[i].exec,
            readOnly: true
          });
        }
      } else if(command === "removeKeys") {
        for(let i = 0; i < data.length; i++) {
          this.aceEditor.commands.removeCommand(data[i])
        }
      }
    }
  }
};
</script>

<style scoped>
.show {
  display: block;
}
.hide {
  display: none;
}
.ace-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.ace-container .bookmarklet {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  z-index: 2;
  cursor: pointer;
  border-width: 9px;
  border-style: solid;
  border-color: lightblue gray gray rgb(206, 173, 230);
  border-image: initial;
}
.ace-toolbar {
  background: #fff;
}
.ace-toolbar span {
  padding: 0px;
}
.ace-toolbar-modal .xk-input {
  margin-top: 5px;
  margin-bottom: 10px;
}
.ace-editor {
  flex: 1;
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
.xk-button-primary {
  color: #fff;
  background: #6190e8;
}
.ace-toolbar .xk-button {
  background: none;
  color: #6190E8;
  color: #3F536E;
  border: none;
  font-size: 1em;
  padding: 0.6em;
}
.xk-input {
  position: relative;
  font-size: 0.85em;
  line-height: 1.5;
  outline: 0;
}
.xk-input input {
  display: block;
  width: 100%;
  padding: 6px 32px 6px 12px;
  color: #3F536E;
  font-size: 12px;
  background-color: #FFF;
  border: 1px solid #C5D9E8;
  border-radius: 4px;
  -webkit-transition: border .2s;
  transition: border .2s;
  outline: none;
  box-sizing: border-box;
}
.xk-input input:hover {
  border-color: #79A1EB;
}
.xk-input i {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0 6px 0 0;
  width: 20px;
  height: 100%;
  color: #C5D9E8;
  font-size: 15px;
  text-align: center;
}
.xk-radio {
  display: inline-block;
  padding: 2px 5px;
}
.xk-radio input {
  display: none;
}
.xk-radio input + label {
  font-size: 1.1em;
}
.xk-radio input + label svg {
  vertical-align: middle;
}
.xk-radio input[type="radio"] + label .advice {
  width: 1.1em;
  height: 1.1em;
  border: 1px solid #c5d9e8;
  border-radius: 50%;
  background-color: #fff;
  -webkit-transition: border .2s;
  transition: border .2s;
  display: inline-block;
  vertical-align: middle;
  margin: 5px;
}
.xk-radio input[type="radio"]:checked + label .advice {
  background: #79a1eb;
}
.xk-modal-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  outline: 0;
  z-index: 1000;
}
.xk-modal {
  position: relative;
  top: 100px;
  width: 520px;
  margin: 0 auto 0 100px;
  border: none;
  border-radius: 4px;
  background-color: #FFF;
  outline: none;
}
.xk-modal-header {
  padding: 12px 16px;
  color: #2C405A;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
  border-bottom: 1px solid #ECECEC;
}
.xk-modal-header p, .xk-modal-header .xk-modal-title {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  vertical-align: middle;
}
.xk-modal-body {
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
}
.xk-modal-footer {
  padding: 12px 16px;
  border-top: 1px solid #ECECEC;
  text-align: right;
}
.xk-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 13px;
  line-height: 1;
  overflow: hidden;
  cursor: pointer;
}
.xk-row {
  display: block;
  width: 100%;
}
.xk-col-12 {
  width: 50%;
  float: left;
}
.xk-clear {
  clear: both;
}
</style>