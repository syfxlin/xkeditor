import store from "../store";

export default {
  title: "显示/隐藏目录",
  operate: "toc",
  icon: "bars",
  hander() {
    store.actions.execCommand("toc");
  }
};
