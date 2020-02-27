import store from "../store";

export default {
  switchPreview: {
    title: "切换实时预览",
    operate: "switchPreview",
    icon: "eye",
    active: store.state.previewShow === "hide",
    handler() {
      store.actions.execCommand("switchPreview");
    },
    watcher() {
      this.active = store.state.previewShow === "hide";
      console.log(this.active);
    }
  },
  fullPreview: {
    title: "全窗口预览",
    operate: "fullPreview",
    icon: "tv",
    active: store.state.previewShow === "full",
    handler() {
      store.actions.execCommand("fullPreview");
    },
    watcher() {
      this.active = store.state.previewShow === "full";
    }
  },
  fullScreen: {
    title: "全屏",
    operate: "fullScreen",
    icon: "arrows-alt",
    handler() {
      store.actions.execCommand("fullScreen");
    }
  }
};
