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
  },
  methods: {
    ...mapActions(["initAceEditor"])
  }
};
</script>
