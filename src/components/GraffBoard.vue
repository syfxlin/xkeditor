<template>
  <div class="graff-main">
    <div class="graff-container">
      <div class="svg-container">
        <svg id="graff-svg" v-html="graffEditContent" />
      </div>
      <div class="svg-button">
        <h3>画笔</h3>
        <div class="svg-pen">
          <div class="svg-btn fa fa-pencil-alt" data-type="pen">
            <span>画笔</span>
          </div>
          <div class="svg-btn fa fa-eraser" data-type="eraser">
            <span>橡皮擦</span>
          </div>
          <div class="svg-btn fa fa-font" data-type="text">
            <span>文本</span>
          </div>
          <div class="svg-btn fa fa-pencil-alt" data-type="select">
            <span>选择</span>
          </div>
        </div>
        <h3>画笔颜色</h3>
        <div class="svg-color">
          <select id="select-color">
            <option value="black">黑色</option>
            <option value="lightcoral">红色</option>
            <option value="lightblue" selected>蓝色</option>
            <option value="lightgreen">绿色</option>
            <option value="lightyellow">黄色</option>
            <option value="lightsalmon">橙色</option>
            <option value="lightgray">灰色</option>
            <option value="lightpink">粉色</option>
            <option value="plum">紫色</option>
            <option value="custom">自定义</option>
          </select>
          <input type="color" id="custom-color" />
        </div>
        <h3>画笔大小</h3>
        <div class="svg-size">
          <select id="select-size">
            <option value="small">小</option>
            <option value="middle">中</option>
            <option value="big">大</option>
            <option value="custom">自定义</option>
          </select>
          <input type="number" id="custom-size" value="2" />
        </div>
        <h3>填充颜色</h3>
        <div class="svg-fill-color">
          <select id="select-fill-color">
            <option value="none">不填充</option>
            <option value="black">黑色</option>
            <option value="lightcoral">红色</option>
            <option value="lightblue">蓝色</option>
            <option value="lightgreen">绿色</option>
            <option value="lightyellow">黄色</option>
            <option value="lightsalmon">橙色</option>
            <option value="lightgray">灰色</option>
            <option value="lightpink">粉色</option>
            <option value="plum">紫色</option>
            <option value="custom">自定义</option>
          </select>
          <input type="color" id="custom-fill-color" />
        </div>
        <h3>文字大小</h3>
        <div class="svg-text-size">
          <input type="number" id="text-size" value="14" />
        </div>
        <h3>形状</h3>
        <div class="svg-shape">
          <div class="svg-btn fa fa-slash" data-type="line">
            <span>直线</span>
          </div>
          <div class="svg-btn fa fa-draw-polygon" data-type="polygon">
            <span>多边形</span>
          </div>
          <div class="svg-btn fa fa-square-full" data-type="rect">
            <span>矩形</span>
          </div>
          <div class="svg-btn fa fa-square" data-type="round-rect">
            <span>圆角矩形</span>
          </div>
          <div class="svg-btn fa fa-circle" data-type="circle">
            <span>圆形</span>
          </div>
          <div class="svg-btn fa fa-circle" data-type="ellipse">
            <span>椭圆</span>
          </div>
          <div class="svg-btn fa fa-layer-group" data-type="diamond">
            <span>菱形</span>
          </div>
        </div>
        <h3>操作</h3>
        <div class="svg-operate">
          <div class="svg-btn fa fa-reply" id="svg-undo">
            <span>撤销</span>
          </div>
          <div class="svg-btn fa fa-share" id="svg-redo">
            <span>重做</span>
          </div>
          <div class="svg-btn fa fa-trash" id="svg-clean">
            <span>清空画板</span>
          </div>
        </div>
        <h3>生成图像</h3>
        <div class="svg-output">
          <div class="svg-btn" @click="save()">保存</div>
          <div class="svg-btn" @click="cancel()">关闭</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/paint.css";
import { mapState } from "../store";
import initPaint from "../utils/paint";
export default {
  name: "graff-board",
  computed: {
    ...mapState([
      "htmlViewContent",
      "timeToast",
      "showGraff",
      "graffContent",
      "graffHash"
    ]),
    graffEditContent: {
      get() {
        if (this.graffContent[this.graffHash]) {
          return this.graffContent[this.graffHash].substring(
            this.graffContent[this.graffHash].indexOf("|") + 1
          );
        } else {
          return "";
        }
      }
    }
  },
  mounted() {
    initPaint("graff-svg");
  },
  methods: {
    save() {
      if (document.querySelector("#graff-svg #selects")) {
        document.querySelector("#graff-svg #selects").remove();
      }
      let size = document.querySelector("#graff-svg").getBBox();
      let viewBox = `${size.x - 10} ${size.y - 10} ${size.width +
        20} ${size.height + 20}`;
      let content = document.querySelector("#graff-svg").innerHTML;
      let ele = document.querySelector(
        `.graffiti[data-hash="${this.graffHash}"]`
      );
      ele.innerHTML = content;
      ele.setAttribute("viewBox", viewBox);
      content = `${viewBox}|` + content;
      this.graffContent[this.graffHash] = content;
      this.showGraff = false;
    },
    cancel() {
      this.showGraff = false;
    }
  }
};
</script>

<style lang="scss"></style>
