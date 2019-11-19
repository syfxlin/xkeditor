<template>
  <div class="xkeditor">
    <template v-if="isRenderEditor">
      <div class="row">
        <div
          :class="previewShow==='show' ? 'xk-col-12' : 'xk-col-24'"
          v-show="editorModeShow&&previewShow!='full'"
        >
          <ace v-model="markdownContent" :setting="setting.aceSetting" ref="ace"></ace>
        </div>
        <div
          :class="previewShow==='show' ? 'xk-col-12' : 'xk-col-24'"
          v-show="editorModeShow&&previewShow!='hide'"
        >
          <div
            :class="setting.xkSetting.previewClass"
            v-html="htmlViewContent"
            id="previewHtml"
            ref="htmlView"
          ></div>
        </div>
        <div class="xk-col-24" v-show="!editorModeShow" v-if="setting.xkSetting.enableTinyMCE">
          <tinymce v-model="htmlContent" :setting="setting.tinymceSetting" ref="tinymce"></tinymce>
        </div>
        <button
          class="xk-button close-preview-full"
          @click="switchPreviewFull()"
          v-show="editorModeShow&&previewShow=='full'"
        >关闭</button>
        <transition name="slide-fade">
          <div id="toc" v-show="showToc"></div>
        </transition>
        <div id="toc-button" class="xk-button">
          <fa-icon icon="bars" />
        </div>
      </div>
    </template>

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
          <li class="can-btn" data-type="save-canvas" id="save-canvas">保存</li>
          <li class="can-btn" data-type="cancel-canvas" id="cancel-canvas">取消</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { initPaint } from "../utils/paint.js";
import "../assets/paint.css";
//导入基础组件
import "../utils/dialogDrag.js";
import ACE from "./ACE_Editor.vue";
import TinyMCE from "./TinyMCE_Editor.vue";

import { axiosPro, axios } from "../utils/axiosPro.js";
//HTML和Markdown互转
import { toHtml, toMarkdown, getTocHtml } from "../utils/switchContent.js";

// import katex from "katex"
// import "katex/dist/katex.min.css"
// import renderMathInElement from "katex/dist/contrib/auto-render"
// import mermaid from "mermaid"

//fa icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);

import store, { mapState, mapActions } from "../store";

export default {
  name: "XK_Editor",
  components: {
    ace: ACE,
    tinymce: TinyMCE,
    "fa-icon": FontAwesomeIcon
  },
  props: {
    settingApi: String,
    contentApi: String,
    settingProps: Object,
    contentProps: String
  },
  data() {
    return {
      isRenderEditor: false,
      toc: "",
      delayToHtml: null,
      setting: {
        tinymceSetting: {
          language_url: "/static/tinymce/langs/zh_CN.js",
          language: "zh_CN",
          skin_url: "/static/tinymce/skins/ui/oxide",
          body_class: "markdown-body",
          content_css: "/static/github-markdown.css",
          plugins:
            "print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
          toolbar:
            "formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo",
          image_advtab: true,
          importcss_append: true,
          height: "100%",
          template_cdate_format: "[CDATE: %m/%d/%Y : %H:%M:%S]",
          template_mdate_format: "[MDATE: %m/%d/%Y : %H:%M:%S]",
          image_caption: true,
          spellchecker_dialog: true,
          spellchecker_whitelist: ["Ephox", "Moxiecode"]
        },
        aceSetting: {
          minLines: 10,
          fontSize: 14,
          theme: "ace/theme/solarized_light",
          mode: "ace/mode/markdown",
          tabSize: 4,
          fontSize: "17px",
          wrap: true,
          enableSnippets: true,
          enableLiveAutocompletion: true,
          enableBasicAutocompletion: true
        },
        xkSetting: {
          apiBaseUrl: "",
          previewCss: "/static/github-markdown.css",
          previewClass: "markdown-body",
          delayToHtml: 500,
          scrollBind: "both",
          imgUpload: false,
          graffUrl: "static/",
          graffUpload: false,
          scrollMode: "anchor",
          pasteFormat: true,
          pasteImageUpload: true,
          enableTinyMCE: true
        }
      }
    };
  },
  computed: {
    editorModeShow() {
      if (this.editorMode === "ace") {
        return true;
      } else if (this.editorMode === "tinymce") {
        return false;
      }
    },
    isMobile() {
      return window.isMobile;
    },
    ...mapState([
      "showToc",
      "previewShow",
      "editorMode",
      "markdownContent",
      "htmlContent",
      "htmlViewContent"
    ])
  },
  async mounted() {
    window.isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
      navigator.userAgent
    );
    await this.load();
    window.eSetting = this.setting;
    this.htmlViewContent = toHtml(this.markdownContent, true);
    this.$nextTick(function() {
      this.initEditor();
    });
    this.setInterface();
    this.$emit("loadHook", "componentLoad");
  },
  methods: {
    ...mapActions([
      "switchToc",
      "switchPreviewFull",
      "switchEditor",
      "setAceValue",
      "setTinyValue"
    ]),
    async load() {
      let md = null;
      let setting = null;
      if (!this.contentProps) {
        md = await axiosPro.get(this.contentApi);
      } else {
        md = this.contentProps;
      }
      if (!this.settingProps) {
        setting = await axiosPro.get(this.settingApi);
      } else {
        setting = this.settingProps;
      }
      this.markdownContent = md;
      this.setting = setting;
      this.loadCss(setting.xkSetting.previewCss);
      this.isRenderEditor = true;
    },
    loadCss(url) {
      let css = document.createElement("link");
      css.href = url;
      css.rel = "stylesheet";
      css.type = "text/css";
      document.head.appendChild(css);
    },
    initEditor() {
      mermaid.initialize({ startOnLoad: true });
      //初始化scroll操作
      this.initScroll();
      //初始化TOC
      this.initTocTree();
      this.$nextTick(function() {
        //注册粘贴操作
        this.initPaste();
        // 注册涂鸦板
        this.initGraff();
      });
    },
    renderNextTick() {
      this.$nextTick(function() {
        //制作TOC
        var tocHtml = getTocHtml();
        document.getElementById("toc").innerHTML = tocHtml;
        //制作文章内TOC
        for (
          let i = 0;
          i < document.getElementsByClassName("toc").length;
          i++
        ) {
          document.getElementsByClassName("toc")[i].innerHTML = tocHtml;
        }
        //更新TOC icon
        this.updateTocTree();
        //转换Tex公式
        renderMathInElement(document.getElementById("previewHtml"), {
          delimiters: [
            { left: "$$", right: "$$" },
            { left: "```math", right: "```" },
            { left: "```tex", right: "```" }
          ],
          ignoredTags: ["script", "noscript", "style", "textarea", "code"]
        });
        //转换Mermaid图
        try {
          mermaid.init({ noteMargin: 10 }, ".xkeditor-mermaid");
        } catch (error) {
          console.log("May have errors");
        }
        //更新滚动绑定
        if (window.scrollBind) {
          window.scrollBind();
        }
      });
    },
    initTocTree() {
      window.toggleToc = this.toggleToc;
      //注册TOC按钮
      document.getElementById("toc-button").addEventListener("click", () => {
        this.switchToc();
      });
      this.updateTocTree();
    },
    updateTocTree() {
      var items = document.querySelectorAll(
        "#toc .toc-img ~ ul,.toc .toc-img ~ ul"
      );
      for (let i = 0; i < items.length; i++) {
        items[i].parentNode.children[0].setAttribute(
          "src",
          "/static/svg/minus-square.svg"
        );
        items[i].parentNode.children[0].setAttribute(
          "onclick",
          "toggleToc(this)"
        );
      }
    },
    toggleToc(ele) {
      var display = ele.nextElementSibling.nextElementSibling.style.display;
      if (display === "" || display === "block") {
        ele.nextElementSibling.nextElementSibling.style.display = "none";
        ele.setAttribute("src", "/static/svg/plus-square.svg");
      } else {
        ele.nextElementSibling.nextElementSibling.style.display = "block";
        ele.setAttribute("src", "/static/svg/minus-square.svg");
      }
    },
    initScroll() {
      window.scrollBind = function(operate = null, bindType = "both") {
        var currentTab = 1;
        var editorDom = document.querySelector(".ace-editor");
        var previewHtmlDom = document.querySelector("#previewHtml");
        var aceContentHeight =
          window.XKEditor.ace.renderer.scrollBarV.scrollHeight -
          editorDom.offsetHeight;
        var previewHtmlHeight =
          previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight;
        window.scale = previewHtmlHeight / aceContentHeight;
        if (operate === "init") {
          if (bindType === "left") {
            currentTab = 1;
          } else if (bindType === "right") {
            currentTab = 2;
          } else {
            editorDom.addEventListener("mouseover", function() {
              currentTab = 1;
            });
            previewHtmlDom.addEventListener("mouseover", function() {
              currentTab = 2;
            });
            //兼容触摸设备
            editorDom.addEventListener("touchstart", function() {
              currentTab = 1;
            });
            previewHtmlDom.addEventListener("touchstart", function() {
              currentTab = 2;
            });
          }
          window.XKEditor.ace.session.on("changeScrollTop", function(data) {
            if (currentTab === 1) {
              previewHtmlDom.scrollTop = data * window.scale;
            }
          });
          previewHtmlDom.addEventListener("scroll", function() {
            if (currentTab === 2) {
              window.XKEditor.ace.session.setScrollTop(
                previewHtmlDom.scrollTop / window.scale
              );
            }
          });
          //兼容触摸设备
          previewHtmlDom.addEventListener("touchmove", function() {
            if (currentTab === 2) {
              window.XKEditor.ace.session.setScrollTop(
                previewHtmlDom.scrollTop / window.scale
              );
            }
          });
          //惯性滚动
          var inertiaScrollTime = null;
          editorDom.addEventListener("touchstart", function(event) {
            clearTimeout(inertiaScrollTime);
            var startY = event.changedTouches[0].pageY;
            var endY = 0;
            var startTime = Date.now();
            var endTime = 0;
            editorDom.addEventListener("touchend", function(event) {
              endY = event.changedTouches[0].pageY;
              endTime = Date.now();
              var _v = ((endY - startY) / (endTime - startTime)) * 1.5;
              function scrollToTop(v, sTime, contentY) {
                var dir = v > 0 ? -1 : 1;
                var deceleration = dir * 0.0018;
                var duration = v / deceleration;
                function inertiaMove() {
                  // if(stopInertia) return
                  var nowTime = Date.now();
                  var t = nowTime - sTime;
                  var nowV = v + t * deceleration;
                  // 速度方向变化表示速度达到0了
                  if (dir * nowV > 0) {
                    return;
                  }
                  var moveY = (-(v + nowV) / 2) * t;
                  window.XKEditor.ace.session.setScrollTop(contentY + moveY);
                  inertiaScrollTime = setTimeout(inertiaMove, 10);
                }
                inertiaMove();
              }
              scrollToTop(
                _v,
                endTime,
                window.XKEditor.ace.session.getScrollTop()
              );
            });
          });
        }
      };
      // 模拟锚点
      window.scrollMode = this.setting.xkSetting.scrollMode;
      window.sta = function(anchorName) {
        if (anchorName) {
          let anchorElement = document.getElementById(anchorName);
          if (anchorElement) {
            anchorElement.scrollIntoView(true);
          }
        }
      };
      //初始化滚动绑定
      this.$nextTick(function() {
        setTimeout(function() {
          window.scrollBind(
            "init",
            window.eThis.e.setting.xkSetting.scrollBind
          );
        }, 1000);
      });
    },
    initGraff() {
      if (this.setting.xkSetting.graffUpload) {
        initPaint("canvas", true, false, { x: 1, y: 1 });
        document
          .getElementById("previewHtml")
          .addEventListener("click", function(e) {
            let ele = e.target;
            if (
              ele.nodeName === "IMG" &&
              ele.className.indexOf("graffiti") !== -1
            ) {
              let canvas = document.getElementById("canvas");
              document.getElementsByClassName("canvas-main")[0].style.display =
                "block";
              let canvasContext = canvas.getContext("2d");
              canvasContext.drawImage(
                ele,
                0,
                0,
                canvasContext.canvas.width,
                canvasContext.canvas.height
              );
              let filename = ele.getAttribute("src");
              if (filename.indexOf("/") > 0) {
                filename = filename.substring(filename.lastIndexOf("/") + 1);
              }
              canvas.setAttribute("data-filename", filename);
              window.setCanvasScale();
            }
          });
        document
          .getElementById("save-canvas")
          .addEventListener("click", function() {
            window.eThis.e.saveCanvas();
          });
        document
          .getElementById("cancel-canvas")
          .addEventListener("click", function() {
            document.getElementsByClassName("canvas-main")[0].style.display =
              "none";
          });
      }
    },
    saveCanvas() {
      document.getElementById("canvas").toBlob(function(blob) {
        let file = new window.File(
          [blob],
          document.getElementById("canvas").getAttribute("data-filename"),
          { type: blob.type }
        );
        window.XKEditorAPI.graffUpload(
          file,
          function(response) {
            if (response.data.error) {
              //TODO: error
            }
            document.getElementsByClassName("canvas-main")[0].style.display =
              "none";
            window.eThis.e.htmlViewContent += " ";
            //TODO: 上传成功提示
          },
          function(error) {
            //TODO: 上传失败提示
            console.log(error);
          }
        );
      });
    },
    initPaste() {
      var _this = this;
      if (this.setting.xkSetting.pasteFormat) {
        document.getElementById("toolbar-pasteFormat").classList.add("active");
      }
      window.XKEditor.ace.on("paste", function(e) {
        if (_this.setting.xkSetting.pasteFormat) {
          if (e.event.clipboardData.getData("text/html")) {
            e.text = toMarkdown(
              e.event.clipboardData.getData("text/html"),
              false
            );
          }
        }
      });
      if (
        this.setting.xkSetting.pasteImageUpload &&
        this.setting.xkSetting.imgUpload
      ) {
        document
          .getElementsByClassName("ace-container")[0]
          .addEventListener("paste", function(e) {
            if (!(e.clipboardData && e.clipboardData.items)) {
              return;
            }
            for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
              var item = e.clipboardData.items[i];
              if (item.kind === "file") {
                var pasteFile = item.getAsFile();
                window.XKEditorAPI.imgUpload(
                  pasteFile,
                  function(response) {
                    window.XKEditor.ace.insert(
                      "[](" + response.data.path + ")"
                    );
                    //TODO: 上传成功提示
                  },
                  function(error) {
                    //TODO: 上传失败提示
                    console.log(error);
                  }
                );
              }
            }
          });
      }
    },
    setInterface() {
      var _this = this;
      var downloadFun = function(filename, data, type) {
        var aLink = document.createElement("a");
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        aLink.download = filename + "." + type;
        aLink.href = URL.createObjectURL(
          new Blob([data], { type: "text/" + type })
        );
        aLink.dispatchEvent(evt);
      };
      window.eThis = {
        e: this,
        a: this.$refs.ace,
        t: this.$refs.tinymce
      };
      window.XKEditorAPI = {
        //response: {"error":false,"path":"img url"}
        imgUpload: function(file, success, failure) {
          if (_this.setting.xkSetting.imgUpload) {
            let param = new FormData();
            param.append("file", file);
            let config = {
              headers: { "Content-Type": "multipart/form-data" }
            };
            // success({"error":false,"path":"https://img.url"})
            axios
              .post(_this.setting.xkSetting.imgUpload, param, config)
              .then(function(response) {
                success(response);
              })
              .catch(function(error) {
                failure(error);
              });
          } else {
            //TODO: 上传关闭提示
          }
        },
        graffUpload: function(file, success, failure, filename = null) {
          if (_this.setting.xkSetting.graffUpload) {
            let param = new FormData();
            if (filename) {
              param.append("file", file, filename);
            } else {
              param.append("file", file);
            }
            let config = {
              headers: { "Content-Type": "multipart/form-data" }
            };
            // success({"error":false,"path":"https://img.url"})
            axios
              .post(_this.setting.xkSetting.graffUpload, param, config)
              .then(function(response) {
                success(response);
              })
              .catch(function(error) {
                failure(error);
              });
          } else {
            //TODO: 上传关闭提示
          }
        }
      };
      window.XKEditor = {
        ace: _this.$refs.ace.aceEditor,
        tinymce: window.tinymce,
        toMarkdown: toMarkdown,
        toHtml: toHtml,
        getMarkdown: function() {
          return _this.markdownContent;
        },
        getHTML: function() {
          return _this.htmlViewContent;
        },
        setMarkdown: function(val, valueType = "markdown") {
          //默认设置时在ACE编辑界面
          if (_this.editorMode !== "ace") {
            //TODO: 提示不可设置，因为不在ACE状态
            return;
          }
          if (valueType !== "markdown") {
            val = toMarkdown(val, true);
          }
          _this.markdownContent = val;
          _this.$refs.ace.setValue(val);
        },
        setHTML: function(val, valueType = "html") {
          //默认设置时在TinyMCE编辑界面
          if (_this.editorMode !== "tinymce") {
            //TODO: 提示不可设置，因为不在TinyMCE状态
            return;
          }
          if (valueType !== "html") {
            val = toHtml(val, false);
          }
          _this.htmlContent = val;
          _this.$refs.tinymce.setValue(val);
        },
        switchEditor: function() {
          _this.switchEditor();
        },
        switchPreview: function() {
          _this.$refs.ace.execCommand("switchPreview");
        },
        switchFullPreview: function() {
          _this.$refs.ace.execCommand("fullPreview");
        },
        switchFullScreen: function() {
          _this.$refs.ace.execCommand("fullScreen");
        },
        toLine: function() {
          _this.$refs.ace.execCommand("toLine");
        },
        toc: function() {
          _this.$refs.ace.execCommand("toc");
        },
        toolbar: function() {
          _this.$refs.ace.execCommand("toolbar");
        },
        resize: function() {
          _this.$refs.ace.execCommand("resize");
        },
        addKeys: function(keys) {
          // keys = [{name,win,mac,exec},{name,win,mac,exec}]
          _this.$refs.ace.execCommand("addKeys", keys);
        },
        removeKeys: function(keys) {
          // keys = [name, name]
          _this.$refs.ace.execCommand("removeKeys", keys);
        },
        getEditor: function(name) {
          if (name === "ace") {
            return _this.$refs.ace.aceEditor;
          } else if (name === "tinymce") {
            return window.tinymce;
          }
        },
        switchTypewriter: function(data) {
          _this.$refs.ace.execCommand("typewriter", true);
        },
        setLocalStorage: function(filename) {
          window.localStorage.setItem(
            "xkeditor_" + filename,
            window.XKEditor.getMarkdown()
          );
        },
        getLocalStorage: function(filename) {
          return window.localStorage.getItem("xkeditor_" + filename);
        },
        listLocalStorage: function() {
          var list = {};
          for (const key in window.localStorage) {
            if (key.indexOf("xkeditor_") != -1) {
              list[key.substring(9)] = window.localStorage.getItem(key);
            }
          }
          return list;
        },
        removeLocalStorage: function(filename) {
          window.localStorage.removeItem("xkeditor_" + filename);
        },
        download: async function(filename, type = "markdown") {
          var data = "";
          if (type === "markdown") {
            data = _this.markdownContent;
            type = "md";
          } else if (type === "html") {
            data = _this.htmlViewContent;
          } else if (type === "fullhtml") {
            var d_t1 =
              '<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>';
            var d_t2 = "</title>";
            var d_t3 = "</head><body>";
            var d_t4 = "</body></html>";
            var style = await axiosPro.get(_this.setting.xkSetting.previewCss);
            style += await axiosPro.get("/static/prism-okaidia.css");
            style += await axiosPro.get("/static/prism-line-numbers.css");
            style += await axiosPro.get("/static/prism-toolbar.css");
            data =
              d_t1 +
              filename +
              d_t2 +
              "<style>" +
              style +
              "</style>" +
              d_t3 +
              '<div class="markdown-body editormd-html-preview">' +
              _this.htmlViewContent +
              "</div>" +
              d_t4;
            type = "html";
            downloadFun(filename, data, type);
            return;
          }
          downloadFun(filename, data, type);
        }
      };
      this.$emit("loadHook", "interfaceLoad");
    }
  },
  watch: {
    markdownContent(val) {
      var _this = this;
      //最少延迟250ms转换为html以保证性能，否则会造成输入卡顿
      var delay =
        _this.setting.xkSetting.delayToHtml >= 250
          ? _this.setting.xkSetting.delayToHtml
          : 250;
      if (_this.delayToHtml) {
        clearTimeout(_this.delayToHtml);
      }
      _this.delayToHtml = setTimeout(function() {
        _this.htmlViewContent = toHtml(val, true);
        _this.renderNextTick();
      }, delay);
    },
    htmlContent(val) {
      this.htmlViewContent = val;
      this.renderNextTick();
      this.$nextTick(function() {
        Prism.highlightAll();
      });
    }
  }
};
</script>

<style>
.xkeditor {
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
.xkeditor .row {
  height: 100%;
  transform: translate(0, 0);
}
.xkeditor .row .xk-col-12 {
  height: 100%;
}
#previewHtml {
  overflow: auto;
  max-height: 100%;
  padding: 15px 15px;
  word-break: break-word;
  white-space: normal;
  box-sizing: border-box;
}
.xk-col-24 #previewHtml {
  float: left;
  width: 80%;
}
.toc,
#toc {
  word-break: break-word;
  white-space: normal;
  overflow-y: auto;
  height: 100%;
}
.toc ul,
#toc ul {
  margin: 0px;
  padding-left: 20px;
}
.toc li,
#toc li {
  list-style: none;
  padding-left: 5px;
}
.toc li img,
#toc li img {
  display: inline-block;
  width: 14px;
  vertical-align: middle;
  padding-right: 5px;
}
.toc a,
#toc a {
  color: #0366d6;
  text-decoration: none;
  font-size: 1.05em;
}
.row {
  margin: 0px;
}
.row .xk-col-12 {
  float: left;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
}
.xk-col-24 {
  padding: 0px;
  width: 100%;
  height: 100%;
}
.xk-col-12 {
  padding: 0px;
  width: 50%;
  height: 100%;
}
.close-preview-full {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 1000;
}
#toc {
  position: fixed;
  top: 0px;
  right: 0px;
  width: 20%;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  z-index: 999;
  padding: 20px;
  box-sizing: border-box;
}
#toc-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 20px;
  height: 20px;
  padding: 6px;
  z-index: 1000;
  box-sizing: content-box;
}
.xk-button {
  display: inline-block;
  padding: 6px 16px;
  outline: 0;
  font-size: 0.85em;
  line-height: 1.5;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #c5d9e8;
  border-radius: 4px;
  background-color: #fff;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
}

@media (max-width: 991px) {
  .xk-col-24 #previewHtml {
    float: left;
    width: 100%;
  }
  #toc {
    width: 80%;
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
