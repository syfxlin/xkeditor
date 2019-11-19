<template>
  <div class="ace-toolbar-modal" v-show="modal.show" v-dialogDrag>
    <div class="xk-modal-wrapper">
      <div class="xk-modal">
        <div class="xk-modal-header">
          <div class="xk-modal-title">
            <p>{{ modal.data.modalTitle }}</p>
          </div>
        </div>
        <div class="xk-modal-body">
          <link-item v-if="modal.content==='link'"></link-item>
          <image-item v-if="modal.content==='image'"></image-item>
          <video-item v-if="modal.content==='video'"></video-item>
          <toline-item v-if="modal.content==='toLine'"></toline-item>
          <localstorage-item v-if="modal.content==='localStorage'"></localstorage-item>
          <table-item v-if="modal.content==='table'"></table-item>
          <help-item v-if="modal.content==='help'"></help-item>
          <info-item v-if="modal.content==='info'"></info-item>
          <graff-item v-if="modal.content==='graff'"></graff-item>
        </div>
        <div class="xk-clear"></div>
        <div class="xk-modal-footer">
          <button class="xk-button" @click="cancel()">取消</button>
          <button class="xk-button xk-button-primary" @click="submit()">确定</button>
        </div>
        <span class="xk-modal-close" @click="cancel()">
          <fa-icon icon="times" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import GraffItem from "./modal/Graff";
import HelpItem from "./modal/Help";
import ImageItem from "./modal/Image";
import InfoItem from "./modal/Info";
import LinkItem from "./modal/Link";
import LocalStorageItem from "./modal/LocalStorage";
import TableItem from "./modal/Table";
import ToLineItem from "./modal/ToLine";
import VideoItem from "./modal/Video";

import store, { mapState } from "../store";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  name: "toolbar-modal",
  components: {
    "graff-item": GraffItem,
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
  data() {
    return {
      // modal: store.state.aceToolbarModal,
      ...mapState({
        modal: state => state.aceToolbarModal
      })
    };
  },
  methods: {
    cancel() {
      store.actions.aceToolbarCancer();
    },
    submit() {
      store.actions.aceToolbarSubmit();
    }
  }
};
</script>

<style>
.xk-input {
  position: relative;
  font-size: 0.85em;
  line-height: 1.5;
  outline: 0;
}
.xk-input input {
  display: block;
  width: 100%;
  padding: 6px 32px 6px 12px;
  color: #3f536e;
  font-size: 12px;
  background-color: #fff;
  border: 1px solid #c5d9e8;
  border-radius: 4px;
  -webkit-transition: border 0.2s;
  transition: border 0.2s;
  outline: none;
  box-sizing: border-box;
}
.xk-input input:hover {
  border-color: #79a1eb;
}
.xk-input i {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0 6px 0 0;
  width: 20px;
  height: 100%;
  color: #c5d9e8;
  font-size: 15px;
  text-align: center;
}
.xk-radio {
  display: inline-block;
  padding: 2px 5px;
}
.xk-radio input {
  display: none;
}
.xk-radio input + label {
  font-size: 1.1em;
}
.xk-radio input + label svg {
  vertical-align: middle;
}
.xk-radio input[type="radio"] + label .advice {
  width: 1.1em;
  height: 1.1em;
  border: 1px solid #c5d9e8;
  border-radius: 50%;
  background-color: #fff;
  -webkit-transition: border 0.2s;
  transition: border 0.2s;
  display: inline-block;
  vertical-align: middle;
  margin: 5px;
}
.xk-radio input[type="radio"]:checked + label .advice {
  background: #79a1eb;
}
.xk-modal-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  outline: 0;
  z-index: 1000;
}
.xk-modal {
  position: relative;
  top: 100px;
  width: 520px;
  margin: 0 auto 0 10%;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  outline: none;
  box-shadow: 0 1px 20px -6px rgba(0, 0, 0, 0.2);
}
.xk-modal-header {
  padding: 12px 16px;
  color: #2c405a;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
  border-bottom: 1px solid #ececec;
}
.xk-modal-header p,
.xk-modal-header .xk-modal-title {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  vertical-align: middle;
}
.xk-modal-body {
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
}
.xk-modal-footer {
  padding: 12px 16px;
  border-top: 1px solid #ececec;
  text-align: right;
}
.xk-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 13px;
  line-height: 1;
  overflow: hidden;
  cursor: pointer;
}
.xk-row {
  display: block;
  width: 100%;
}
.xk-col-12 {
  width: 50%;
  float: left;
}
.xk-clear {
  clear: both;
}
.img-upload-sub {
  padding-left: 10px;
}
@media (max-width: 991px) {
  .xk-modal {
    width: 80%;
  }
}
</style>
