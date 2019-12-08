<!--
  /**
  * TinuMCE编辑器
  * @module /components
  * @desc 对TinyMCE编辑器进行封装，数据实时同步至父组件，父组件通过调用函数将数据传入该组件，初始化数据通过props传输，之后通过setValue方法传输
  * @author Otstar Lin
  * @date 2019年4月
  * @param {String} [value]  - 初始数据
  * @example 调用示例
  *  <tinymce v-model="html_content" ref="tinymce"></tinymce>
  *  <button @click="switchEditor('tinymce')">switchToTinymce</button>
  * @import 导入
  *  import TinyMCE from './components/TinyMCE_Editor.vue'
  *  Vue.component('tinymce', TinyMCE)
  */
-->
<template>
  <div class="tinymce">
    <textarea v-model="htmlContent" id="tinymce-textarea"></textarea>
  </div>
</template>

<script>
import { mapState } from "../store";
import tinyMCE from "tinymce/tinymce";
export default {
  props: {
    value: String
  },
  computed: {
    ...mapState(["htmlContent", "setting"])
  },
  mounted() {
    //设置目标div
    let init = this.setting.tinymceSetting;
    init.selector = "#tinymce-textarea";
    //上传功能
    if (this.setting.xkSetting.imgUpload) {
      init.images_upload_handler = (blobInfo, success, failure) => {
        window.XKEditorAPI.imgUpload(
          blobInfo.blob(),
          response => {
            success(response.data.path);
          },
          error => {
            failure(error);
          }
        );
      };
    }
    //添加自定义按钮
    init.setup = editor => {
      editor.ui.registry.addButton("tex-$", {
        text: "行内公式",
        onAction(_) {
          editor.insertContent("<p>$$$$</p>");
        }
      });
      editor.ui.registry.addButton("tex-math", {
        text: "块公式",
        onAction(_) {
          editor.insertContent("<pre>&nbsp;```math&nbsp;```&nbsp;</pre>");
        }
      });
      editor.ui.registry.addButton("flow", {
        text: "流程图",
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">graph </pre>');
        }
      });
      editor.ui.registry.addButton("seq", {
        text: "时序图",
        onAction(_) {
          editor.insertContent(
            '<pre class="xkeditor-mermaid">sequenceDiagram&nbsp;</pre>'
          );
        }
      });
      editor.ui.registry.addButton("gantt", {
        text: "甘特图",
        onAction(_) {
          editor.insertContent(
            '<pre class="xkeditor-mermaid">gantt&nbsp;</pre>'
          );
        }
      });
      editor.ui.registry.addButton("mermaid", {
        text: "添加图",
        onAction(_) {
          editor.insertContent('<pre class="xkeditor-mermaid">&nbsp;</pre>');
        }
      });
      editor.ui.registry.addButton("prismjs", {
        text: "代码块",
        onAction(_) {
          editor.insertContent(
            '<pre><code class="line-numbers language-javascript">&nbsp;</code></pre>'
          );
        }
      });
      editor.ui.registry.addButton("toMarkdownEditor", {
        text: "切换编辑器",
        onAction(_) {
          window.XKEditor.switchEditor();
        }
      });
    };
    //初始化tinymce编辑器
    tinyMCE.init(init);
    //赋初值
    this.htmlContent = this.value;
    tinyMCE.editors["tinymce-textarea"].setContent(this.htmlContent);
    tinyMCE.editors["tinymce-textarea"].on("KeyUp", e => {
      this.htmlContent = tinyMCE.editors["tinymce-textarea"].getContent();
    });
  }
};
</script>

<style scoped>
.tinymce {
  height: 100%;
}
</style>
