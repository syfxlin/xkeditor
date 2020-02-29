<template>
  <div id="app">
    <xk-editor :config="config" v-model="content" :data.sync="data" />
  </div>
</template>

<script>
import XK_Editor from "./index.js";
import axios from "axios";
export default {
  name: "App",
  components: {
    "xk-editor": XK_Editor
  },
  data() {
    return {
      config: {},
      content: "",
      data: {
        graff: {
          "6b3117":
            '8.399999618530273 9 423.9984436035156 154|<path d="M 290.4,100 L 293.4,104 L 304.4,112 L 326.4,123 L 345.4,131 L 360.4,136 L 378.4,140 L 395.4,145 L 405.4,148 L 415.4,152 L 420.4,152 L 421.4,153 L 422.4,153" fill="none" stroke="#6190e8" stroke-width="2"></path><rect x="18.4" y="19" fill="none" stroke="#6190e8" stroke-width="2" width="131" height="69" d="M 18.4 19 h 131 v 69 h -131 Z"></rect>'
        }
      }
    };
  },
  methods: {},
  async mounted() {
    await axios
      .all([
        axios.get("/static/setting.json"),
        axios.get("/static/md_content.md")
      ])
      .then(
        axios.spread((res1, res2) => {
          this.config = res1.data;
          this.content = res2.data;
        })
      );
  }
};
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: #3f536e;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1",
    Arial, sans-serif;
  font-size: 14px;
  margin: 0;
}

p {
  margin: 0;
}

/* 滚动槽 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.06);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

#app {
  width: 100%;
  height: 100%;
}
</style>
