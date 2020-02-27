import store from "../store";

export default {
  title: "图片",
  operate: "image",
  icon: "image",
  data: {
    src: "",
    alt: ""
  },
  handler() {
    store.state.toolbarModal = this;
  },
  submit() {
    store.actions.insertTextToAce(
      {
        left: `![${this.data.alt}](${this.data.src})`,
        right: ""
      },
      false
    );
    store.state.toolbarModal = {};
  },
  cancel() {
    store.state.toolbarModal = {};
  }
};
