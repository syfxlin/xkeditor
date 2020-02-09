<template>
  <div id="app">
    <xk-editor :settingApi="setting" :contentApi="content" />
  </div>
</template>

<script>
import XK_Editor from "./index.js";
export default {
  name: "App",
  components: {
    "xk-editor": XK_Editor
  },
  data() {
    return {
      setting: "/static/setting.json",
      content: "/static/md_content.md"
    };
  },
  methods: {},
  mounted() {}
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
  -webkit-font-smoothing: antialiased;
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
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}

#app {
  width: 100%;
  height: 100%;
}
</style>
