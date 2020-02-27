<template>
  <div>
    <label>行号(1-{{ data.allLine }})</label>
    <div class="xk-input">
      <input
        v-model="data.line"
        type="number"
        placeholder="请输入行号"
        autofocus
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "toline-item",
  props: ["data"]
};
</script>
