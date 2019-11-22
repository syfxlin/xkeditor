<template>
  <div class="canvas-main">
    <div class="canvas-container">
      <canvas id="canvas" width="800" height="500"></canvas>
      <div id="auxiliary-ele"></div>
    </div>
    <div class="canvas-button">
      <h3>画笔</h3>
      <ul class="can-pen">
        <li class="can-btn fa fa-pencil-alt" data-type="pen">
          <span>画笔</span>
        </li>
        <li class="can-btn fa fa-eraser" data-type="eraser">
          <span>橡皮擦</span>
        </li>
        <li class="can-btn fa fa-font" data-type="text">
          <span>文本</span>
        </li>
      </ul>
      <h3>画笔颜色</h3>
      <ul class="can-color">
        <li class="can-btn black" data-type="color"></li>
        <li class="can-btn red" data-type="color"></li>
        <li class="can-btn blue" data-type="color"></li>
        <li class="can-btn green" data-type="color"></li>
        <li class="can-btn yellow" data-type="color"></li>
        <li class="can-btn orange" data-type="color"></li>
        <li class="can-btn gray" data-type="color"></li>
        <li class="can-btn pink" data-type="color"></li>
        <li class="can-btn purple" data-type="color"></li>
      </ul>
      <h3>画笔大小</h3>
      <ul class="can-size">
        <li class="can-btn fa fa-paint-brush small" data-type="size"></li>
        <li class="can-btn fa fa-paint-brush middle" data-type="size"></li>
        <li class="can-btn fa fa-paint-brush big" data-type="size"></li>
      </ul>
      <h3>形状</h3>
      <ul class="can-shape">
        <li class="can-btn fa fa-slash" data-type="line">
          <span>直线</span>
        </li>
        <li class="can-btn fa fa-draw-polygon" data-type="polyline">
          <span>多边形</span>
        </li>
        <li class="can-btn fa fa-square-full" data-type="rect">
          <span>矩形</span>
        </li>
        <li class="can-btn fa fa-square" data-type="round-rect">
          <span>圆角矩形</span>
        </li>
        <li class="can-btn fa fa-circle" data-type="ellipse">
          <span>圆形</span>
        </li>
        <li class="can-btn fa fa-layer-group" data-type="diamond">
          <span>菱形</span>
        </li>
      </ul>
      <h3>操作</h3>
      <ul class="can-operate">
        <li class="can-btn fa fa-reply" data-type="to-prev-canvas">
          <span>撤销</span>
        </li>
        <li class="can-btn fa fa-share" data-type="to-next-canvas">
          <span>重做</span>
        </li>
        <li class="can-btn fa fa-trash" data-type="clean-canvas">
          <span>清空画板</span>
        </li>
      </ul>
      <h3>保存/取消</h3>
      <ul class="can-output">
        <li
          class="can-btn"
          data-type="save-canvas"
          id="save-canvas"
          @click="save()"
        >
          保存
        </li>
        <li
          class="can-btn"
          data-type="cancel-canvas"
          id="cancel-canvas"
          @click="cancel()"
        >
          取消
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import "../assets/paint.css";
import { mapState } from "../store";
export default {
  name: "graff-board",
  computed: {
    ...mapState(["htmlViewContent", "timeToast"])
  },
  methods: {
    save() {
      document.getElementById("canvas").toBlob(blob => {
        let file = new window.File(
          [blob],
          document.getElementById("canvas").getAttribute("data-filename"),
          { type: blob.type }
        );
        window.XKEditorAPI.graffUpload(
          file,
          response => {
            if (response.data.error) {
              this.timeToast("错误：" + response.data.error, "error");
            }
            document.getElementsByClassName("canvas-main")[0].style.display =
              "none";
            this.htmlViewContent += " ";
          },
          error => {
            console.log(error);
          }
        );
      });
    },
    cancel() {
      document.getElementsByClassName("canvas-main")[0].style.display = "none";
    }
  }
};
</script>

<style></style>
