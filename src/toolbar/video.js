import store from "../store";

export default {
  title: "媒体",
  operate: "video",
  icon: "video",
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
        left: `![vid ${this.data.alt}](${this.data.src})`,
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
