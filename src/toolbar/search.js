import store from "../store";

export default {
  title: "搜索",
  operate: "search",
  icon: "search",
  handler() {
    store.state.aceEditor.commands.commands.find.exec(store.state.aceEditor);
  }
};
