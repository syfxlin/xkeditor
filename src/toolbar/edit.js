import store from "../store";

export default {
  format: {
    title: "格式化(美化)",
    operate: "format",
    icon: "atom",
    handler() {
      store.actions.execCommand("format");
    }
  },
  pasteFormat: {
    title: "粘贴转化",
    operate: "pasteFormat",
    icon: "paste",
    active: true,
    handler() {
      store.actions.execCommand("pasteFormat");
    },
    watcher: {
      obj: "setting.xkSetting.pasteFormat",
      handler() {
        this.active = store.state.setting.xkSetting.pasteFormat;
      },
      deep: true
    }
  },
  empty: {
    title: "清空",
    operate: "empty",
    icon: "eraser",
    handler() {
      store.actions.execCommand("empty");
    }
  },
  undo: {
    title: "撤销",
    operate: "undo",
    icon: "undo",
    handler() {
      store.actions.execCommand("undo");
    }
  },
  redo: {
    title: "重做",
    operate: "redo",
    icon: "redo",
    handler() {
      store.actions.execCommand("redo");
    }
  }
};
