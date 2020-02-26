import store from "../store";

export default {
  title: "删除线",
  operate: "strikethrough",
  icon: "strikethrough",
  hander() {
    store.actions.insertTextToAce(
      {
        left: "~",
        right: "~"
      },
      false,
      1
    );
  }
};
