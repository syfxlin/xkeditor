import store from "../store";

export default {
  title: "上标",
  operate: "sup",
  icon: "superscript",
  hander() {
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
