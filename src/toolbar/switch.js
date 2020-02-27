import store from "../store";

export default {
  toHtmlEditor: {
    title: "转换为HTML编辑",
    operate: "toHtmlEditor",
    icon: "file-code",
    handler() {
      store.actions.execCommand("toHtmlEditor");
    }
  },
  toTinyMCE: {
    title: "转换为TinyMCE编辑器",
    operate: "toTinyMCE",
    icon: "sync-alt",
    handler() {
      store.actions.execCommand("toTinyMCE");
    }
  }
};
