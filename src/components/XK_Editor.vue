<template>
  <div class="xkeditor">
    <toolbar v-show="isAceMode && previewShow !== 'full'" />
    <div class="editor-container">
      <div
        :class="
          'xkeditor-left ' +
            (previewShow === 'show' ? 'xk-col-12' : 'xk-col-24')
        "
        v-show="isAceMode && previewShow !== 'full'"
      >
        <ace ref="ace"></ace>
      </div>
      <div id="resizor" title="拖动我" v-show="isAceMode && previewShow === 'show'"></div>
      <div
        :class="
          'xkeditor-right ' +
            (previewShow === 'show' ? 'xk-col-12' : 'xk-col-24')
        "
        v-show="isAceMode && previewShow !== 'hide'"
      >
        <div
          :class="setting.xkSetting.previewClass"
          v-html="htmlViewContent"
          id="previewHtml"
          ref="htmlView"
        ></div>
      </div>
      <div class="xk-col-24" v-show="!isAceMode" v-if="setting.xkSetting.enableTinyMCE">
        <tinymce ref="tinymce"></tinymce>
      </div>
    </div>
    <tools />
  </div>
</template>

<script>
//导入基础组件
import "../utils/dialogDrag";
import deepAssign from "../utils/deepAssign";
import Ace from "./ACE_Editor";
import TinyMCE from "./TinyMCE_Editor";
import ToolBar from "./Toolbar";
import Tools from "./Tools";

//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from "../utils/switchContent";
import renderMathInElement from "katex/dist/contrib/auto-render";
import mermaid from "mermaid";

import store, { mapState, mapActions } from "../store";

export default {
  name: "XK_Editor",
  components: {
    ace: Ace,
    tinymce: TinyMCE,
    toolbar: ToolBar,
    tools: Tools
  },
  props: {
    config: Object,
    value: String,
    data: Object
  },
  data() {
    return {
      delayToHtml: null
    };
  },
  computed: {
    ...mapState([
      "previewShow",
      "editorMode",
      "markdownContent",
      "htmlContent",
      "htmlViewContent",
      "setting",
      "graffBoard"
    ]),
    isAceMode() {
      if (this.editorMode === "ace") {
        return true;
      } else if (this.editorMode === "tinymce") {
        return false;
      }
      return null;
    }
  },
  created() {
    this.markdownContent = this.value || "";
    this.setting = deepAssign(this.setting, this.config);
    this.htmlViewContent = toHtml(this.markdownContent, true);
    this.graffBoard.content = this.data.graff || {};
    this.loadCss(this.setting.xkSetting.previewCss);
  },
  mounted() {
    this.$nextTick(function() {
      this.initEditor();
    });
    this.setInterface();
    this.$emit("loaded", true);
  },
  methods: {
    ...mapActions([
      "initGraff",
      "setInterface",
      "initScroll",
      "initPaste",
      "updateTocTree",
      "initTocTree",
      "initResizor",
      "updateRunCode",
      "setValue",
      "initTinyMceEditor"
    ]),
    loadCss(url) {
      let css = document.createElement("link");
      css.href = url;
      css.rel = "stylesheet";
      css.type = "text/css";
      document.head.appendChild(css);
    },
    initEditor() {
      //初始化scroll操作
      this.initScroll();
      //初始化TOC
      this.initTocTree();
      this.$nextTick(function() {
        //注册粘贴操作
        this.initPaste();
        // 注册涂鸦板
        this.initGraff();
        // 注册调整按钮
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
        if (store.actions.scrollBind) {
          store.actions.scrollBind();
        }
        this.updateRunCode();
      });
    }
  },
  watch: {
    value(val) {
      if (val !== this.markdownContent) {
        this.markdownContent = val;
        this.setValue(val);
      }
    },
    config: {
      handler(val) {
        this.setting = val;
        if (window.XKEditor) {
          window.XKEditor.tinymce.remove();
          this.initTinyMceEditor();
          window.XKEditor.ace.setOptions(val.aceSetting);
        }
      },
      deep: true
    },
    markdownContent(val) {
      this.$emit("input", val);
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
      this.$emit("input", toMarkdown(val));
    },
    data: {
      handler(val) {
        this.graffBoard.content = val.graff;
      },
      deep: true
    },
    "graffBoard.content": {
      handler(val) {
        this.$emit("update:data.graff", val);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss">
@import "../assets/style.scss";
</style>
