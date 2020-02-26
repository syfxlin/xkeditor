import store from "../store";

export default {
  title: "下标",
  operate: "sub",
  icon: "subscript",
  hander() {
    store.actions.insertTextToAce(
      {
        left: "<sub>",
        right: "</sub>"
      },
      false,
      6
    );
  }
};
