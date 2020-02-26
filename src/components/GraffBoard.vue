<template>
  <div class="graff-main">
    <div class="graff-container">
      <div class="svg-container">
        <svg id="graff-svg" v-html="graffEditContent" />
      </div>
      <div class="svg-button">
        <h3>画笔</h3>
        <div class="svg-pen">
          <div class="svg-btn" data-type="pen">
            <fa-icon icon="pencil-alt" />
            <span>画笔</span>
          </div>
          <div class="svg-btn" data-type="eraser">
            <fa-icon icon="eraser" />
            <span>橡皮擦</span>
          </div>
          <div class="svg-btn" data-type="text">
            <fa-icon icon="font" />
            <span>文本</span>
          </div>
          <div class="svg-btn" data-type="select">
            <fa-icon icon="pencil-alt" />
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
          <div class="svg-btn" data-type="line">
            <fa-icon icon="slash" />
            <span>直线</span>
          </div>
          <div class="svg-btn" data-type="polygon">
            <fa-icon icon="draw-polygon" />
            <span>多边形</span>
          </div>
          <div class="svg-btn" data-type="rect">
            <fa-icon icon="square-full" />
            <span>矩形</span>
          </div>
          <div class="svg-btn" data-type="round-rect">
            <fa-icon icon="square" />
            <span>圆角矩形</span>
          </div>
          <div class="svg-btn" data-type="circle">
            <fa-icon icon="circle" />
            <span>圆形</span>
          </div>
          <div class="svg-btn" data-type="ellipse">
            <fa-icon icon="circle" />
            <span>椭圆</span>
          </div>
          <div class="svg-btn" data-type="diamond">
            <fa-icon icon="layer-group" />
            <span>菱形</span>
          </div>
        </div>
        <h3>操作</h3>
        <div class="svg-operate">
          <div class="svg-btn" id="svg-undo">
            <fa-icon icon="reply" />
            <span>撤销</span>
          </div>
          <div class="svg-btn" id="svg-redo">
            <fa-icon icon="share" />
            <span>重做</span>
          </div>
          <div class="svg-btn" id="svg-clean">
            <fa-icon icon="trash" />
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

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

export default {
  name: "graff-board",
  components: {
    "fa-icon": FontAwesomeIcon
  },
  computed: {
    ...mapState(["htmlViewContent", "timeToast", "graffBoard"]),
    graffEditContent() {
      if (this.graffBoard.content[this.graffBoard.hash]) {
        return this.graffBoard.content[this.graffBoard.hash].substring(
          this.graffBoard.content[this.graffBoard.hash].indexOf("|") + 1
        );
      } else {
        return "";
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
        `.graffiti[data-hash="${this.graffBoard.hash}"]`
      );
      ele.innerHTML = content;
      ele.setAttribute("viewBox", viewBox);
      content = `${viewBox}|` + content;
      this.graffBoard.content[this.graffBoard.hash] = content;
      this.graffBoard.hash = false;
    },
    cancel() {
      this.graffBoard.hash = false;
    }
  }
};
</script>
