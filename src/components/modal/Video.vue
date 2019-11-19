<template>
  <div>
    <label>视频链接</label>
    <div class="xk-input">
      <input v-model="data.src" placeholder="请输入视频链接" autofocus />
    </div>
    <div class="xk-row">
      <div class="xk-input xk-col-12">
        <input v-model="data.width" placeholder="请输入宽" />
      </div>
      <div class="xk-input xk-col-12">
        <input v-model="data.height" placeholder="请输入高" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "video-item",
  props: ["data"]
};
</script>
