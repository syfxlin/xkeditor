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
    <div class="ace-editor" ref="ace"></div>
    <button v-on:click="change">switch</button>
    <button v-on:click="switch_html">switch-html</button>
    <button v-on:click="switch_md">switch-md</button>

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

import { toHtml, toMarkdown } from './switchContent.js'

export default {
  components: {
    "fa-icon": FontAwesomeIcon
  },
  props: {
    value: String
  },
  mounted() {
    (this.aceEditor = ace.edit(this.$refs.ace, {
      maxLines: 20, // 最大行数，超过会自动出现滚动条
      minLines: 10, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
      fontSize: 14, // 编辑器内字体大小
      theme: "ace/theme/solarized_light", // 默认设置的主题
      mode: "ace/mode/markdown", // 默认设置的语言模式
      tabSize: 4, // 制表符设置为 4 个空格大小
      value: this.value ? this.value : "",
      fontSize: "17px",
      wrap: true
    })),
    this.aceEditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    });
    // this.aceEditor.getSession().on('change', this.change)
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
          modalTitle: '',
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
          title: "关闭实时预览",
          operate: "closePreview",
          icon: "eye-slash"
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
  watch: {
    value: function(val) {
      this.aceEditor.setValue(this.value);
    }
  },
  methods: {
    change: function() {
      this.$emit("input", this.aceEditor.getSession().getValue() + " ");
    },
    switch_html: function() {
      if (this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/html");
        this.aceEditor.setValue(toHtml(this.aceEditor.getSession().getValue()))
        this.isMarkdownMode = false;
      }
    },
    switch_md: function() {
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
      } else if (operate === "toHtmlEditor") {
        this.switch_html();
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
      this.modalTitle = title
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
</style>