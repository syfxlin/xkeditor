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
        <button
          class="xk-button"
          type="text"
          :key="num.id"
          :title="'标题' + num"
          @click="toolbarClick('h' + num)"
          :id="'toolbar-h' + num"
        >
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
            :id="'toolbar-' + item.operate"
          >
            <fa-icon :icon="item.icon" />
          </button>
        </template>
      </template>
    </div>
    <div class="ace-toolbar-html ace-toolbar" v-show="!aceToolbarShow&&aceToolbarHtmlShow">
      <button
        class="xk-button"
        type="text"
        title="转换为Markdown模式"
        @click="function(){aceToolbarShow = true;switchEditorMode()}"
      >
        <fa-icon icon="file-code" />转换为Markdown模式
      </button>
    </div>
    <div class="ace-editor" ref="ace"></div>
    <toolbar-modal></toolbar-modal>
  </div>
</template>

<script>
// import ace from "ace-builds"
// import "ace-builds/webpack-resolver" // 在 webpack 环境中使用必须要导入
// import "ace-builds/src-noconflict/theme-solarized_light" // 默认设置的主题
// import "ace-builds/src-noconflict/mode-markdown"
// import "ace-builds/src-noconflict/snippets/markdown"
// import "ace-builds/src-noconflict/mode-html"
// import "ace-builds/src-noconflict/snippets/html"
// import "ace-builds/src-noconflict/ext-language_tools"

//fa icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);
import ToolBarModal from "./ToolbarModal";

import iAceToolbarButtons from "../utils/aceToolbarButtons";
import store, { mapState, mapActions } from "../store";

export default {
  components: {
    "fa-icon": FontAwesomeIcon,
    "toolbar-modal": ToolBarModal
  },
  data() {
    return {
      aceToolbarButtons: iAceToolbarButtons
    };
  },
  computed: {
    ...mapState([
      "aceToolbarModal",
      "aceEditor",
      "aceToolbarShow",
      "aceToolbarHtmlShow",
      "typewriterMode",
      "markdownContent",
      "setting"
    ])
  },
  mounted() {
    //初始化Value
    this.initAceEditor(
      this.markdownContent,
      this.setting.aceSetting,
      this.$refs.ace
    );
    if (window.isMobile) {
      this.execCommand("switchPreview");
    }
    this.initKey();
    this.aceEditor.getSession().on("change", () => {
      this.markdownContent = this.aceEditor.getValue();
    });
  },
  methods: {
    ...mapActions([
      "initAceEditor",
      "execCommand",
      "switchEditorMode",
      "setAceValue",
      "toolbarClick",
      "operateAceContent"
    ]),
    initKey() {
      var _this = this;
      var keys = [
        {
          name: "toHtmlEditor",
          win: "F1",
          mac: "F1",
          exec: function() {
            _this.toolbarClick("toHtmlEditor");
          }
        },
        {
          name: "toTinyMCE",
          win: "F2",
          mac: "F2",
          exec: function() {
            _this.toolbarClick("toTinyMCE");
          }
        },
        {
          name: "toc",
          win: "F7",
          mac: "F7",
          exec: function() {
            _this.toolbarClick("toc");
          }
        },
        {
          name: "typewriter",
          win: "F8",
          mac: "F8",
          exec: function() {
            _this.toolbarClick("typewriter");
          }
        },
        {
          name: "switchPreview",
          win: "F9",
          mac: "F9",
          exec: function() {
            _this.toolbarClick("switchPreview");
          }
        },
        {
          name: "fullPreview",
          win: "F10",
          mac: "F10",
          exec: function() {
            _this.toolbarClick("fullPreview");
          }
        },
        {
          name: "fullScreen",
          win: "F11",
          mac: "F11",
          exec: function() {
            _this.toolbarClick("fullScreen");
          }
        },
        {
          name: "H1",
          win: "Ctrl-1",
          mac: "Command-1",
          exec: function() {
            _this.toolbarClick("h1");
          }
        },
        {
          name: "H2",
          win: "Ctrl-2",
          mac: "Command-2",
          exec: function() {
            _this.toolbarClick("h2");
          }
        },
        {
          name: "H3",
          win: "Ctrl-3",
          mac: "Command-3",
          exec: function() {
            _this.toolbarClick("h3");
          }
        },
        {
          name: "H4",
          win: "Ctrl-4",
          mac: "Command-4",
          exec: function() {
            _this.toolbarClick("h4");
          }
        },
        {
          name: "H5",
          win: "Ctrl-5",
          mac: "Command-5",
          exec: function() {
            _this.toolbarClick("h5");
          }
        },
        {
          name: "H6",
          win: "Ctrl-6",
          mac: "Command-6",
          exec: function() {
            _this.toolbarClick("h6");
          }
        },
        {
          name: "bold",
          win: "Ctrl-B",
          mac: "Command-B",
          exec: function() {
            _this.toolbarClick("bold");
          }
        },
        {
          name: "time",
          win: "Ctrl-D",
          mac: "Command-D",
          exec: function() {
            _this.toolbarClick("time");
          }
        },
        {
          name: "minus",
          win: "Ctrl-H",
          mac: "Command-H",
          exec: function() {
            _this.toolbarClick("minus");
          }
        },
        {
          name: "italic",
          win: "Ctrl-I",
          mac: "Command-I",
          exec: function() {
            _this.toolbarClick("italic");
          }
        },
        {
          name: "mark",
          win: "Ctrl-K",
          mac: "Command-K",
          exec: function() {
            _this.toolbarClick("mark");
          }
        },
        {
          name: "link",
          win: "Ctrl-L",
          mac: "Command-L",
          exec: function() {
            _this.toolbarClick("link");
          }
        },
        {
          name: "ul",
          win: "Ctrl-U",
          mac: "Command-U",
          exec: function() {
            _this.toolbarClick("ul");
          }
        },
        {
          name: "image",
          win: "Ctrl-Shift-I",
          mac: "Command-Shift-I",
          exec: function() {
            _this.toolbarClick("image");
          }
        },
        {
          name: "tex-$",
          win: "Ctrl-Shift-K",
          mac: "Command-Shift-K",
          exec: function() {
            _this.toolbarClick("tex-$");
          }
        },
        {
          name: "ol",
          win: "Ctrl-Shift-O",
          mac: "Command-Shift-O",
          exec: function() {
            _this.toolbarClick("ol");
          }
        },
        {
          name: "code",
          win: "Ctrl-Shift-P",
          mac: "Command-Shift-P",
          exec: function() {
            _this.toolbarClick("code");
          }
        },
        {
          name: "quote",
          win: "Ctrl-Shift-Q",
          mac: "Command-Shift-Q",
          exec: function() {
            _this.toolbarClick("quote");
          }
        },
        {
          name: "strikethrough",
          win: "Ctrl-Shift-S",
          mac: "Command-Shift-S",
          exec: function() {
            _this.toolbarClick("strikethrough");
          }
        },
        {
          name: "table",
          win: "Ctrl-Shift-T",
          mac: "Command-Shift-T",
          exec: function() {
            _this.toolbarClick("table");
          }
        },
        {
          name: "help",
          win: "Ctrl-Shift-H",
          mac: "Command-Shift-H",
          exec: function() {
            _this.toolbarClick("help");
          }
        },
        {
          name: "toLine",
          win: "Ctrl-Shift-G",
          mac: "Command-Shift-G",
          exec: function() {
            _this.toolbarClick("toLine");
          }
        },
        {
          name: "format",
          win: "Ctrl-Shift-F",
          mac: "Command-Shift-F",
          exec: function() {
            _this.execCommand("format");
          }
        }
      ];
      this.execCommand("addKeys", keys);
    },
    imgUpload() {
      if (document.getElementById("img-upload").files.length > 0) {
        let file = document.getElementById("img-upload").files[0];
        window.XKEditorAPI.imgUpload(
          file,
          function(response) {
            window.eThis.a.$set(
              window.eThis.a.aceToolbarModal.data,
              "src",
              response.data.path
            );
            //TODO: 上传成功提示
          },
          function(error) {
            //TODO: 上传失败提示
            console.log(error);
          }
        );
      } else {
        //TODO: 未选择文件提示
        console.log("error");
      }
    }
  }
};
</script>

<style scoped>
th {
  text-align: left;
}
.help {
  overflow-y: auto;
  height: 50vh;
}
.info {
  overflow-y: auto;
}
.info p {
  font-size: 0.9em;
}
.info * {
  margin: 5px;
}
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
  border: 1px solid #c5d9e8;
  border-radius: 4px;
  background-color: #fff;
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
  color: #6190e8;
  color: #3f536e;
  border: none;
  font-size: 1em;
  padding: 0.2em 0.4em;
  margin: 0.2em;
}

.ace-toolbar .xk-button:hover {
  color: #fff;
  background: #6190e8a0;
}

.ace-toolbar .xk-button.active {
  color: #fff;
  background: #6190e8;
}
</style>
