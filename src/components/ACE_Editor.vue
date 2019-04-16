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
        <at-button type="text" :key="num.id" :title="'标题' + num" @click="toolbarClick('h' + num)">
          <b>H{{ num }}</b>
        </at-button>
      </template>
      <template v-for="item in aceToolbarButtons">
        <template v-if="item.icon === '|'">
          <span :key="item.id">|</span>
        </template>
        <template v-else>
          <at-button
            :key="item.id"
            type="text"
            :title="item.title"
            @click="toolbarClick(item.operate)"
          >
            <fa-icon :icon="item.icon"/>
          </at-button>
        </template>
      </template>
    </div>
    <div class="ace-toolbar-html ace-toolbar" v-show="!aceToolbarShow">
      <at-button type="text" title="转换为Markdown模式" @click="function(){aceToolbarShow = true;switchEditorMode()}"><fa-icon icon="file-code"/> 转换为Markdown模式</at-button>
    </div>
    <div class="ace-editor" ref="ace"></div>

    <at-modal v-model="aceToolbarModal.base.isShowModal" @on-confirm="aceToolbarSubmit" class="ace-toolbar-modal" :title="aceToolbarModal.data.modalTitle" v-dialogDrag>
      <div v-show="aceToolbarModal.link">
        <label>链接</label>
        <at-input v-model="aceToolbarModal.data.href" placeholder="请输入链接" icon="link" autofocus></at-input>
        <label>标题</label>
        <at-input v-model="aceToolbarModal.data.title" placeholder="请输入标题" icon="file-text"></at-input>
      </div>
      <div v-show="aceToolbarModal.image">
        <label>图片链接</label>
        <at-input v-model="aceToolbarModal.data.src" placeholder="请输入图片链接" icon="link" autofocus></at-input>
        <label>图片描述</label>
        <at-input v-model="aceToolbarModal.data.art" placeholder="请输入图片描述" icon="info"></at-input>
      </div>
      <div v-show="aceToolbarModal.video">
        <label>视频链接</label>
        <at-input v-model="aceToolbarModal.data.src" placeholder="请输入视频链接" icon="link" autofocus></at-input>
        <div class="row">
          <at-input v-model="aceToolbarModal.data.width" placeholder="请输入宽" icon="link" class="col-md-12"></at-input>
          <at-input v-model="aceToolbarModal.data.height" placeholder="请输入高" icon="link" class="col-md-12"></at-input>
        </div>
      </div>
      <div v-show="aceToolbarModal.toLine">
        <label>行号(1-{{ aceToolbarModal.data.allLine }})</label>
        <at-input v-model="aceToolbarModal.data.line" placeholder="请输入行号" icon="info" autofocus></at-input>
      </div>
      <div v-show="aceToolbarModal.table">
        <label>单元格数</label>
        <div class="row">
          <at-input
            class="col-md-12"
            v-model="aceToolbarModal.data.row"
            placeholder="请输入行数"
            icon="row"
            autofocus
          ></at-input>
          <at-input
            class="col-md-12"
            v-model="aceToolbarModal.data.column"
            placeholder="请输入列数"
            icon="column"
          ></at-input>
        </div>
        <label>对齐方式</label>
        <div>
          <at-radio-group v-model="aceToolbarModal.data.type">
            <at-radio label="normal">
              <fa-icon icon="align-justify"/>
            </at-radio>
            <at-radio label="left">
              <fa-icon icon="align-left"/>
            </at-radio>
            <at-radio label="center">
              <fa-icon icon="align-center"/>
            </at-radio>
            <at-radio label="right">
              <fa-icon icon="align-right"/>
            </at-radio>
          </at-radio-group>
        </div>
      </div>
    </at-modal>
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
import { toHtml, toMarkdown } from './switchContent'

export default {
  components: {
    "fa-icon": FontAwesomeIcon
  },
  props: {
    value: String,
    setting: Object
  },
  mounted() {
    //初始化Value
    this.setting.value = this.value ? this.value : ""
    this.aceEditor = ace.edit(this.$refs.ace, 
      this.setting
    )
    this.aceEditor.getSession().on('change', this.updateValue)
  },
  data() {
    return {
      aceEditor: null,
      isMarkdownMode: true,
      aceToolbarShow: true,
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
        search: false
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
  methods: {
    setValue: function(val) {
      this.aceEditor.setValue(val);
    },
    updateValue: function() {
      this.$emit("input", this.aceEditor.getSession().getValue())
    },
    switchEditorMode: function() {
      if(this.isMarkdownMode) {
        this.switchToHtml()
      } else {
        this.switchToMarkdown()
      }
    },
    switchToHtml: function() {
      if (this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/html");
        this.aceEditor.setValue(toHtml(this.aceEditor.getSession().getValue()))
        this.isMarkdownMode = false;
      }
    },
    switchToMarkdown: function() {
      if (!this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/markdown");
        this.aceEditor.setValue(toMarkdown(this.aceEditor.getSession().getValue()));
        this.isMarkdownMode = true;
      }
    },
    toolbarClick: function(operate) {
      this.aceToolbarModal.data.operate = operate
      let str = null;
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
      } else if (operate === "toLine") {
        this.aceToolbarModal.data.allLine = this.aceEditor.session.getLength();
        this.operateModal(operate, true, '跳转到指定行')
        return;
      } else if (operate === "search") {
        this.aceEditor.commands.commands.find.exec(this.aceEditor);
      } else if(operate === "switchPreview") {
        this.$parent.switchPreviewShow()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
        return;
      } else if(operate === "fullPreview") {
        this.$parent.switchPreviewFull()
        this.$nextTick(function() {
          this.aceEditor.resize(this.aceEditor)
        })
      } else if (operate === "toHtmlEditor") {
        this.switchEditorMode()
        this.aceToolbarShow = false;
        return;
      } else if (operate === "empty") {
        this.aceEditor.setValue("");
        return;
      } else if (operate === "setting") {
        this.aceEditor.commands.commands.showSettingsMenu.exec(this.aceEditor);
      }
      this.operateAceContent(isStart, toLeft, str)
    },
    operateModal: function(operate, isShow, title = '') {
      if(!isShow) {
        this.aceToolbarModal[operate] = false
        return;
      }
      this.aceToolbarModal[operate] = true;
      this.aceToolbarModal.data.modalTitle = title
      this.aceToolbarModal.base.isShowModal = true;
    },
    operateAceContent: function(isStart, toLeft, str) {
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
    aceToolbarSubmit: function () {
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
        return;
      }
      this.operateModal(data.operate, false)
      this.operateAceContent(false, 0, str)
    }
  }
};
</script>

<style scoped>
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
.ace-toolbar * {
  font-size: 1.2em;
}
.ace-toolbar > * {
  padding: 0.4em 0.6em;
}
.ace-toolbar span {
  padding: 0px;
}
.ace-toolbar-modal .at-input {
  margin-top: 5px;
  margin-bottom: 10px;
}
.ace-editor {
  flex: 1;
}
</style>