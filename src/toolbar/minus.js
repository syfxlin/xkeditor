import store from "../store";

export default {
  title: "分割线",
  operate: "minus",
  icon: "minus",
  hander() {
    store.actions.insertTextToAce(
      {
        replace: "\n---\n\n"
      },
      true
    );
  }
};
