<template>
  <div class="tools-container">
    <button
      class="xk-button close-preview-full"
      @click="switchPreviewFull()"
      v-show="editorMode === 'ace' && previewShow === 'full'"
    >
      关闭
    </button>
    <transition name="slide-fade">
      <div id="toc" v-show="showToc"></div>
    </transition>
    <div id="toc-button" class="xk-button">
      <fa-icon icon="bars" />
    </div>
    <toolbar-modal></toolbar-modal>
    <graff-board v-if="graffBoard.hash"></graff-board>
    <div
      :class="'xkeditor-toast ' + (toast.status !== '' ? toast.status : '')"
      v-show="toast.message"
    >
      <i v-show="toast.loading"></i>
      <p>{{ toast.message }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "../store";
import GraffBoard from "./GraffBoard";
import ToolBarModal from "./ToolbarModal";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  components: {
    "fa-icon": FontAwesomeIcon,
    "graff-board": GraffBoard,
    "toolbar-modal": ToolBarModal
  },
  computed: {
    ...mapState(["editorMode", "previewShow", "showToc", "toast", "graffBoard"])
  },
  methods: {
    ...mapActions(["switchPreviewFull"])
  }
};
</script>
