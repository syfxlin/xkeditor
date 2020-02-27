import store from "../store";

export default {
  title: "斜体",
  operate: "italic",
  icon: "italic",
  handler() {
    store.actions.insertTextToAce(
      {
        left: "*",
        right: "*"
      },
      false,
      1
    );
  }
};
