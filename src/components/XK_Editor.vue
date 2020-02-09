<template>
  <div class="xkeditor">
    <template v-if="isRenderEditor">
      <div class="row">
        <div
          :class="
            'xkeditor-left ' +
              (previewShow === 'show' ? 'xk-col-12' : 'xk-col-24')
          "
          v-show="editorModeShow && previewShow !== 'full'"
        >
          <ace ref="ace"></ace>
        </div>
        <div
          id="resizor"
          title="拖动我"
          v-show="editorModeShow && previewShow === 'show'"
        ></div>
        <div
          :class="
            'xkeditor-right ' +
              (previewShow === 'show' ? 'xk-col-12' : 'xk-col-24')
          "
          v-show="editorModeShow && previewShow !== 'hide'"
        >
          <div
            :class="setting.xkSetting.previewClass"
            v-html="htmlViewContent"
            id="previewHtml"
            ref="htmlView"
          ></div>
        </div>
        <div
          class="xk-col-24"
          v-show="!editorModeShow"
          v-if="setting.xkSetting.enableTinyMCE"
        >
          <tinymce ref="tinymce"></tinymce>
        </div>
        <button
          class="xk-button close-preview-full"
          @click="switchPreviewFull()"
          v-show="editorModeShow && previewShow === 'full'"
        >
          关闭
        </button>
        <transition name="slide-fade">
          <div id="toc" v-show="showToc"></div>
        </transition>
        <div id="toc-button" class="xk-button">
          <fa-icon icon="bars" />
        </div>
      </div>
    </template>
    <graff-board></graff-board>
    <div
      :class="'xkeditor-toast ' + (toast.status !== '' ? toast.status : '')"
      v-show="toast.show"
    >
      <i v-show="toast.loading"></i>
      <p>{{ toast.message }}</p>
    </div>
  </div>
</template>

<script>
//导入基础组件
import "../utils/dialogDrag";
import Ace from "./ACE_Editor";
import TinyMCE from "./TinyMCE_Editor";
import GraffBoard from "./GraffBoard";

import axios from "axios";
//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from "../utils/switchContent";
import Prism from "prismjs";

import katex from "katex";
import renderMathInElement from "katex/dist/contrib/auto-render";
import mermaid from "mermaid";

//fa icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

import { mapState, mapActions } from "../store";

export default {
  name: "XK_Editor",
  components: {
    ace: Ace,
    tinymce: TinyMCE,
    "fa-icon": FontAwesomeIcon,
    "graff-board": GraffBoard
  },
  props: {
    settingApi: String,
    contentApi: String,
    settingProps: Object,
    contentProps: String
  },
  data() {
    return {
      isRenderEditor: false,
      delayToHtml: null
    };
  },
  computed: {
    editorModeShow() {
      if (this.editorMode === "ace") {
        return true;
      } else if (this.editorMode === "tinymce") {
        return false;
      }
      return null;
    },
    ...mapState([
      "showToc",
      "previewShow",
      "editorMode",
      "markdownContent",
      "htmlContent",
      "htmlViewContent",
      "setting",
      "toast"
    ])
  },
  async mounted() {
    await this.load();
    this.htmlViewContent = toHtml(this.markdownContent, true);
    this.$nextTick(function() {
      this.initEditor();
    });
    this.setInterface().then(() => {
      this.$emit("loadHook", "interfaceLoad");
    });
    this.$emit("loadHook", "componentLoad");
  },
  methods: {
    ...mapActions([
      "switchPreviewFull",
      "initGraff",
      "setInterface",
      "initScroll",
      "initPaste",
      "updateTocTree",
      "initTocTree",
      "initResizor",
      "updateRunCode"
    ]),
    async load() {
      let md = null;
      let setting = null;
      if (!this.contentProps) {
        md = (await axios.get(this.contentApi)).data;
      } else {
        md = this.contentProps;
      }
      if (!this.settingProps) {
        setting = (await axios.get(this.settingApi)).data;
      } else {
        setting = this.settingProps;
      }
      this.markdownContent = md;
      this.setting = setting;
      this.loadCss(setting.xkSetting.previewCss);
      this.isRenderEditor = true;
    },
    loadCss(url) {
      let css = document.createElement("link");
      css.href = url;
      css.rel = "stylesheet";
      css.type = "text/css";
      document.head.appendChild(css);
    },
    initEditor() {
      mermaid.initialize({ startOnLoad: true });
      //初始化scroll操作
      this.initScroll();
      //初始化TOC
      this.initTocTree();
      this.$nextTick(function() {
        //注册粘贴操作
        this.initPaste();
        // 注册涂鸦板
        this.initGraff();
        this.initResizor();
      });
    },
    renderNextTick() {
      this.$nextTick(function() {
        //制作TOC
        var tocHtml = getTocHtml();
        document.getElementById("toc").innerHTML = tocHtml;
        //制作文章内TOC
        for (
          let i = 0;
          i < document.getElementsByClassName("toc").length;
          i++
        ) {
          document.getElementsByClassName("toc")[i].innerHTML = tocHtml;
        }
        //更新TOC icon
        this.updateTocTree();
        //转换Tex公式
        renderMathInElement(document.getElementById("previewHtml"), {
          delimiters: [
            { left: "$$", right: "$$" },
            { left: "```math", right: "```" },
            { left: "```tex", right: "```" }
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        });
        //转换Mermaid图
        try {
          mermaid.init({ noteMargin: 10 }, ".xkeditor-mermaid");
        } catch (error) {
          console.log("May have errors");
        }
        //更新滚动绑定
        if (window.scrollBind) {
          window.scrollBind();
        }
        this.updateRunCode();
      });
    }
  },
  watch: {
    markdownContent(val) {
      //最少延迟250ms转换为html以保证性能，否则会造成输入卡顿
      var delay =
        this.setting.xkSetting.delayToHtml >= 500
          ? this.setting.xkSetting.delayToHtml
          : 500;
      if (this.delayToHtml) {
        clearTimeout(this.delayToHtml);
      }
      this.delayToHtml = setTimeout(() => {
        this.htmlViewContent = toHtml(val, true);
        this.renderNextTick();
      }, delay);
    },
    htmlContent(val) {
      this.htmlViewContent = val;
      this.renderNextTick();
      this.$nextTick(() => {
        Prism.highlightAll();
      });
    }
  }
};
</script>

<style lang="scss">
.xkeditor {
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;

  .row {
    height: 100%;
    transform: translate(0, 0);

    .xk-col-12 {
      height: 100%;
    }
  }
}

#previewHtml {
  overflow: auto;
  max-height: 100%;
  padding: 15px 15px;
  word-break: break-word;
  white-space: normal;
  box-sizing: border-box;
}

.xk-col-24 #previewHtml {
  float: left;
  width: 80%;
}

.toc,
#toc {
  word-break: break-word;
  white-space: normal;
  overflow-y: auto;
  height: 100%;

  ul {
    margin: 0px;
    padding-left: 20px;
  }

  li {
    list-style: none;
    padding-left: 5px;

    i {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 5px;
      margin-top: 2px;

      background-image: url("/static/svg/disc.svg");
      background-size: cover;
      background-position: center;

      &.can-active {
        background-image: url("/static/svg/minus-square.svg");

        + a + ul {
          display: block;
        }
      }

      &.active {
        background-image: url("/static/svg/plus-square.svg");

        + a + ul {
          display: none;
        }
      }

      @at-root {
        .toc,
        #toc {
          &.default-fold i {
            &.can-active {
              background-image: url("/static/svg/plus-square.svg");

              + a + ul {
                display: none;
              }
            }

            &.active {
              background-image: url("/static/svg/minus-square.svg");

              + a + ul {
                display: block;
              }
            }
          }
        }
      }
    }
  }

  a {
    color: #0366d6;
    text-decoration: none;
    font-size: 1.05em;
  }
}
.row {
  margin: 0px;

  .xk-col-12 {
    float: left;
    border-left: 1px solid #ddd;
    box-sizing: border-box;
  }
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
  right: 20px;
  top: 20px;
  z-index: 1000;
}

#toc {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 20%;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  z-index: 999;
  padding: 20px;
  box-sizing: border-box;
}

#toc-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 20px;
  height: 20px;
  padding: 6px;
  z-index: 1000;
  box-sizing: content-box;
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

#resizor {
  position: absolute;
  bottom: 50%;
  left: 50%;
  cursor: w-resize;
  background-color: #666;
  border-radius: 5px;
  margin-top: -10px;
  width: 6px;
  height: 30px;
  background-size: cover;
  background-position: center;
  z-index: 99999;
}

.xkeditor-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #03b8cf;
  color: #fff;
  border-radius: 20px;

  &.error {
    background-color: #ea644a;
  }

  &.success {
    background-color: #38b03f;
  }

  p {
    padding: 10px 15px;
    display: inline-block;
  }

  i {
    width: 0.8rem;
    height: 0.8rem;
    display: inline-block;
    padding: 0 0 0 15px;

    &:after {
      animation: loading 0.5s infinite linear;
      border: 0.1rem solid #fff;
      border-radius: 50%;
      border-right-color: transparent;
      border-top-color: transparent;
      content: "";
      display: block;
      height: 0.8rem;
      left: 50%;
      margin-left: -0.4rem;
      margin-top: -0.4rem;
      position: relative;
      top: 50%;
      width: 0.8rem;
      z-index: 1;
    }
  }
}

.run-code-output,
.run-code-input {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  font-family: courier;

  code,
  textarea {
    width: 100%;
    height: 100px;
    margin: 0 0.8rem;
    white-space: pre;
    vertical-align: middle;
    word-break: break-word;
    overflow-y: auto;
    background-color: #fff !important;
    margin: 0;
    border: 0.05rem solid #bcc3ce;
    box-shadow: 2px 2px 5px -2px rgba(0, 0, 0, 0.1);
    padding: 0.5rem 0.7rem !important;
  }

  textarea {
    height: 3rem;
    display: none;
  }

  code {
    &:empty {
      display: none;
      margin: 0;
    }

    span {
      &.process {
        color: #3280fc;
      }

      &.success {
        color: #32b643;
      }

      &.error {
        color: #ea644a;
      }

      &.o1 {
        color: #f1a325;
      }
    }
  }
}

.run-code-btn,
.reset-code-btn,
.input-code-btn {
  display: inline-block;
  background-color: #fff;
  color: #333;
  padding: 0.5rem;
  border: 2px solid #333;
  width: 4rem;
  font-size: 0.8rem;
  line-height: 1;
  cursor: pointer;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  transition: all 0.5s;

  &:hover {
    background-color: #333;
    color: #fff;
  }
}

.notebox {
  margin: 15px 0;
  padding: 1em;

  p {
    margin: 0px !important;
  }
}

@media (max-width: 991px) {
  .xk-col-24 #previewHtml {
    float: left;
    width: 100%;
  }
  #toc {
    width: 80%;
  }
  #resizor {
    display: none;
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
