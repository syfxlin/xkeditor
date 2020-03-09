import store from "../store";

export default {
  title: "开启/关闭打字机模式",
  operate: "typewriter",
  icon: "i-cursor",
  active: false,
  handler() {
    store.actions.execCommand("typewriter");
    store.state.aceEditor.focus();
  },
  watcher: {
    obj: "typewriterMode",
    handler() {
      this.active = store.state.typewriterMode;
    },
    deep: true
  }
};
