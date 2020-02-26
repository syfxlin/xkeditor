import store from "../store";

export default {
  title: "开启/关闭打字机模式",
  operate: "typewriter",
  icon: "i-cursor",
  hander() {
    store.actions.execCommand("typewriter");
    store.state.aceEditor.focus();
  }
};
