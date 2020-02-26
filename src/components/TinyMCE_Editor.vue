<template>
  <div class="tinymce">
    <textarea v-model="htmlContent" id="tinymce-textarea"></textarea>
  </div>
</template>

<script>
import { mapState, mapActions } from "../store";
import tinyMCE from "tinymce/tinymce";
export default {
  computed: {
    ...mapState(["htmlContent"])
  },
  methods: {
    ...mapActions(["mergeTinyMCEOptions"])
  },
  mounted() {
    tinyMCE.init(this.mergeTinyMCEOptions());
  }
};
</script>
