import store from "../store";

export default {
  title: "涂鸦",
  operate: "graff",
  icon: "palette",
  handler() {
    store.actions.insertTextToAce(
      {
        replace: `[graff]{${Math.random()
          .toString(36)
          .slice(6)}}`
      },
      true
    );
  }
};
