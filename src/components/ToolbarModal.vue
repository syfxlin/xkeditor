<template>
  <div class="ace-toolbar-modal" v-show="modal.operate" v-dialogDrag>
    <div class="xk-modal-wrapper">
      <div class="xk-modal">
        <div class="xk-modal-header">
          <div class="xk-modal-title">
            <p>{{ modal.title }}</p>
          </div>
        </div>
        <div class="xk-modal-body">
          <link-item
            v-if="modal.operate === 'link'"
            :data="modal.data"
          ></link-item>
          <image-item
            v-if="modal.operate === 'image'"
            :data="modal.data"
          ></image-item>
          <video-item
            v-if="modal.operate === 'video'"
            :data="modal.data"
          ></video-item>
          <toline-item
            v-if="modal.operate === 'toLine'"
            :data="modal.data"
          ></toline-item>
          <localstorage-item
            v-if="modal.operate === 'localStorage'"
            :data="modal.data"
          ></localstorage-item>
          <table-item
            v-if="modal.operate === 'table'"
            :data="modal.data"
          ></table-item>
          <help-item
            v-if="modal.operate === 'help'"
            :data="modal.data"
          ></help-item>
          <info-item
            v-if="modal.operate === 'info'"
            :data="modal.data"
          ></info-item>
        </div>
        <div class="xk-clear"></div>
        <div class="xk-modal-footer">
          <button class="xk-button" @click="modal.cancel()">取消</button>
          <button class="xk-button xk-button-primary" @click="modal.submit()">
            确定
          </button>
        </div>
        <span class="xk-modal-close" @click="modal.cancel()">
          <fa-icon icon="times" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import HelpItem from "./modal/Help";
import ImageItem from "./modal/Image";
import InfoItem from "./modal/Info";
import LinkItem from "./modal/Link";
import LocalStorageItem from "./modal/LocalStorage";
import TableItem from "./modal/Table";
import ToLineItem from "./modal/ToLine";
import VideoItem from "./modal/Video";

import { mapState } from "../store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  name: "toolbar-modal",
  components: {
    "help-item": HelpItem,
    "image-item": ImageItem,
    "info-item": InfoItem,
    "link-item": LinkItem,
    "localstorage-item": LocalStorageItem,
    "table-item": TableItem,
    "toline-item": ToLineItem,
    "video-item": VideoItem,
    "fa-icon": FontAwesomeIcon
  },
  computed: {
    ...mapState({
      modal: "toolbarModal"
    })
  }
};
</script>
