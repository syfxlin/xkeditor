import Vue from "vue";
import { toHtml, toMarkdown } from "./utils/switchContent";
import { initPaint } from "./utils/paint";
import axios from "axios";
import runCode from "./utils/runCode";

window.isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
  navigator.userAgent
);

window.toggleToc = ele => {
  var display = ele.nextElementSibling.nextElementSibling.style.display;
  if (display === "" || display === "block") {
    ele.nextElementSibling.nextElementSibling.style.display = "none";
    ele.setAttribute("src", "/static/svg/plus-square.svg");
  } else {
    ele.nextElementSibling.nextElementSibling.style.display = "block";
    ele.setAttribute("src", "/static/svg/minus-square.svg");
  }
};

const state = Vue.observable({
  showToc: false,
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
      toolbar:
        "h1 h2 h3 h4 h5 h6 | bold italic underline strikethrough quote mark code | sup sub tex-$ tex-math | flow seq gantt mermaid | ul ol minus table time | link image video graff | toLine search toc typewriter switchPreview fullPreview fullScreen toHtmlEditor toTinyMCE format empty setting | undo redo | setLocalStorage getLocalStorage removeLocalStorage | help info | pasteFormat",
      minLines: 10,
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
      enableTinyMCE: true,
      judge0API: "https://api.judge0.com"
    }
  },
  aceEditor: null,
  aceToolbarShow: true,
  aceToolbarHtmlShow: true,
  previewShow: "show",
  typewriterMode: false,
  isMarkdownMode: true,
  editorMode: "ace",
  markdownContent: "",
  htmlContent: "",
  htmlViewContent: "",
  aceToolbarModal: {
    show: false,
    data: {},
    content: ""
  },
  toast: {
    show: false,
    message: "",
    status: "",
    loading: false
  }
});

const actions = {
  setAceValue(val) {
    state.aceEditor.setValue(val);
    state.aceEditor.gotoLine(1);
  },
  setTinyValue(val) {
    state.htmlContent = val;
    window.tinyMCE.editors["tinymce-textarea"].setContent(state.htmlContent);
  },
  initAceEditor(value, setting, ele) {
    setting.value = value ? value : "";
    window.ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/"
    );
    state.aceEditor = window.ace.edit(ele, setting);
    if (window.isMobile) {
      actions.execCommand("switchPreview");
    }
    actions.initKey();
  },
  showAceToolbarModal(operate, title = "") {
    state.aceToolbarModal.show = true;
    state.aceToolbarModal.content = operate;
    state.aceToolbarModal.data.modalTitle = title;
  },
  hideAceToolbarModal() {
    state.aceToolbarModal.content = "";
    state.aceToolbarModal.show = false;
  },
  showToast(message, status = "", loading = false) {
    state.toast.message = message;
    state.toast.status = status;
    state.toast.loading = loading;
    state.toast.show = true;
  },
  hideToast() {
    state.toast.message = "";
    state.toast.loading = false;
    state.toast.show = false;
  },
  timeToast(message, status = "", loading = false, delay = 1000) {
    actions.showToast(message, status, loading);
    setTimeout(() => {
      actions.hideToast();
    }, delay);
  },
  aceToolbarSubmit() {
    let str = "";
    let data = state.aceToolbarModal.data;
    if (data.operate === "table") {
      if (data.row > 1) {
        data.row = parseInt(data.row) + 1;
      }
      for (let i = 0; i < data.row; i++) {
        for (let j = 0; j < data.column; j++) {
          str += "| ";
          if (i == 1) {
            if (data.type === "left" || data.type === "center") {
              str += ":";
            }
            str += "----------";
            if (data.type === "right" || data.type === "center") {
              str += ":";
            }
          }
          str += " ";
        }
        str += "|\n";
      }
    } else if (data.operate === "link") {
      str = "[" + data.title + "](" + data.href + ")";
    } else if (data.operate === "image") {
      str = "![" + data.art + "](" + data.src + ")";
    } else if (data.operate === "video") {
      if (!/\w+\.(\w+)$/.test(data.src)) {
        actions.timeToast("地址输入有误！请重新输入(无法识别扩展名)", "error");
        return;
      }
      let type = data.src.match(/\w+\.(\w+)$/);
      str =
        '<video controls="controls" width="' +
        data.width +
        '" height="' +
        data.height +
        '"><source src="' +
        data.src +
        '" type="video/' +
        type[1] +
        '" /></video>';
    } else if (data.operate === "graff") {
      str = "[graff]{" + data.hash + "}";
    } else if (data.operate === "toLine") {
      state.aceEditor.gotoLine(data.line);
      state.aceEditor.focus();
      actions.hideAceToolbarModal();
      actions.aceToolbarCancer();
      return;
    } else if (data.operate === "setLocalStorage") {
      window.XKEditor.setLocalStorage(
        state.aceToolbarModal.data.locationStorage
      );
      actions.aceToolbarCancer();
      return;
    } else if (data.operate === "getLocalStorage") {
      str = window.XKEditor.getLocalStorage(
        state.aceToolbarModal.data.locationStorage
      );
      actions.setAceValue(str);
      actions.aceToolbarCancer();
      return;
    } else if (data.operate === "removeLocalStorage") {
      window.XKEditor.removeLocalStorage(
        state.aceToolbarModal.data.locationStorage
      );
      actions.aceToolbarCancer();
      return;
    }
    actions.hideAceToolbarModal();
    actions.operateAceContent(false, 0, str);
    actions.aceToolbarCancer();
  },
  aceToolbarCancer() {
    actions.hideAceToolbarModal();
  },
  imgUpload() {
    if (document.getElementById("img-upload").files.length > 0) {
      let file = document.getElementById("img-upload").files[0];
      window.XKEditorAPI.imgUpload(
        file,
        response => {
          Vue.set(state.aceToolbarModal.data, "src", response.data.path);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      actions.timeToast("当前未选择文件！", "error");
    }
  },
  initGraff() {
    if (state.setting.xkSetting.graffUpload) {
      initPaint("canvas", true, false, { x: 1, y: 1 });
      document.getElementById("previewHtml").addEventListener("click", e => {
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
    }
  },
  graffUpload() {
    let hash = Math.random()
      .toString(36)
      .substring(2, 8);
    if (document.getElementById("graff-upload").files.length > 0) {
      let file = document.getElementById("graff-upload").files[0];
      window.XKEditorAPI.graffUpload(
        file,
        response => {
          Vue.set(state.aceToolbarModal.data, "hash", hash);
        },
        error => {
          console.log(error);
        },
        "graff-" + hash + ".png"
      );
    } else {
      let canvas = document.getElementById("canvas");
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        let file = new window.File([blob], "graff-" + hash + ".png", {
          type: blob.type
        });
        window.XKEditorAPI.graffUpload(
          file,
          response => {
            Vue.set(state.aceToolbarModal.data, "hash", hash);
          },
          error => {
            console.log(error);
          }
        );
      });
    }
  },
  switchToc() {
    state.showToc = !state.showToc;
    let ele = document.getElementById("toolbar-toc");
    if (state.showToc) {
      ele.classList.add("active");
    } else {
      ele.classList.remove("active");
    }
  },
  switchPreviewShow(show = null) {
    let curr = show !== null ? show : state.previewShow === "hide";
    let ele1 = document.getElementById("toolbar-switchPreview");
    let ele2 = document.getElementById("toolbar-fullPreview");
    if (!curr) {
      state.previewShow = "hide";
      ele1.classList.add("active");
    } else {
      state.previewShow = "show";
      ele1.classList.remove("active");
      ele2.classList.remove();
    }
  },
  switchPreviewFull(show = null) {
    let curr = show !== null ? show : state.previewShow === "full";
    let ele1 = document.getElementById("toolbar-fullPreview");
    let ele2 = document.getElementById("toolbar-switchPreview");
    if (!curr) {
      state.previewShow = "full";
      ele1.classList.add("active");
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
      ele1.classList.remove("active");
      ele2.classList.remove("active");
      document.getElementById("toc-button").style.display = "block";
      state.showToc = false;
    }
  },
  operateFullScreen() {
    let ele = document.getElementById("toolbar-fullScreen");
    if (
      document.fullscreenElement ||
      document.msFullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement
    ) {
      ele.classList.remove("active");
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
      ele.classList.add("active");
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
  switchToHtml() {
    if (state.isMarkdownMode) {
      state.aceEditor.session.setMode("ace/mode/html");
      actions.setAceValue(
        toHtml(state.aceEditor.getSession().getValue(), false)
      );
      state.isMarkdownMode = false;
    }
  },
  switchToMarkdown() {
    if (!state.isMarkdownMode) {
      state.aceEditor.session.setMode("ace/mode/markdown");
      actions.setAceValue(
        toMarkdown(state.aceEditor.getSession().getValue(), true)
      );
      state.isMarkdownMode = true;
    }
  },
  switchEditorMode() {
    if (state.isMarkdownMode) {
      actions.switchToHtml();
    } else {
      actions.switchToMarkdown();
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
  execCommand(command, data = null) {
    if (command === "toLine") {
      state.aceToolbarModal.data.allLine = state.aceEditor.session.getLength();
      actions.showAceToolbarModal(command, "跳转到指定行");
      return;
    } else if (command === "search") {
      state.aceEditor.commands.commands.find.exec(state.aceEditor);
      return;
    } else if (command === "toc") {
      actions.switchToc();

      return;
    } else if (command === "switchPreview") {
      actions.switchPreviewShow();
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
      actions.operateFullScreen();
      return;
    } else if (command === "toHtmlEditor") {
      actions.switchEditorMode();
      state.aceToolbarShow = false;
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
      state.aceToolbarShow = !state.aceToolbarShow;
      state.aceToolbarHtmlShow = !state.aceToolbarHtmlShow;
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
      let ele = document.getElementById("toolbar-typewriter");
      if (state.typewriterMode) {
        state.aceEditor.selection.on("changeCursor", window.$typewriter);
        ele.classList.add("active");
      } else {
        state.aceEditor.selection.off("changeCursor", window.$typewriter);
        ele.classList.remove("active");
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
      let ele = document.getElementById("toolbar-pasteFormat");
      if (state.setting.xkSetting.pasteFormat) {
        ele.classList.add("active");
      } else {
        ele.classList.remove("active");
      }
    }
  },
  toolbarClick(operate) {
    state.aceToolbarModal.data.operate = operate;
    let str = "";
    let isStart = false;
    let toLeft = 0;
    let selectText = state.aceEditor.getSelectedText();
    if (operate.match(/^h(\d)/)) {
      str = "#".repeat(operate.substring(1)) + " ";
      isStart = true;
    } else if (operate === "bold") {
      str = "**" + selectText + "**";
      toLeft = 2;
    } else if (operate === "italic") {
      str = "*" + selectText + "*";
      toLeft = 1;
    } else if (operate === "underline") {
      str =
        '<span style="text-decoration: underline">' + selectText + "</span>";
      toLeft = 7;
    } else if (operate === "strikethrough") {
      str = "~" + selectText + "~";
      toLeft = 1;
    } else if (operate === "quote") {
      str = "> ";
      isStart = true;
    } else if (operate === "mark") {
      str = "`" + selectText + "`";
      toLeft = 1;
    } else if (operate === "code") {
      str = "```\n```";
      toLeft = 4;
    } else if (operate === "sup") {
      str = "<sup>" + selectText + "</sup>";
      toLeft = 6;
    } else if (operate === "sub") {
      str = "<sub>" + selectText + "</sub>";
      toLeft = 6;
    } else if (operate === "tex-$") {
      str = "$$" + selectText + "$$";
      toLeft = 2;
    } else if (operate === "tex-math") {
      str = "```math\n\n```";
      toLeft = 4;
    } else if (operate === "flow") {
      str = "```flow\n```";
      toLeft = 4;
    } else if (operate === "seq") {
      str = "```seq\n\n```";
      toLeft = 4;
    } else if (operate === "gantt") {
      str = "```gantt\n\n```";
      toLeft = 4;
    } else if (operate === "mermaid") {
      str = "```mermaid\n\n```";
      toLeft = 4;
    } else if (operate === "ul") {
      str = "- ";
      isStart = true;
    } else if (operate === "ol") {
      str = "1. ";
      isStart = true;
    } else if (operate === "minus") {
      str = "\n---\n\n";
      isStart = true;
    } else if (operate === "table") {
      actions.showAceToolbarModal(operate, "添加表格");
      return;
    } else if (operate === "time") {
      str = new Date().toLocaleString();
    } else if (operate === "link") {
      actions.showAceToolbarModal(operate, "添加链接");
      return;
    } else if (operate === "image") {
      actions.showAceToolbarModal(operate, "添加图片");
      return;
    } else if (operate === "video") {
      actions.showAceToolbarModal(operate, "添加视频");
      return;
    } else if (operate === "graff") {
      actions.showAceToolbarModal(operate, "上传涂鸦图");
      return;
    } else if (operate === "setLocalStorage") {
      actions.showAceToolbarModal("localStorage", "保存到本地");
      return;
    } else if (operate === "getLocalStorage") {
      actions.showAceToolbarModal("localStorage", "从本地读取");
      return;
    } else if (operate === "removeLocalStorage") {
      actions.showAceToolbarModal("localStorage", "删除本地存储");
      return;
    } else if (operate === "help") {
      actions.showAceToolbarModal(operate, "帮助");
      return;
    } else if (operate === "info") {
      actions.showAceToolbarModal(operate, "关于");
      return;
    } else if (
      /(toLine|search|toc|switchPreview|fullPreview|fullScreen|toHtmlEditor|toTinyMCE|empty|setting|undo|redo|typewriter|format|pasteFormat)/g.test(
        operate
      )
    ) {
      actions.execCommand(operate);
      return;
    }
    actions.operateAceContent(isStart, toLeft, str);
  },
  operateAceContent(isStart, toLeft, str) {
    let range = state.aceEditor.getSelectionRange();
    if (isStart) {
      for (let i = range.start.row; i <= range.end.row; i++) {
        state.aceEditor.session.replace(new window.ace.Range(i, 0, i, 0), str);
      }
    } else {
      state.aceEditor.session.replace(range, str);
    }
    if (toLeft) {
      state.aceEditor.navigateLeft(toLeft);
    }
    state.aceEditor.focus();
  },
  initKey() {
    var keys = [
      {
        name: "toHtmlEditor",
        win: "F1",
        mac: "F1",
        exec: () => {
          actions.toolbarClick("toHtmlEditor");
        }
      },
      {
        name: "toTinyMCE",
        win: "F2",
        mac: "F2",
        exec: () => {
          actions.toolbarClick("toTinyMCE");
        }
      },
      {
        name: "toc",
        win: "F7",
        mac: "F7",
        exec: () => {
          actions.toolbarClick("toc");
        }
      },
      {
        name: "typewriter",
        win: "F8",
        mac: "F8",
        exec: () => {
          actions.toolbarClick("typewriter");
        }
      },
      {
        name: "switchPreview",
        win: "F9",
        mac: "F9",
        exec: () => {
          actions.toolbarClick("switchPreview");
        }
      },
      {
        name: "fullPreview",
        win: "F10",
        mac: "F10",
        exec: () => {
          actions.toolbarClick("fullPreview");
        }
      },
      {
        name: "fullScreen",
        win: "F11",
        mac: "F11",
        exec: () => {
          actions.toolbarClick("fullScreen");
        }
      },
      {
        name: "H1",
        win: "Ctrl-1",
        mac: "Command-1",
        exec: () => {
          actions.toolbarClick("h1");
        }
      },
      {
        name: "H2",
        win: "Ctrl-2",
        mac: "Command-2",
        exec: () => {
          actions.toolbarClick("h2");
        }
      },
      {
        name: "H3",
        win: "Ctrl-3",
        mac: "Command-3",
        exec: () => {
          actions.toolbarClick("h3");
        }
      },
      {
        name: "H4",
        win: "Ctrl-4",
        mac: "Command-4",
        exec: () => {
          actions.toolbarClick("h4");
        }
      },
      {
        name: "H5",
        win: "Ctrl-5",
        mac: "Command-5",
        exec: () => {
          actions.toolbarClick("h5");
        }
      },
      {
        name: "H6",
        win: "Ctrl-6",
        mac: "Command-6",
        exec: () => {
          actions.toolbarClick("h6");
        }
      },
      {
        name: "bold",
        win: "Ctrl-B",
        mac: "Command-B",
        exec: () => {
          actions.toolbarClick("bold");
        }
      },
      {
        name: "time",
        win: "Ctrl-D",
        mac: "Command-D",
        exec: () => {
          actions.toolbarClick("time");
        }
      },
      {
        name: "minus",
        win: "Ctrl-H",
        mac: "Command-H",
        exec: () => {
          actions.toolbarClick("minus");
        }
      },
      {
        name: "italic",
        win: "Ctrl-I",
        mac: "Command-I",
        exec: () => {
          actions.toolbarClick("italic");
        }
      },
      {
        name: "mark",
        win: "Ctrl-K",
        mac: "Command-K",
        exec: () => {
          actions.toolbarClick("mark");
        }
      },
      {
        name: "link",
        win: "Ctrl-L",
        mac: "Command-L",
        exec: () => {
          actions.toolbarClick("link");
        }
      },
      {
        name: "ul",
        win: "Ctrl-U",
        mac: "Command-U",
        exec: () => {
          actions.toolbarClick("ul");
        }
      },
      {
        name: "image",
        win: "Ctrl-Shift-I",
        mac: "Command-Shift-I",
        exec: () => {
          actions.toolbarClick("image");
        }
      },
      {
        name: "tex-$",
        win: "Ctrl-Shift-K",
        mac: "Command-Shift-K",
        exec: () => {
          actions.toolbarClick("tex-$");
        }
      },
      {
        name: "ol",
        win: "Ctrl-Shift-O",
        mac: "Command-Shift-O",
        exec: () => {
          actions.toolbarClick("ol");
        }
      },
      {
        name: "code",
        win: "Ctrl-Shift-P",
        mac: "Command-Shift-P",
        exec: () => {
          actions.toolbarClick("code");
        }
      },
      {
        name: "quote",
        win: "Ctrl-Shift-Q",
        mac: "Command-Shift-Q",
        exec: () => {
          actions.toolbarClick("quote");
        }
      },
      {
        name: "strikethrough",
        win: "Ctrl-Shift-S",
        mac: "Command-Shift-S",
        exec: () => {
          actions.toolbarClick("strikethrough");
        }
      },
      {
        name: "table",
        win: "Ctrl-Shift-T",
        mac: "Command-Shift-T",
        exec: () => {
          actions.toolbarClick("table");
        }
      },
      {
        name: "help",
        win: "Ctrl-Shift-H",
        mac: "Command-Shift-H",
        exec: () => {
          actions.toolbarClick("help");
        }
      },
      {
        name: "toLine",
        win: "Ctrl-Shift-G",
        mac: "Command-Shift-G",
        exec: () => {
          actions.toolbarClick("toLine");
        }
      },
      {
        name: "format",
        win: "Ctrl-Shift-F",
        mac: "Command-Shift-F",
        exec: () => {
          actions.execCommand("format");
        }
      }
    ];
    actions.execCommand("addKeys", keys);
  },
  setInterface() {
    return new Promise((resolve, reject) => {
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
        },
        graffUpload: (file, success, failure, filename = null) => {
          if (state.setting.xkSetting.graffUpload) {
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
            actions.showToast("上传中...", "", true);
            axios
              .post(state.setting.xkSetting.graffUpload, param, config)
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
        setSetting: setting => {
          Vue.set(state, "setting", setting);
          if (window.XKEditor) {
            window.XKEditor.tinymce.remove();
            window.XKEditor.tinymce.init(setting.tinymceSetting);
            window.XKEditor.ace.setOptions(setting.aceSetting);
          }
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
          state.aceEditor.execCommand("switchPreview");
        },
        switchFullPreview: () => {
          state.aceEditor.execCommand("fullPreview");
        },
        switchFullScreen: () => {
          state.aceEditor.execCommand("fullScreen");
        },
        toLine: () => {
          state.aceEditor.execCommand("toLine");
        },
        toc: () => {
          state.aceEditor.execCommand("toc");
        },
        toolbar: () => {
          state.aceEditor.execCommand("toolbar");
        },
        resize: () => {
          state.aceEditor.execCommand("resize");
        },
        addKeys: keys => {
          // keys = [{name,win,mac,exec},{name,win,mac,exec}]
          state.aceEditor.execCommand("addKeys", keys);
        },
        removeKeys: keys => {
          // keys = [name, name]
          state.aceEditor.execCommand("removeKeys", keys);
        },
        getEditor: name => {
          if (name === "ace") {
            return state.aceEditor.aceEditor;
          } else if (name === "tinymce") {
            return window.tinymce;
          }
        },
        switchTypewriter: data => {
          state.aceEditor.execCommand("typewriter", true);
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
      resolve();
    });
  },
  initScroll() {
    window.scrollBind = (operate = null, bindType = "both") => {
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
          editorDom.addEventListener("mouseover", () => {
            currentTab = 1;
          });
          previewHtmlDom.addEventListener("mouseover", () => {
            currentTab = 2;
          });
          //兼容触摸设备
          editorDom.addEventListener("touchstart", () => {
            currentTab = 1;
          });
          previewHtmlDom.addEventListener("touchstart", () => {
            currentTab = 2;
          });
        }
        window.XKEditor.ace.session.on("changeScrollTop", data => {
          if (currentTab === 1) {
            previewHtmlDom.scrollTop = data * window.scale;
          }
        });
        previewHtmlDom.addEventListener("scroll", () => {
          if (currentTab === 2) {
            window.XKEditor.ace.session.setScrollTop(
              previewHtmlDom.scrollTop / window.scale
            );
          }
        });
        //兼容触摸设备
        previewHtmlDom.addEventListener("touchmove", () => {
          if (currentTab === 2) {
            window.XKEditor.ace.session.setScrollTop(
              previewHtmlDom.scrollTop / window.scale
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
    window.scrollMode = state.setting.xkSetting.scrollMode;
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
        window.scrollBind("init", state.setting.xkSetting.scrollBind);
      }, 1000);
    });
  },
  initPaste() {
    if (
      state.setting.xkSetting.pasteFormat &&
      document.getElementById("toolbar-pasteFormat")
    ) {
      document.getElementById("toolbar-pasteFormat").classList.add("active");
    }
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
    if (
      state.setting.xkSetting.pasteImageUpload &&
      state.setting.xkSetting.imgUpload
    ) {
      document
        .getElementsByClassName("ace-container")[0]
        .addEventListener("paste", e => {
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
        });
    }
  },
  initTocTree() {
    //注册TOC按钮
    document.getElementById("toc-button").addEventListener("click", () => {
      actions.switchToc();
    });
    actions.updateTocTree();
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
    });
    container.addEventListener("mouseup", e => {
      isResizing = false;
      state.aceEditor.resize();
      right.style.userSelect = "unset";
    });
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
  }
};

const store = {
  state,
  actions
};

export const mapState = states => {
  let ret = {};
  if (states instanceof Array) {
    for (let i = 0; i < states.length; i++) {
      ret[states[i]] = {
        get() {
          return store.state[states[i]];
        },
        set(value) {
          store.state[states[i]] = value;
        }
      };
    }
  } else {
    for (const key in states) {
      if (states[key] instanceof Function) {
        ret[key] = {
          get() {
            return states[key](store.state);
          }
        };
      } else {
        ret[key] = {
          get() {
            return store.state[states[key]];
          },
          set(value) {
            store.state[states[key]] = value;
          }
        };
      }
    }
  }
  return ret;
};

export const mapActions = actions => {
  let ret = {};
  if (actions instanceof Array) {
    for (let i = 0; i < actions.length; i++) {
      ret[actions[i]] = store.actions[actions[i]];
    }
  } else {
    for (const key in actions) {
      if (actions[key] instanceof Function) {
        ret[key] = actions[key](store.actions);
      } else {
        ret[key] = store.actions[actions[key]];
      }
    }
  }
  return ret;
};

export default store;
