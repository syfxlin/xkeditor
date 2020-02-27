<template>
  <div class="toolbar-container">
    <div class="xk-toolbar" v-show="toolbarShow">
      <template v-for="item in toolbar">
        <span v-if="item.icon === '|'" :key="item.id">|</span>
        <template v-else>
          <button
            :class="`xk-button ${item.active ? 'active' : ''}`"
            :key="item.id"
            type="text"
            :title="item.title"
            @click="item.handler()"
            :id="'toolbar-' + item.operate"
          >
            <b v-if="typeof item.icon === 'number'">H{{ item.icon }}</b>
            <fa-icon v-else :icon="item.icon" />
          </button>
        </template>
      </template>
    </div>
    <div
      class="toolbar-html xk-toolbar"
      v-show="!toolbarShow && toolbarHtmlShow"
    >
      <button
        class="xk-button"
        type="text"
        title="转换为Markdown模式"
        @click="switchToHtml()"
      >
        <fa-icon icon="file-code" />转换为Markdown模式
      </button>
    </div>
  </div>
</template>

<script>
import * as tb from "../toolbar";
import { mapActions, mapState } from "../store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  components: {
    "fa-icon": FontAwesomeIcon
  },
  data() {
    return {
      // toolbar: tb.toolbar
    };
  },
  computed: {
    ...mapState([
      "toolbarShow",
      "toolbarHtmlShow",
      "setting",
      "previewShow",
      "showToc",
      "typewriterMode"
    ]),
    toolbar() {
      return tb.toolbar;
    }
  },
  methods: {
    ...mapActions(["switchEditorMode"]),
    switchToHtml() {
      this.toolbarShow = true;
      this.switchEditorMode();
    }
  },
  watch: {
    "setting.xkSetting.pasteFormat": {
      handler() {
        tb.watcher.forEach(fn => fn());
      },
      deep: true
    },
    previewShow: {
      handler() {
        tb.watcher.forEach(fn => fn());
      },
      deep: true
    },
    showToc: {
      handler() {
        tb.watcher.forEach(fn => fn());
      },
      deep: true
    },
    typewriterMode: {
      handler() {
        tb.watcher.forEach(fn => fn());
      },
      deep: true
    }
  }
};
</script>
