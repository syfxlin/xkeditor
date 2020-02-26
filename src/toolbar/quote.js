import store from "../store";

export default {
  title: "引用",
  operate: "quote",
  icon: "quote-left",
  hander() {
    store.actions.insertTextToAce(
      {
        replace: "> "
      },
      true
    );
  }
};
