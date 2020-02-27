import store from "../store";

export default {
  title: "上标",
  operate: "sup",
  icon: "superscript",
  handler() {
    store.actions.insertTextToAce(
      {
        left: "<sup>",
        right: "</sup>"
      },
      false,
      6
    );
  }
};
