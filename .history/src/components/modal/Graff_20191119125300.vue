<template>
  <div>
    <label>若涂鸦板要使用基础图像，请上传图片，若不使用请直接点击上传。</label>
    <div class="xk-input xk-col-12">
      <input id="graff-upload" type="file" accept="image/png" />
    </div>
    <div class="xk-input xk-col-12 graff-upload-sub">
      <button class="xk-button" @click="graffUpload()">上传</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "../../store";
export default {
  name: "graff-item",
  methods: {
    ...mapActions(["graffUpload"])
  }
};
</script>
