import store from "../store";

export default {
  flow: {
    title: "添加流程图",
    operate: "flow",
    icon: "ellipsis-h",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "```flow\n\n```"
        },
        true,
        4
      );
    }
  },
  seq: {
    title: "添加时序图",
    operate: "seq",
    icon: "circle",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "```seq\n\n```"
        },
        true,
        4
      );
    }
  },
  gantt: {
    title: "添加甘特图",
    operate: "gantt",
    icon: "square",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "```gantt\n\n```"
        },
        true,
        4
      );
    }
  },
  mermaid: {
    title: "添加图",
    operate: "mermaid",
    icon: "cubes",
    handler() {
      store.actions.insertTextToAce(
        {
          replace: "```mermaid\n\n```"
        },
        true,
        4
      );
    }
  }
};
