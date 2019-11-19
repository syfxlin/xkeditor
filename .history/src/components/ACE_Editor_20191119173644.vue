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

//switch markdown and html
import { toHtml, toMarkdown } from "../utils/switchContent";
import iAceToolbarButtons from "../utils/aceToolbarButtons";
import store, { mapState, mapActions } from "../store";

export default {
  components: {
    "fa-icon": FontAwesomeIcon,
    "toolbar-modal": ToolBarModal
  },
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      isMarkdownMode: true,
      aceToolbarButtons: iAceToolbarButtons
    };
  },
  computed: {
    ...mapState([
      "aceToolbarModal",
      "aceEditor",
      "aceToolbarShow",
      "aceToolbarHtmlShow",
      "typewriterMode"
    ])
  },
  mounted() {
    //初始化Value
    this.initAceEditor(this.value, this.setting, this.$refs.ace);
    if (window.isMobile) {
      this.execCommand("switchPreview");
    }
    this.initKey();
    this.aceEditor.getSession().on("change", this.updateValue);
  },
  methods: {
    ...mapActions(["initAceEditor", "execCommand"]),
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
    setValue(val) {
      this.aceEditor.setValue(val);
      this.aceEditor.gotoLine(1);
    },
    updateValue() {
      this.$emit("input", this.aceEditor.getSession().getValue());
    },
    switchEditorMode() {
      if (this.isMarkdownMode) {
        this.switchToHtml();
      } else {
        this.switchToMarkdown();
      }
    },
    switchToHtml() {
      if (this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/html");
        this.aceEditor
          .getSession()
          .setValue(toHtml(this.aceEditor.getSession().getValue(), false));
        this.isMarkdownMode = false;
      }
    },
    switchToMarkdown() {
      if (!this.isMarkdownMode) {
        this.aceEditor.session.setMode("ace/mode/markdown");
        this.aceEditor
          .getSession()
          .setValue(toMarkdown(this.aceEditor.getSession().getValue(), true));
        this.isMarkdownMode = true;
      }
    },
    toolbarClick(operate) {
      if (
        /(toc|typewriter|switchPreview|fullPreview|fullScreen|pasteFormat)/.test(
          operate
        )
      ) {
        document
          .getElementById("toolbar-" + operate)
          .classList.toggle("active");
      }
      this.aceToolbarModal.data.operate = operate;
      let str = "";
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
          '<span style="text-decoration: underline">' + selectText + "</span>";
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
      } else if (operate === "sup") {
        str = "<sup>" + selectText + "</sup>";
        toLeft = 6;
      } else if (operate === "sub") {
        str = "<sub>" + selectText + "</sub>";
        toLeft = 6;
      } else if (operate === "tex-$") {
        str = "$$" + selectText + "$$";
        toLeft = 2;
      } else if (operate === "tex-math") {
        str = "```math\n\n```";
        toLeft = 4;
      } else if (operate === "flow") {
        str = "```flow\n```";
        toLeft = 4;
      } else if (operate === "seq") {
        str = "```seq\n\n```";
        toLeft = 4;
      } else if (operate === "gantt") {
        str = "```gantt\n\n```";
        toLeft = 4;
      } else if (operate === "mermaid") {
        str = "```mermaid\n\n```";
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
        this.operateModal(operate, true, "添加表格");
        return;
      } else if (operate === "time") {
        str = new Date().toLocaleString();
      } else if (operate === "link") {
        this.operateModal(operate, true, "添加链接");
        return;
      } else if (operate === "image") {
        this.operateModal(operate, true, "添加图片");
        return;
      } else if (operate === "video") {
        this.operateModal(operate, true, "添加视频");
        return;
      } else if (operate === "graff") {
        this.operateModal(operate, true, "上传涂鸦图");
        return;
      } else if (
        /(toLine|search|toc|switchPreview|fullPreview|fullScreen|toHtmlEditor|toTinyMCE|empty|setting|undo|redo|typewriter|format|pasteFormat)/g.test(
          operate
        )
      ) {
        this.execCommand(operate);
      } else if (operate === "setLocalStorage") {
        this.operateModal("localStorage", true, "保存到本地");
        return;
      } else if (operate === "getLocalStorage") {
        this.operateModal("localStorage", true, "从本地读取");
        return;
      } else if (operate === "removeLocalStorage") {
        this.operateModal("localStorage", true, "删除本地存储");
        return;
      } else if (operate === "help") {
        this.operateModal(operate, true, "帮助");
        return;
      } else if (operate === "info") {
        this.operateModal(operate, true, "关于");
        return;
      }
      // this.operateAceContent(isStart, toLeft, str);
    },
    operateModal(operate, isShow, title = "") {
      // if (!isShow) {
      //   this.aceToolbarModal[operate] = false;
      //   return;
      // }
      // this.aceToolbarModal[operate] = true;
      this.aceToolbarModal.content = operate;
      this.aceToolbarModal.data.modalTitle = title;
      this.aceToolbarModal.show = true;
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
      let str = "";
      let data = this.aceToolbarModal.data;
      if (data.operate === "table") {
        if (data.row > 1) {
          data.row = parseInt(data.row) + 1;
        }
        for (let i = 0; i < data.row; i++) {
          for (let j = 0; j < data.column; j++) {
            str += "| ";
            if (i == 1) {
              if (data.type === "left" || data.type === "center") {
                str += ":";
              }
              str += "----------";
              if (data.type === "right" || data.type === "center") {
                str += ":";
              }
            }
            str += " ";
          }
          str += "|\n";
        }
      } else if (data.operate === "link") {
        str = "[" + data.title + "](" + data.href + ")";
      } else if (data.operate === "image") {
        str = "![" + data.art + "](" + data.src + ")";
      } else if (data.operate === "video") {
        if (!/\w+\.(\w+)$/.test(data.src)) {
          //TODO: 移除AT-UI后的依赖
          this.$Message.error("地址输入有误！请重新输入(无法识别扩展名)");
          return;
        }
        let type = data.src.match(/\w+\.(\w+)$/);
        str =
          '<video controls="controls" width="' +
          data.width +
          '" height="' +
          data.height +
          '"><source src="' +
          data.src +
          '" type="video/' +
          type[1] +
          '" /></video>';
      } else if (data.operate === "graff") {
        str = "[graff]{" + data.hash + "}";
      } else if (data.operate === "toLine") {
        this.aceEditor.gotoLine(data.line);
        this.aceEditor.focus();
        this.operateModal(data.operate, false);
        this.aceToolbarCancer();
        return;
      } else if (data.operate === "setLocalStorage") {
        window.XKEditor.setLocalStorage(
          this.aceToolbarModal.data.locationStorage
        );
        this.aceToolbarCancer();
        return;
      } else if (data.operate === "getLocalStorage") {
        str = window.XKEditor.getLocalStorage(
          this.aceToolbarModal.data.locationStorage
        );
        this.setValue(str);
        this.aceToolbarCancer();
        return;
      } else if (data.operate === "removeLocalStorage") {
        window.XKEditor.removeLocalStorage(
          this.aceToolbarModal.data.locationStorage
        );
        this.aceToolbarCancer();
        return;
      }
      this.operateModal(data.operate, false);
      this.operateAceContent(false, 0, str);
      this.aceToolbarCancer();
    },
    operateFullScreen() {
      if (
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
      ) {
        if (document.exitFullscreen) {
          return document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          return document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          return document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          return document.msExitFullscreen();
        }
      } else {
        var root = document.documentElement;
        if (root.requestFullscreen) {
          return root.requestFullscreen();
        } else if (root.webkitRequestFullscreen) {
          return root.webkitRequestFullscreen();
        } else if (root.mozRequestFullScreen) {
          return root.mozRequestFullScreen();
        } else if (root.msRequestFullscreen) {
          return root.msRequestFullscreen();
        }
      }
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
    },
    graffUpload() {
      let hash = Math.random()
        .toString(36)
        .substring(2, 8);
      if (document.getElementById("graff-upload").files.length > 0) {
        let file = document.getElementById("graff-upload").files[0];
        window.XKEditorAPI.graffUpload(
          file,
          function(response) {
            window.eThis.a.$set(
              window.eThis.a.aceToolbarModal.data,
              "hash",
              hash
            );
            //TODO: 上传成功提示
          },
          function(error) {
            //TODO: 上传失败提示
            console.log(error);
          },
          "graff-" + hash + ".png"
        );
      } else {
        let canvas = document.getElementById("canvas");
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        canvas.toBlob(function(blob) {
          let file = new window.File([blob], "graff-" + hash + ".png", {
            type: blob.type
          });
          window.XKEditorAPI.graffUpload(
            file,
            function(response) {
              window.eThis.a.$set(
                window.eThis.a.aceToolbarModal.data,
                "hash",
                hash
              );
              //TODO: 上传成功提示
            },
            function(error) {
              //TODO: 上传失败提示
              console.log(error);
            }
          );
        });
      }
    }
    // execCommand(command, data = null) {
    //   if (command === "toLine") {
    //     this.aceToolbarModal.data.allLine = this.aceEditor.session.getLength();
    //     this.operateModal(command, true, "跳转到指定行");
    //     return;
    //   } else if (command === "search") {
    //     this.aceEditor.commands.commands.find.exec(this.aceEditor);
    //     return;
    //   } else if (command === "toc") {
    //     this.$parent.switchToc();
    //     return;
    //   } else if (command === "switchPreview") {
    //     this.$parent.switchPreviewShow();
    //     this.$nextTick(function() {
    //       this.aceEditor.resize(this.aceEditor);
    //     });
    //     return;
    //   } else if (command === "fullPreview") {
    //     this.$parent.switchPreviewFull();
    //     this.$nextTick(function() {
    //       this.aceEditor.resize(this.aceEditor);
    //     });
    //     return;
    //   } else if (command === "fullScreen") {
    //     this.operateFullScreen();
    //     return;
    //   } else if (command === "toHtmlEditor") {
    //     this.switchEditorMode();
    //     this.aceToolbarShow = false;
    //     return;
    //   } else if (command === "toTinyMCE") {
    //     window.XKEditor.switchEditor();
    //     return;
    //   } else if (command === "empty") {
    //     this.aceEditor.setValue("");
    //     return;
    //   } else if (command === "setting") {
    //     this.aceEditor.commands.commands.showSettingsMenu.exec(this.aceEditor);
    //     return;
    //   } else if (command === "undo") {
    //     this.aceEditor.undo();
    //     return;
    //   } else if (command === "redo") {
    //     this.aceEditor.redo();
    //     return;
    //   } else if (command === "toolbar") {
    //     this.aceToolbarShow = !this.aceToolbarShow;
    //     this.aceToolbarHtmlShow = !this.aceToolbarHtmlShow;
    //     return;
    //   } else if (command === "resize") {
    //     this.$nextTick(function() {
    //       this.aceEditor.resize(this.aceEditor);
    //     });
    //     return;
    //   } else if (command === "addKeys") {
    //     for (let i = 0; i < data.length; i++) {
    //       this.aceEditor.commands.addCommand({
    //         name: data[i].name,
    //         bindKey: { win: data[i].win, mac: data[i].mac },
    //         exec: data[i].exec,
    //         readOnly: true
    //       });
    //     }
    //   } else if (command === "removeKeys") {
    //     for (let i = 0; i < data.length; i++) {
    //       this.aceEditor.commands.removeCommand(data[i]);
    //     }
    //   } else if (command === "typewriter") {
    //     var isOne = true;
    //     var lastRow = window.XKEditor.ace.selection.getCursor().row;
    //     if (!window.$typewriter) {
    //       window.$typewriter = function() {
    //         if (
    //           event &&
    //           event.type &&
    //           !/(mousedown|mouseup|touchstart|touchend|touchmove)/g.test(
    //             event.type
    //           )
    //         ) {
    //           var nowRow = window.XKEditor.ace.selection.getCursor().row;
    //           let scroll = 0;
    //           if (isOne) {
    //             scroll =
    //               window.XKEditor.ace.session.getScrollTop() +
    //               (parseFloat(
    //                 document
    //                   .getElementsByClassName("ace_cursor")[0]
    //                   .style.top.replace("px", "")
    //               ) -
    //                 document.getElementsByClassName("ace-editor")[0]
    //                   .offsetHeight /
    //                   3);
    //             isOne = false;
    //           } else {
    //             let rows = nowRow - lastRow;
    //             if (rows === 0) {
    //               if (event.key === "ArrowDown") {
    //                 rows = 1;
    //               } else if (event.key === "ArrowUp") {
    //                 rows = -1;
    //               }
    //             }
    //             scroll =
    //               window.XKEditor.ace.session.getScrollTop() +
    //               rows * window.XKEditor.ace.renderer.lineHeight;
    //           }
    //           if (scroll != 0) {
    //             window.XKEditor.ace.session.setScrollTop(scroll);
    //           }
    //           lastRow = nowRow;
    //         }
    //       };
    //     }
    //     if (!this.typewriterMode) {
    //       this.aceEditor.selection.on("changeCursor", window.$typewriter);
    //     } else {
    //       this.aceEditor.selection.off("changeCursor", window.$typewriter);
    //     }
    //     this.typewriterMode = !this.typewriterMode;
    //     return;
    //   } else if (command === "format") {
    //     if (!prettier) return;
    //     let formated = prettier.format(this.value, {
    //       parser: "markdown",
    //       plugins: prettierPlugins
    //     });
    //     this.setValue(formated);
    //   } else if (command === "pasteFormat") {
    //     this.$parent.setting.xkSetting.pasteFormat = !this.$parent.setting
    //       .xkSetting.pasteFormat;
    //   }
    // }
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
