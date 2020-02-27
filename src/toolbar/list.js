import store from "../store";

export default {
  ul: {
    title: "无序列表",
    operate: "ul",
    icon: "list-ul",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "- "
        },
        true
      );
    }
  },
  ol: {
    title: "有序列表",
    operate: "ol",
    icon: "list-ol",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "1. "
        },
        true
      );
    }
  }
};
