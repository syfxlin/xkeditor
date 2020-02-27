import store from "../store";

export default {
  title: "下划线",
  operate: "underline",
  icon: "underline",
  handler() {
    store.actions.insertTextToAce(
      {
        left: '<span style="text-decoration: underline">',
        right: "</span>"
      },
      false,
      7
    );
  }
};
