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
      <template v-for="item in aceToolbarButtons">
        <span v-if="item.icon === '|'" :key="item.id">|</span>
        <template v-else>
          <button
            class="xk-button"
            :key="item.id"
            type="text"
            :title="item.title"
            @click="toolbarClick(item.operate)"
            :id="'toolbar-' + item.operate"
          >
            <b v-if="typeof item.icon==='number'">H{{ item.icon }}</b>
            <fa-icon v-else :icon="item.icon" />
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

import aceAllButtons from "../utils/aceAllButtons";
import store, { mapState, mapActions } from "../store";

export default {
  components: {
    "fa-icon": FontAwesomeIcon,
    "toolbar-modal": ToolBarModal
  },
  computed: {
    ...mapState([
      "aceEditor",
      "aceToolbarShow",
      "aceToolbarHtmlShow",
      "markdownContent",
      "setting"
    ]),
    aceToolbarButtons() {
      const buttons = [];
      const selectButtons = this.setting.aceSetting.toolbar.split(" ");
      for (const operate of selectButtons) {
        buttons.push(aceAllButtons.find(item => item.operate === operate));
      }
      return buttons;
    }
  },
  mounted() {
    //初始化Value
    this.initAceEditor(
      this.markdownContent,
      this.setting.aceSetting,
      this.$refs.ace
    );
    this.aceEditor.getSession().on("change", () => {
      this.markdownContent = this.aceEditor.getValue();
    });
  },
  methods: {
    ...mapActions(["initAceEditor", "switchEditorMode", "toolbarClick"])
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
