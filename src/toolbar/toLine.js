import store from "../store";

export default {
  title: "跳转到指定行",
  operate: "toLine",
  icon: "level-down-alt",
  data: {
    allLine: 10,
    line: 0
  },
  handler() {
    this.data.allLine = store.state.aceEditor.session.getLength();
    this.data.line = store.state.aceEditor.getCursorPosition().row + 1;
    store.state.toolbarModal = this;
  },
  submit() {
    store.state.toolbarModal = {};
    store.state.aceEditor.gotoLine(this.data.line);
    store.state.aceEditor.focus();
  },
  cancel() {
    store.state.toolbarModal = {};
  }
};
