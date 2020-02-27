import store from "../store";

const heading = {};

for (let i = 1; i <= 6; i++) {
  heading[`h${i}`] = {
    title: `标题${i}`,
    operate: `h${i}`,
    icon: i,
    handler() {
      store.actions.insertTextToAce(
        {
          replace: `${"#".repeat(i)} `
        },
        true
      );
    }
  };
}

export default heading;
