<template>
  <div>
    <label>链接</label>
    <div class="xk-input">
      <input
        v-model="data.href"
        type="url"
        placeholder="请输入链接"
        autofocus
      />
    </div>
    <label>标题</label>
    <div class="xk-input">
      <input v-model="data.title" type="text" placeholder="请输入标题" />
    </div>
  </div>
</template>

<script>
export default {
  name: "link-item",
  props: ["data"]
};
</script>
