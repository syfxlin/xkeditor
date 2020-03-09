import store from "../store";

export default {
  title: "显示/隐藏目录",
  operate: "toc",
  icon: "bars",
  active: false,
  handler() {
    store.actions.execCommand("toc");
  },
  watcher: {
    obj: "showToc",
    handler() {
      this.active = store.state.showToc;
    },
    deep: true
  }
};
