<template>
<div>
  <ul>
  <template v-for="n in 24">
    <li style="display:inline-block;padding:5px;margin:5px;border:1px solid #000;" class="icon icon-bold"></li>
  </template>
  </ul>
  <div class="row">
    <at-textarea v-model="msg" placeholder="这里是输入框..." class="col-md-12"></at-textarea>
    <div class="col-md-12" v-html="this.$marked(msg)"></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '# Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
</style>
