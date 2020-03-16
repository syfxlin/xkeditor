import Vue from "vue";
import ace from "ace-builds";
import tinyMCE from "tinymce/tinymce";
import { toHtml, toMarkdown, toExport } from "../utils/switchContent";
import axios from "axios";
import runCode from "../utils/runCode";
import state from "./state";
import { toolbar as tb } from "../toolbar";

const actions = {
  // Set value
  setValue(val) {
    if (state.editorMode === "ace") {
      actions.setAceValue(val);
    } else {
      actions.setTinyValue(toHtml(val), false);
    }
  },
  setAceValue(val) {
    state.aceEditor.setValue(val, 1);
  },
  setTinyValue(val) {
    state.htmlContent = val;
    tinyMCE.editors["tinymce-textarea"].setContent(state.htmlContent);
  },
  // Init editors
  initAceEditor(value, setting, ele) {
    setting.value = value ? value : "";
    ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
    );
    state.aceEditor = ace.edit(ele, setting);
    if (window.isMobile) {
      actions.execCommand("switchPreview");
    }
    actions.initKey();
    state.aceEditor.on("change", () => {
      state.markdownContent = state.aceEditor.getValue();
    });
  },
  initTinyMceEditor() {
    let init = state.setting.tinymceSetting;
    init.selector = "#tinymce-textarea";
    //上传功能
    if (state.setting.xkSetting.imgUpload) {
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
      editor.on("init", () => {
        editor.setContent(state.htmlContent);
        editor.on("KeyUp", e => {
          state.htmlContent = editor.getContent();
        });
      });
    };
    tinyMCE.init(init);
  },
  // Init other
  initGraff() {
    document.getElementById("previewHtml").addEventListener("click", e => {
      if (e.target.classList.contains("graffiti")) {
        state.graffBoard.hash = e.target.getAttribute("data-hash");
      }
    });
  },
  initKey() {
    var keys = [
      {
        name: "toHtmlEditor",
        win: "F1",
        mac: "F1",
        exec: () => {
          tb.toHtmlEditor.handler();
        }
      },
      {
        name: "toTinyMCE",
        win: "F2",
        mac: "F2",
        exec: () => {
          tb.toTinyMCE.handler();
        }
      },
      {
        name: "toc",
        win: "F7",
        mac: "F7",
        exec: () => {
          tb.toc.handler();
        }
      },
      {
        name: "typewriter",
        win: "F8",
        mac: "F8",
        exec: () => {
          tb.typewriter.handler();
        }
      },
      {
        name: "switchPreview",
        win: "F9",
        mac: "F9",
        exec: () => {
          tb.switchPreview.handler();
        }
      },
      {
        name: "fullPreview",
        win: "F10",
        mac: "F10",
        exec: () => {
          tb.fullPreview.handler();
        }
      },
      {
        name: "fullScreen",
        win: "F11",
        mac: "F11",
        exec: () => {
          tb.fullScreen.handler();
        }
      },
      {
        name: "H1",
        win: "Ctrl-1",
        mac: "Command-1",
        exec: () => {
          tb.h1.handler();
        }
      },
      {
        name: "H2",
        win: "Ctrl-2",
        mac: "Command-2",
        exec: () => {
          tb.h2.handler();
        }
      },
      {
        name: "H3",
        win: "Ctrl-3",
        mac: "Command-3",
        exec: () => {
          tb.h3.handler();
        }
      },
      {
        name: "H4",
        win: "Ctrl-4",
        mac: "Command-4",
        exec: () => {
          tb.h4.handler();
        }
      },
      {
        name: "H5",
        win: "Ctrl-5",
        mac: "Command-5",
        exec: () => {
          tb.h5.handler();
        }
      },
      {
        name: "H6",
        win: "Ctrl-6",
        mac: "Command-6",
        exec: () => {
          tb.h6.handler();
        }
      },
      {
        name: "bold",
        win: "Ctrl-B",
        mac: "Command-B",
        exec: () => {
          tb.bold.handler();
        }
      },
      {
        name: "time",
        win: "Ctrl-D",
        mac: "Command-D",
        exec: () => {
          tb.time.handler();
        }
      },
      {
        name: "minus",
        win: "Ctrl-H",
        mac: "Command-H",
        exec: () => {
          tb.minus.handler();
        }
      },
      {
        name: "italic",
        win: "Ctrl-I",
        mac: "Command-I",
        exec: () => {
          tb.italic.handler();
        }
      },
      {
        name: "mark",
        win: "Ctrl-K",
        mac: "Command-K",
        exec: () => {
          tb.mark.handler();
        }
      },
      {
        name: "link",
        win: "Ctrl-L",
        mac: "Command-L",
        exec: () => {
          tb.link.handler();
        }
      },
      {
        name: "ul",
        win: "Ctrl-U",
        mac: "Command-U",
        exec: () => {
          tb.ul.handler();
        }
      },
      {
        name: "image",
        win: "Ctrl-Shift-I",
        mac: "Command-Shift-I",
        exec: () => {
          tb.image.handler();
        }
      },
      {
        name: "tex-$",
        win: "Ctrl-Shift-K",
        mac: "Command-Shift-K",
        exec: () => {
          tb["tex-$"].handler();
        }
      },
      {
        name: "ol",
        win: "Ctrl-Shift-O",
        mac: "Command-Shift-O",
        exec: () => {
          tb.ol.handler();
        }
      },
      {
        name: "code",
        win: "Ctrl-Shift-P",
        mac: "Command-Shift-P",
        exec: () => {
          tb.code.handler();
        }
      },
      {
        name: "quote",
        win: "Ctrl-Shift-Q",
        mac: "Command-Shift-Q",
        exec: () => {
          tb.quote.handler();
        }
      },
      {
        name: "strikethrough",
        win: "Ctrl-Shift-S",
        mac: "Command-Shift-S",
        exec: () => {
          tb.strikethrough.handler();
        }
      },
      {
        name: "table",
        win: "Ctrl-Shift-T",
        mac: "Command-Shift-T",
        exec: () => {
          tb.table.handler();
        }
      },
      {
        name: "help",
        win: "Ctrl-Shift-H",
        mac: "Command-Shift-H",
        exec: () => {
          tb.help.handler();
        }
      },
      {
        name: "toLine",
        win: "Ctrl-Shift-G",
        mac: "Command-Shift-G",
        exec: () => {
          tb.toLine.handler();
        }
      },
      {
        name: "format",
        win: "Ctrl-Shift-F",
        mac: "Command-Shift-F",
        exec: () => {
          actions.execCommand("format");
        }
      },
      {
        name: "switchPasteFormat",
        win: "Ctrl-Q",
        mac: "Command-Q",
        exec: () => {
          actions.execCommand("pasteFormat");
        }
      }
    ];
    actions.execCommand("addKeys", keys);
  },
  initScroll() {
    var currentTab = 1;
    var scale = 1;
    actions.scrollBind = (operate = null) => {
      var editorDom = document.querySelector(".ace-editor");
      var previewHtmlDom = document.querySelector("#previewHtml");
      var aceContentHeight =
        window.XKEditor.ace.renderer.scrollBarV.scrollHeight -
        editorDom.offsetHeight;
      var previewHtmlHeight =
        previewHtmlDom.scrollHeight - previewHtmlDom.offsetHeight;
      scale = previewHtmlHeight / aceContentHeight;
      if (operate === "init") {
        editorDom.addEventListener("mouseover", () => {
          if (state.setting.xkSetting.scrollBind === "right") {
            currentTab = 2;
          } else {
            currentTab = 1;
          }
        });
        previewHtmlDom.addEventListener("mouseover", () => {
          if (state.setting.xkSetting.scrollBind === "left") {
            currentTab = 1;
          } else {
            currentTab = 2;
          }
        });
        //兼容触摸设备
        editorDom.addEventListener("touchstart", () => {
          if (state.setting.xkSetting.scrollBind === "right") {
            currentTab = 2;
          } else {
            currentTab = 1;
          }
        });
        previewHtmlDom.addEventListener("touchstart", () => {
          if (state.setting.xkSetting.scrollBind === "left") {
            currentTab = 1;
          } else {
            currentTab = 2;
          }
        });
        window.XKEditor.ace.session.on("changeScrollTop", data => {
          if (currentTab === 1) {
            previewHtmlDom.scrollTop = data * scale;
          }
        });
        previewHtmlDom.addEventListener("scroll", () => {
          if (currentTab === 2) {
            window.XKEditor.ace.session.setScrollTop(
              previewHtmlDom.scrollTop / scale
            );
          }
        });
        //兼容触摸设备
        previewHtmlDom.addEventListener("touchmove", () => {
          if (currentTab === 2) {
            window.XKEditor.ace.session.setScrollTop(
              previewHtmlDom.scrollTop / scale
            );
          }
        });
        //惯性滚动
        var inertiaScrollTime = null;
        editorDom.addEventListener("touchstart", event => {
          clearTimeout(inertiaScrollTime);
          var startY = event.changedTouches[0].pageY;
          var endY = 0;
          var startTime = Date.now();
          var endTime = 0;
          editorDom.addEventListener("touchend", event => {
            endY = event.changedTouches[0].pageY;
            endTime = Date.now();
            var _v = ((endY - startY) / (endTime - startTime)) * 1.5;
            function scrollToTop(v, sTime, contentY) {
              var dir = v > 0 ? -1 : 1;
              var deceleration = dir * 0.0018;
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
    window.sta = anchorName => {
      if (anchorName) {
        let anchorElement = document.getElementById(anchorName);
        if (anchorElement) {
          anchorElement.scrollIntoView(true);
        }
      }
    };
    //初始化滚动绑定
    Vue.nextTick(() => {
      setTimeout(() => {
        actions.scrollBind("init");
      }, 1000);
    });
  },
  initPaste() {
    state.aceEditor.on("paste", e => {
      if (state.setting.xkSetting.pasteFormat) {
        if (e.event.clipboardData.getData("text/html")) {
          e.text = toMarkdown(
            e.event.clipboardData.getData("text/html"),
            false
          );
        }
      }
    });

    document
      .getElementsByClassName("ace-container")[0]
      .addEventListener("paste", e => {
        if (
          state.setting.xkSetting.pasteImageUpload &&
          state.setting.xkSetting.imgUpload
        ) {
          if (!(e.clipboardData && e.clipboardData.items)) {
            return;
          }
          for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
            var item = e.clipboardData.items[i];
            if (item.kind === "file") {
              var pasteFile = item.getAsFile();
              window.XKEditorAPI.imgUpload(
                pasteFile,
                response => {
                  state.aceEditor.insert("![](" + response.data.path + ")");
                },
                error => {
                  console.log(error);
                }
              );
            }
          }
        }
      });
  },
  initTocTree() {
    //注册TOC按钮
    document.getElementById("toc-button").addEventListener("click", () => {
      actions.switchToc();
    });
    actions.updateTocTree();
  },
  initResizor() {
    let isResizing = false;
    let resizor = document.getElementById("resizor");
    let left = document.querySelector(".xkeditor-left");
    let right = document.querySelector(".xkeditor-right");
    let container = document.querySelector(".xkeditor");
    resizor.addEventListener("mousedown", e => {
      isResizing = true;
      right.style.userSelect = "none";
    });
    container.addEventListener("mousemove", e => {
      if (!isResizing) return true;
      var offsetLeft = e.clientX - container.clientLeft - container.offsetLeft;
      // 判断左右拖动范围
      if (
        offsetLeft < container.clientWidth * 0.2 ||
        offsetLeft >= container.clientWidth * 0.8
      ) {
        isResizing = false;
        return true;
      }
      left.style.width = offsetLeft + "px";
      resizor.style.left = offsetLeft + "px";
      right.style.width = container.clientWidth - offsetLeft + "px";
      state.resizor.left = offsetLeft + "px";
      state.resizor.right = container.clientWidth - offsetLeft + "px";
    });
    container.addEventListener("mouseup", e => {
      isResizing = false;
      state.aceEditor.resize();
      right.style.userSelect = "unset";
    });
  },
  // Toast
  showToast(message, status = "", loading = false) {
    state.toast.message = message;
    state.toast.status = status;
    state.toast.loading = loading;
  },
  hideToast() {
    state.toast.message = false;
    state.toast.loading = false;
  },
  timeToast(message, status = "", loading = false, delay = 1000) {
    actions.showToast(message, status, loading);
    setTimeout(() => {
      actions.hideToast();
    }, delay);
  },
  // Switch
  switchToc() {
    state.showToc = !state.showToc;
  },
  switchResizor(curr) {
    let left = document.querySelector(".xkeditor-left");
    let right = document.querySelector(".xkeditor-right");
    if (curr) {
      left.style.width = state.resizor.left;
      right.style.width = state.resizor.right;
    } else {
      left.style.width = "";
      right.style.width = "";
    }
  },
  switchPreview(show = null) {
    let curr = show !== null ? show : state.previewShow === "hide";
    if (!curr) {
      state.previewShow = "hide";
    } else {
      state.previewShow = "show";
    }
    actions.switchResizor(curr);
  },
  switchPreviewFull(show = null) {
    let curr = show !== null ? show : state.previewShow === "full";
    if (!curr) {
      state.previewShow = "full";
      Vue.nextTick(() => {
        var preEle = document.getElementById("previewHtml");
        if (
          Math.round(
            (preEle.offsetWidth / preEle.parentElement.offsetWidth) * 100
          ) <= 80
        ) {
          document.getElementById("toc-button").style.display = "none";
          state.showToc = true;
        }
      });
    } else {
      state.previewShow = "show";
      document.getElementById("toc-button").style.display = "block";
      state.showToc = false;
    }
    actions.switchResizor(curr);
  },
  switchFullScreen() {
    if (
      document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    ) {
      if (document.exitFullscreen) {
        return document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        return document.msExitFullscreen();
      }
    } else {
      var root = document.documentElement;
      if (root.requestFullscreen) {
        return root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        return root.webkitRequestFullscreen();
      } else if (root.mozRequestFullScreen) {
        return root.mozRequestFullScreen();
      } else if (root.msRequestFullscreen) {
        return root.msRequestFullscreen();
      }
    }
  },
  switchAceMode() {
    if (state.isMarkdownMode) {
      state.aceEditor.session.setMode("ace/mode/html");
      actions.setAceValue(toHtml(state.aceEditor.getValue(), false));
      state.isMarkdownMode = false;
    } else {
      state.aceEditor.session.setMode("ace/mode/markdown");
      actions.setAceValue(toMarkdown(state.aceEditor.getValue(), true));
      state.isMarkdownMode = true;
    }
  },
  switchEditor() {
    if (!state.setting.xkSetting.enableTinyMCE) return false;
    if (state.editorMode !== "ace") {
      state.markdownContent = toMarkdown(state.htmlContent, true);
      actions.setAceValue(state.markdownContent);
      state.editorMode = "ace";
    } else if (state.editorMode !== "tinymce") {
      state.htmlContent = toHtml(state.markdownContent, false);
      actions.setTinyValue(state.htmlContent);
      state.editorMode = "tinymce";
    }
  },
  // Other
  imgUpload() {
    if (document.getElementById("img-upload").files.length > 0) {
      let file = document.getElementById("img-upload").files[0];
      window.XKEditorAPI.imgUpload(
        file,
        response => {
          Vue.set(state.toolbarModal.data, "src", response.data.path);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      actions.timeToast("当前未选择文件！", "error");
    }
  },
  execCommand(command, data = null) {
    if (command === "toLine") {
      state.toolbarModal.data.allLine = state.aceEditor.session.getLength();
      actions.showtoolbarModal(command, "跳转到指定行");
      return;
    } else if (command === "search") {
      state.aceEditor.commands.commands.find.exec(state.aceEditor);
      return;
    } else if (command === "toc") {
      actions.switchToc();
      return;
    } else if (command === "switchPreview") {
      actions.switchPreview();
      Vue.nextTick(() => {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === "fullPreview") {
      actions.switchPreviewFull();
      Vue.nextTick(() => {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === "fullScreen") {
      actions.switchFullScreen();
      return;
    } else if (command === "toHtmlEditor") {
      actions.switchAceMode();
      state.toolbarShow = !state.toolbarShow;
      return;
    } else if (command === "toTinyMCE") {
      actions.switchEditor();
      return;
    } else if (command === "empty") {
      state.aceEditor.setValue("");
      return;
    } else if (command === "setting") {
      state.aceEditor.commands.commands.showSettingsMenu.exec(state.aceEditor);
      return;
    } else if (command === "undo") {
      state.aceEditor.undo();
      return;
    } else if (command === "redo") {
      state.aceEditor.redo();
      return;
    } else if (command === "toolbar") {
      state.toolbarShow = !state.toolbarShow;
      state.toolbarHtmlShow = !state.toolbarHtmlShow;
      return;
    } else if (command === "resize") {
      Vue.nextTick(() => {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === "addKeys") {
      for (let i = 0; i < data.length; i++) {
        state.aceEditor.commands.addCommand({
          name: data[i].name,
          bindKey: { win: data[i].win, mac: data[i].mac },
          exec: data[i].exec,
          readOnly: true
        });
      }
    } else if (command === "removeKeys") {
      for (let i = 0; i < data.length; i++) {
        state.aceEditor.commands.removeCommand(data[i]);
      }
    } else if (command === "typewriter") {
      var isOne = true;
      var lastRow = state.aceEditor.selection.getCursor().row;
      if (!window.$typewriter) {
        window.$typewriter = event => {
          if (
            event &&
            event.type &&
            !/(mousedown|mouseup|touchstart|touchend|touchmove)/g.test(
              event.type
            )
          ) {
            var nowRow = state.aceEditor.selection.getCursor().row;
            let scroll = 0;
            if (isOne) {
              scroll =
                state.aceEditor.session.getScrollTop() +
                (parseFloat(
                  document
                    .getElementsByClassName("ace_cursor")[0]
                    .style.top.replace("px", "")
                ) -
                  document.getElementsByClassName("ace-editor")[0]
                    .offsetHeight /
                    3);
              isOne = false;
            } else {
              let rows = nowRow - lastRow;
              if (rows === 0) {
                if (event.key === "ArrowDown") {
                  rows = 1;
                } else if (event.key === "ArrowUp") {
                  rows = -1;
                }
              }
              scroll =
                state.aceEditor.session.getScrollTop() +
                rows * state.aceEditor.renderer.lineHeight;
            }
            if (scroll != 0) {
              state.aceEditor.session.setScrollTop(scroll);
            }
            lastRow = nowRow;
          }
        };
      }
      state.typewriterMode = !state.typewriterMode;
      if (state.typewriterMode) {
        state.aceEditor.selection.on("changeCursor", window.$typewriter);
      } else {
        state.aceEditor.selection.off("changeCursor", window.$typewriter);
      }
      return;
    } else if (command === "format") {
      if (!window.prettier) return;
      let formated = window.prettier.format(state.markdownContent, {
        parser: "markdown",
        plugins: window.prettierPlugins
      });
      actions.setAceValue(formated);
    } else if (command === "pasteFormat") {
      state.setting.xkSetting.pasteFormat = !state.setting.xkSetting
        .pasteFormat;
    }
  },
  setInterface() {
    var downloadFun = (filename, data, type) => {
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
    window.XKEditorAPI = {
      //response: {"error":false,"path":"img url"}
      imgUpload: (file, success, failure) => {
        if (state.setting.xkSetting.imgUpload) {
          let param = new FormData();
          param.append("file", file);
          let config = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          // success({"error":false,"path":"https://img.url"})
          actions.showToast("上传中...", "", true);
          axios
            .post(state.setting.xkSetting.imgUpload, param, config)
            .then(response => {
              actions.timeToast("上传成功！", "success");
              success(response);
            })
            .catch(error => {
              actions.timeToast("上传失败！", "error");
              failure(error);
            });
        }
      }
    };
    window.XKEditor = {
      ace: state.aceEditor,
      tinymce: window.tinymce,
      setting: state.setting,
      toMarkdown: toMarkdown,
      toHtml: toHtml,
      execCommand: (command, data) => actions.execCommand(command, data),
      setSetting: setting => {
        Vue.set(state, "setting", setting);
        if (window.XKEditor) {
          window.XKEditor.tinymce.remove();
          window.XKEditor.tinymce.init(setting.tinymceSetting);
          window.XKEditor.ace.setOptions(setting.aceSetting);
        }
      },
      getExportMarkdown: () => {
        return toExport(state.markdownContent);
      },
      getMarkdown: () => {
        return state.markdownContent;
      },
      getHTML: () => {
        return state.htmlViewContent;
      },
      setMarkdown: (val, valueType = "markdown") => {
        //默认设置时在ACE编辑界面
        if (state.editorMode !== "ace") {
          actions.timeToast("当前不在Markdown编辑器！", "error");
          return;
        }
        if (valueType !== "markdown") {
          val = toMarkdown(val, true);
        }
        state.markdownContent = val;
        actions.setAceValue(val);
      },
      setHTML: (val, valueType = "html") => {
        //默认设置时在TinyMCE编辑界面
        if (state.editorMode !== "tinymce") {
          actions.timeToast("当前不在富文本编辑器！", "error");
          return;
        }
        if (valueType !== "html") {
          val = toHtml(val, false);
        }
        state.htmlContent = val;
        actions.setTinyValue(val);
      },
      switchEditor: () => {
        actions.switchEditor();
      },
      switchPreview: () => {
        actions.execCommand("switchPreview");
      },
      switchFullPreview: () => {
        actions.execCommand("fullPreview");
      },
      switchFullScreen: () => {
        actions.execCommand("fullScreen");
      },
      toLine: () => {
        actions.execCommand("toLine");
      },
      toc: () => {
        actions.execCommand("toc");
      },
      toolbar: () => {
        actions.execCommand("toolbar");
      },
      resize: () => {
        actions.execCommand("resize");
      },
      addKeys: keys => {
        // keys = [{name,win,mac,exec},{name,win,mac,exec}]
        actions.execCommand("addKeys", keys);
      },
      removeKeys: keys => {
        // keys = [name, name]
        actions.execCommand("removeKeys", keys);
      },
      getEditor: name => {
        if (name === "ace") {
          return actions.aceEditor;
        } else if (name === "tinymce") {
          return window.tinymce;
        }
      },
      switchTypewriter: () => {
        actions.execCommand("typewriter");
      },
      formatContent() {
        actions.execCommand("format");
      },
      setLocalStorage: filename => {
        window.localStorage.setItem(
          "xkeditor_" + filename,
          window.XKEditor.getMarkdown()
        );
      },
      getLocalStorage: filename => {
        return window.localStorage.getItem("xkeditor_" + filename);
      },
      listLocalStorage: () => {
        var list = {};
        for (const key in window.localStorage) {
          if (key.indexOf("xkeditor_") != -1) {
            list[key.substring(9)] = window.localStorage.getItem(key);
          }
        }
        return list;
      },
      removeLocalStorage: filename => {
        window.localStorage.removeItem("xkeditor_" + filename);
      },
      download: async (filename, type = "markdown") => {
        var data = "";
        if (type === "markdown") {
          data = state.markdownContent;
          type = "md";
        } else if (type === "html") {
          data = state.htmlViewContent;
        } else if (type === "fullhtml") {
          var d_t1 =
            '<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>';
          var d_t2 = "</title>";
          var d_t3 = "</head><body>";
          var d_t4 = "</body></html>";
          var style = await axios.get(state.setting.xkSetting.previewCss);
          style += await axios.get("/static/prism-okaidia.css");
          style += await axios.get("/static/prism-line-numbers.css");
          style += await axios.get("/static/prism-toolbar.css");
          data =
            d_t1 +
            filename +
            d_t2 +
            "<style>" +
            style +
            "</style>" +
            d_t3 +
            '<div class="markdown-body editormd-html-preview">' +
            state.htmlViewContent +
            "</div>" +
            d_t4;
          type = "html";
          downloadFun(filename, data, type);
          return;
        }
        downloadFun(filename, data, type);
      }
    };
  },
  updateTocTree() {
    var items = document.querySelectorAll(
      "#toc .toc-icon ~ ul,.toc .toc-icon ~ ul"
    );
    for (let i = 0; i < items.length; i++) {
      items[i].parentElement.children[0].classList.add("can-active");
      items[i].parentElement.children[0].setAttribute(
        "onclick",
        "toggleToc(this)"
      );
    }
  },
  updateRunCode() {
    document.querySelectorAll(".run-code-btn").forEach(item => {
      item.addEventListener("click", () => {
        runCode(
          item.previousElementSibling.children[0].textContent,
          item.getAttribute("language"),
          item.nextElementSibling.nextElementSibling.nextElementSibling
            .children[0].value,
          item.nextElementSibling.nextElementSibling.nextElementSibling
            .nextElementSibling.children[0]
        );
      });
    });
    document.querySelectorAll(".reset-code-btn").forEach(item => {
      item.addEventListener("click", () => {
        item.nextElementSibling.nextElementSibling.nextElementSibling.children[0].textContent =
          "";
      });
    });
    document.querySelectorAll(".input-code-btn").forEach(item => {
      item.addEventListener("click", () => {
        let area = item.nextElementSibling.children[0];
        area.style.display = area.style.display === "block" ? "none" : "block";
      });
    });
  },
  /**
   * 插入字符到ACE编辑器
   * @param {object} insert { left?: string, right?: string, replace?:string } 插入的字符
   * @param {boolean} [fromStart=false] 是否在行首填充
   * @param {number} [moveToLeft=0] 填充完向左移动光标
   */
  insertTextToAce(insert, fromStart = false, moveToLeft = 0) {
    let selectText = state.aceEditor.getSelectedText();
    let str = insert.replace
      ? insert.replace
      : insert.left + selectText + insert.right;
    let range = state.aceEditor.getSelectionRange();
    if (fromStart) {
      for (let i = range.start.row; i <= range.end.row; i++) {
        state.aceEditor.session.replace(new ace.Range(i, 0, i, 0), str);
      }
    } else {
      state.aceEditor.session.replace(range, str);
    }
    if (moveToLeft) {
      state.aceEditor.navigateLeft(moveToLeft);
    }
    state.aceEditor.focus();
  }
};

export default actions;
