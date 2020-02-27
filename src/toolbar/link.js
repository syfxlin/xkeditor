import store from "../store";

export default {
  title: "链接",
  operate: "link",
  icon: "link",
  data: {
    href: "",
    title: ""
  },
  handler() {
    store.state.toolbarModal = this;
  },
  submit() {
    store.actions.insertTextToAce(
      {
        left: `[${this.data.title}](${this.data.href})`,
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
