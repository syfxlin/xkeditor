import store from "../store";

export default {
  switchPreview: {
    title: "切换实时预览",
    operate: "switchPreview",
    icon: "eye",
    hander() {
      store.actions.execCommand("switchPreview");
    }
  },
  fullPreview: {
    title: "全窗口预览",
    operate: "fullPreview",
    icon: "tv",
    hander() {
      store.actions.execCommand("fullPreview");
    }
  },
  fullScreen: {
    title: "全屏",
    operate: "fullScreen",
    icon: "arrows-alt",
    hander() {
      store.actions.execCommand("fullScreen");
    }
  }
};
