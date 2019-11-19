<template>
  <div>
    <label>图片链接</label>
    <div class="xk-input">
      <input v-model="data.src" placeholder="请输入图片链接" autofocus />
    </div>
    <label>图片描述</label>
    <div class="xk-input">
      <input v-model="data.art" placeholder="请输入图片描述" />
    </div>
    <template v-if="openImgUpload">
      <div class="xk-input xk-col-12">
        <input id="img-upload" type="file" />
      </div>
      <div class="xk-input xk-col-12 img-upload-sub">
        <button class="xk-button" @click="imgUpload()">上传</button>
      </div>
    </template>
  </div>
</template>

<script>
import store, { mapState } from "../../store";
export default {
  name: "image-item",
  data() {
    return {
      data: store.state.aceToolbarModal.data,
      openImgUpload: store.state.setting.xkSetting.imgUpload ? true : false,
      ...mapState({
        data: state => state.aceToolbarModal.data,
        openImgUpload: state =>
          state.setting.xkSetting.imgUpload ? true : false
      })
    };
  },
  methods: {
    imgUpload() {
      store.actions.imgUpload();
    }
  }
};
</script>
