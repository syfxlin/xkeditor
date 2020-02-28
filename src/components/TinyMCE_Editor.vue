<template>
  <div class="tinymce">
    <textarea v-model="htmlContent" id="tinymce-textarea"></textarea>
  </div>
</template>

<script>
import { mapState, mapActions } from "../store";
export default {
  computed: {
    ...mapState(["htmlContent"])
  },
  methods: {
    ...mapActions(["initTinyMceEditor"])
  },
  mounted() {
    this.initTinyMceEditor();
  }
};
</script>
