<template>
  <div>
    <label>保存的标记(Filename)</label>
    <div class="xk-input">
      <input
        v-model="data.locationStorage"
        type="text"
        placeholder="请输入保存的标记"
        autofocus
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "localstorage-item",
  props: ["data"]
};
</script>
