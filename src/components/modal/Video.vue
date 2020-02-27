<template>
  <div>
    <label>视频链接</label>
    <div class="xk-input">
      <input
        v-model="data.src"
        type="url"
        placeholder="请输入视频链接"
        autofocus
      />
    </div>
    <div class="xk-input">
      <input v-model="data.alt" type="text" placeholder="请输入视频描述" />
    </div>
  </div>
</template>

<script>
export default {
  name: "video-item",
  props: ["data"]
};
</script>
