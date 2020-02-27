import store from "../store";

export default {
  title: "标记",
  operate: "mark",
  icon: "code",
  handler() {
    store.actions.insertTextToAce(
      {
        left: "`",
        right: "`"
      },
      false,
      1
    );
  }
};
