<template>
  <div class="toolbar-container">
    <div class="xk-toolbar" v-show="toolbarShow">
      <template v-for="item in toolbar">
        <span v-if="item.icon === '|'" :key="item.id">|</span>
        <template v-else>
          <button
            class="xk-button"
            :key="item.id"
            type="text"
            :title="item.title"
            @click="item.hander()"
            :id="'toolbar-' + item.operate"
          >
            <b v-if="typeof item.icon === 'number'">H{{ item.icon }}</b>
            <fa-icon v-else :icon="item.icon" />
          </button>
        </template>
      </template>
    </div>
    <div class="toolbar-html xk-toolbar" v-show="!toolbarShow && toolbarHtmlShow">
      <button class="xk-button" type="text" title="转换为Markdown模式" @click="switchToHtml()">
        <fa-icon icon="file-code" />转换为Markdown模式
      </button>
    </div>
  </div>
</template>

<script>
import toolbarObj from "../toolbar";
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
      toolbar: toolbarObj
    };
  },
  computed: {
    ...mapState(["toolbarShow", "toolbarHtmlShow"])
  },
  methods: {
    ...mapActions(["switchEditorMode"]),
    switchToHtml() {
      this.toolbarShow = true;
      this.switchEditorMode();
    }
  }
};
</script>
