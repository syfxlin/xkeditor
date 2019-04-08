<template>
  <div class="ace-container">
    <div class="ace-toolbar" v-show="aceToolbarShow">
      <template v-for="num in 6">
        <at-button type="text" :key="num.id" :title="'标题' + num" @click="toolbar_click('h' + num)">
          <b>H{{ num }}</b>
        </at-button>
      </template>
      <template v-for="item in button_list">
        <template v-if="item.icon === '|'">
          <span :key="item.id">|</span>
        </template>
        <template v-else>
          <at-button
            :key="item.id"
            type="text"
            :title="item.info"
            @click="toolbar_click(item.icon)"
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

    <at-modal v-model="isShowModal" @on-confirm="aceToolbarSubmit" class="ace-toolbar-modal" title=" " v-dialogDrag>
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
        <label>行号(1-{{ allLine }})</label>
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

import marked from "marked";
import turndown from "turndown";
var turndownGfm = require("turndown-plugin-gfm");

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
      isShowModal: false,
      allLine: 1,
      aceToolbarShow: true,
      aceToolbarModal: {
        data: {},
        link: false,
        image: false,
        video: false,
        toLine: false,
        search: false
      },
      button_list: [
        {
          info: "",
          icon: "|"
        },
        {
          info: "粗体",
          icon: "bold"
        },
        {
          info: "斜体",
          icon: "italic"
        },
        {
          info: "下划线",
          icon: "underline"
        },
        {
          info: "删除线",
          icon: "strikethrough"
        },
        {
          info: "引用",
          icon: "quote-left"
        },
        {
          info: "标记块",
          icon: "code"
        },
        {
          info: "代码块",
          icon: "terminal"
        },
        {
          info: "",
          icon: "|"
        },
        {
          info: "无序列表",
          icon: "list-ul"
        },
        {
          info: "有序列表",
          icon: "list-ol"
        },
        {
          info: "分割线",
          icon: "minus"
        },
        {
          info: "表格",
          icon: "table"
        },
        {
          info: "时间",
          icon: "clock"
        },
        {
          info: "",
          icon: "|"
        },
        {
          info: "链接",
          icon: "link"
        },
        {
          info: "图片",
          icon: "image"
        },
        {
          info: "媒体",
          icon: "video"
        },
        {
          info: "",
          icon: "|"
        },
        {
          info: "跳转到指定行",
          icon: "level-down-alt"
        },
        {
          info: "搜索",
          icon: "search"
        },
        {
          info: "关闭实时预览",
          icon: "eye-slash"
        },
        {
          info: "全窗口预览",
          icon: "tv"
        },
        {
          info: "全屏",
          icon: "arrows-alt"
        },
        {
          info: "转换为HTML编辑",
          icon: "file-code"
        },
        {
          info: "清空",
          icon: "eraser"
        },
        {
          info: "设置",
          icon: "cog"
        },
        {
          info: "",
          icon: "|"
        },
        {
          info: "帮助",
          icon: "question-circle"
        },
        {
          info: "关于",
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

        var markedRenderer = new marked.Renderer()
        markedRenderer.paragraph = function(text) {
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
        });
        this.aceEditor.session.setMode("ace/mode/html");
        this.aceEditor.setValue(marked(this.aceEditor.getSession().getValue()));
        this.isMarkdownMode = false;
      }
    },
    switch_md: function() {
      if (!this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/markdown");
        var turndownService = new turndown({
          headingStyle: "atx",
          hr: "---",
          bulletListMarker: "-",
          codeBlockStyle: "fenced",
          emDelimiter: "*"
        });
        turndownService.keep([
          "iframe",
          "style",
          "script",
          "title",
          "span",
          "font"
        ]);
        turndownService.use(turndownGfm.gfm);
        this.aceEditor.setValue(
          turndownService.turndown(this.aceEditor.getSession().getValue())
        );
        this.isMarkdownMode = true;
      }
    },
    toolbar_click: function(operate) {
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
        str =
          '<span style="text-decoration: underline;">' + selectText + "</span>";
        toLeft = 7;
      } else if (operate === "strikethrough") {
        str = "~" + selectText + "~";
        toLeft = 1;
      } else if (operate === "quote-left") {
        str = "> ";
        isStart = true;
      } else if (operate === "code") {
        str = "`" + selectText + "`";
        toLeft = 1;
      } else if (operate === "terminal") {
        str = "```\n```";
        toLeft = 4;
      } else if (operate === "list-ul") {
        str = "- ";
        isStart = true;
      } else if (operate === "list-ol") {
        str = "1. ";
        isStart = true;
      } else if (operate === "minus") {
        str = "\n---\n\n";
        isStart = true;
      } else if (operate === "table") {
        this.aceToolbarModal.table = true;
        this.isShowModal = true;
        return;
      } else if (operate === "clock") {
        str = new Date().toLocaleString();
      } else if (operate === "link") {
        this.aceToolbarModal.link = true;
        this.isShowModal = true;
        return;
      } else if (operate === "image") {
        this.aceToolbarModal.image = true;
        this.isShowModal = true;
        return;
      } else if (operate === "video") {
        this.aceToolbarModal.video = true;
        this.isShowModal = true;
        return;
      } else if (operate === "level-down-alt") {
        this.aceToolbarModal.toLine = true;
        this.allLine = this.aceEditor.session.getLength();
        this.isShowModal = true;
        return;
      } else if (operate === "search") {
        this.aceEditor.commands.commands.find.exec(this.aceEditor);
      } else if (operate === "file-code") {
        this.switch_html();
        this.aceToolbarShow = false;
        return;
      } else if (operate === "eraser") {
        this.aceEditor.setValue("");
        return;
      } else if (operate === "cog") {
        this.aceEditor.commands.commands.showSettingsMenu.exec(this.aceEditor);
      }
      this.operateAceContent(isStart, toLeft, str)
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
        let type = data.src.match(/\w+\.(\w+)$/)
        str = '<video controls="controls" width="' + data.width + '" height="' + data.height + '"><source src="' + data.src + '" type="video/' + type[1] + '" /></video>'
      } else if(data.operate === 'level-down-alt') {
        this.aceEditor.gotoLine(data.line)
        this.aceEditor.focus()
        return;
      }
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