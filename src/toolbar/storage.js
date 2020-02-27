import store from "../store";

export default {
  setLocalStorage: {
    title: "保存到本地",
    operate: "setLocalStorage",
    icon: "box",
    data: {
      locationStorage: ""
    },
    handler() {
      store.state.toolbarModal = this;
    },
    submit() {
      window.XKEditor.setLocalStorage(this.data.locationStorage);
      store.state.toolbarModal = {};
    },
    cancel() {
      store.state.toolbarModal = {};
    }
  },
  getLocalStorage: {
    title: "从本地读取",
    operate: "getLocalStorage",
    icon: "box-open",
    data: {
      locationStorage: ""
    },
    handler() {
      store.state.toolbarModal = this;
    },
    submit() {
      actions.setAceValue(
        window.XKEditor.getLocalStorage(this.data.locationStorage)
      );
      store.state.toolbarModal = {};
    },
    cancel() {
      store.state.toolbarModal = {};
    }
  },
  removeLocalStorage: {
    title: "删除本地存储",
    operate: "removeLocalStorage",
    icon: "trash-alt",
    data: {
      locationStorage: ""
    },
    handler() {
      store.state.toolbarModal = this;
    },
    submit() {
      window.XKEditor.removeLocalStorage(this.data.locationStorage);
      store.state.toolbarModal = {};
    },
    cancel() {
      store.state.toolbarModal = {};
    }
  }
};
