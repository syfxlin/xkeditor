<template>
  <div>
    <label>单元格数</label>
    <div class="xk-row">
      <div class="xk-input xk-col-12">
        <input
          v-model="data.row"
          type="number"
          placeholder="请输入行数"
          autofocus
        />
      </div>
      <div class="xk-input xk-col-12">
        <input v-model="data.column" type="number" placeholder="请输入列数" />
      </div>
    </div>
    <label>对齐方式</label>
    <div>
      <div class="xk-radio-group">
        <div class="xk-radio">
          <input
            type="radio"
            value="normal"
            v-model="data.type"
            id="xk-type-normal"
          />
          <label for="xk-type-normal">
            <div class="advice"></div>
            <fa-icon icon="align-justify" />
          </label>
        </div>
        <div class="xk-radio">
          <input
            type="radio"
            value="left"
            v-model="data.type"
            id="xk-type-left"
          />
          <label for="xk-type-left">
            <div class="advice"></div>
            <fa-icon icon="align-left" />
          </label>
        </div>
        <div class="xk-radio">
          <input
            type="radio"
            value="center"
            v-model="data.type"
            id="xk-type-center"
          />
          <label for="xk-type-center">
            <div class="advice"></div>
            <fa-icon icon="align-center" />
          </label>
        </div>
        <div class="xk-radio">
          <input
            type="radio"
            value="right"
            v-model="data.type"
            id="xk-type-right"
          />
          <label for="xk-type-right">
            <div class="advice"></div>
            <fa-icon icon="align-right" />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);
export default {
  name: "table-item",
  components: {
    "fa-icon": FontAwesomeIcon
  },
  props: ["data"]
};
</script>
