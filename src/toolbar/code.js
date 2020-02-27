import store from "../store";

export default {
  title: "代码块",
  operate: "code",
  icon: "terminal",
  handler() {
    store.actions.insertTextToAce(
      {
        replace: "```\n```"
      },
      true,
      4
    );
  }
};
