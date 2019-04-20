<template>
  <div id="app">
    <editor v-if="isRenderEditor" :setting="editorSetting" :value="markdownContent" />
  </div>
</template>

<script>
import { axiosPro } from "./utils/axiosPro"
export default {
  name: 'App',
  data() {
    return {
      isRenderEditor: false,
      editorSetting: {},
      markdownContent: "# 123"
    }
  },
  methods: {
    async getEditorInfo() {
      let md = await axiosPro.get('/static/md_content.md')
      let setting = await axiosPro.get('/static/setting.json')
      this.markdownContent = md
      this.editorSetting = setting
      this.isRenderEditor = true
    }
  },
  mounted() {
    this.getEditorInfo()
  }
}
</script>

<style>
body {
  background-color: #FFF;
  color: #3F536E;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

html, body {
  width: 100%;
  height: 100%;
}
body {
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
    background: rgba(0,0,0,0.06);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
#app {
  width: 100%;
  height: 100%;
}
</style>
