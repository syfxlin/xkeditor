import store from "../store";

export default {
  title: "显示/隐藏目录",
  operate: "toc",
  icon: "bars",
  active: store.state.showToc,
  handler() {
    store.actions.execCommand("toc");
  },
  watcher() {
    this.active = store.state.showToc;
  }
};
