import store from "../store";

export default {
  title: "时间",
  operate: "time",
  icon: "clock",
  handler() {
    store.actions.insertTextToAce(
      {
        left: new Date().toLocaleString(),
        right: ""
      },
      false
    );
  }
};
