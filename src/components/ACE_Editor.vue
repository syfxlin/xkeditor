<template>
  <div class="ace-container">
    <div class="ace-editor" ref="ace"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "../store";

export default {
  computed: {
    ...mapState(["aceEditor", "markdownContent", "setting"])
  },
  mounted() {
    //初始化Value
    this.initAceEditor(
      this.markdownContent,
      this.setting.aceSetting,
      this.$refs.ace
    );
    this.aceEditor.getSession().on("change", () => {
      this.markdownContent = this.aceEditor.getValue();
    });
  },
  methods: {
    ...mapActions(["initAceEditor"])
  }
};
</script>

<style lang="scss">
th {
  text-align: left;
}

.ace-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .bookmarklet {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    cursor: pointer;
    border-width: 9px;
    border-style: solid;
    border-color: lightblue gray gray rgb(206, 173, 230);
    border-image: initial;
  }
}

.ace-editor {
  flex: 1;
}
</style>
