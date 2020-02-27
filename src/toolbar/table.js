import store from "../store";

export default {
  title: "表格",
  operate: "table",
  icon: "table",
  data: {
    row: 2,
    column: 2,
    type: "normal"
  },
  handler() {
    store.state.toolbarModal = this;
  },
  submit() {
    this.data.row = parseInt(this.data.row);
    this.data.column = parseInt(this.data.column);
    let str = "";
    for (let i = 0; i < this.data.row + 1; i++) {
      if (i == 1) {
        str +=
          (
            "|" +
            (this.data.type === "left" || this.data.type === "center"
              ? ":"
              : "-") +
            "--------" +
            (this.data.type === "right" || this.data.type === "center"
              ? ":"
              : "-")
          ).repeat(this.data.column) + "|\n";
      } else {
        str += "|  ".repeat(this.data.column) + "|\n";
      }
    }
    store.actions.insertTextToAce(
      {
        replace: str
      },
      true
    );
    store.state.toolbarModal = {};
  },
  cancel() {
    store.state.toolbarModal = {};
  }
};
