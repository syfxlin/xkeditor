import Vue from 'vue';

const state = Vue.observable({
  setting: {
    tinymceSetting: {
      language_url: '/static/tinymce/langs/zh_CN.js',
      language: 'zh_CN',
      skin_url: '/static/tinymce/skins/ui/oxide',
      body_class: 'markdown-body',
      content_css: '/static/github-markdown.css',
      plugins:
        'print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
      toolbar:
        'formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo',
      image_advtab: true,
      importcss_append: true,
      height: '100%',
      template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
      template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
      image_caption: true,
      spellchecker_dialog: true,
      spellchecker_whitelist: ['Ephox', 'Moxiecode']
    },
    aceSetting: {
      minLines: 10,
      fontSize: 14,
      theme: 'ace/theme/solarized_light',
      mode: 'ace/mode/markdown',
      tabSize: 4,
      fontSize: '17px',
      wrap: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    },
    xkSetting: {
      apiBaseUrl: '',
      previewCss: '/static/github-markdown.css',
      previewClass: 'markdown-body',
      delayToHtml: 500,
      scrollBind: 'both',
      imgUpload: false,
      graffUrl: 'static/',
      graffUpload: false,
      scrollMode: 'anchor',
      pasteFormat: true,
      pasteImageUpload: true,
      enableTinyMCE: true
    }
  },
  aceEditor: null,
  aceToolbarShow: true,
  aceToolbarHtmlShow: true,
  typewriterMode: false,
  aceToolbarModal: {
    show: false,
    data: {},
    content: ''
  }
});

const actions = {
  initAceEditor(value, setting, ele) {
    setting.value = value ? value : '';
    ace.config.set(
      'basePath',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/'
    );
    state.aceEditor = ace.edit(ele, setting);
    // if (window.isMobile) {
    //   this.execCommand('switchPreview');
    // }
    // this.initKey();
  },
  showAceToolbarModal(operate, title = '') {
    state.aceToolbarModal.show = true;
    state.aceToolbarModal.content = operate;
    state.aceToolbarModal.data.modalTitle = title;
  },
  hideAceToolbarModal() {
    state.aceToolbarModal.content = '';
    state.aceToolbarModal.show = false;
  },
  aceToolbarSubmit() {},
  aceToolbarCancer() {
    actions.hideAceToolbarModal();
  },
  imgUpload() {},
  graffUpload() {
    console.log('graffupload');
  },
  execCommand(command, data = null) {
    console.log('in');
    if (command === 'toLine') {
      state.aceToolbarModal.data.allLine = state.aceEditor.session.getLength();
      actions.showAceToolbarModal(command, '跳转到指定行');
      return;
    } else if (command === 'search') {
      state.aceEditor.commands.commands.find.exec(state.aceEditor);
      return;
    } else if (command === 'toc') {
      // TODO: change
      // this.$parent.switchToc();
      return;
    } else if (command === 'switchPreview') {
      // TODO: change
      // this.$parent.switchPreviewShow();
      Vue.nextTick(function() {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === 'fullPreview') {
      // TODO: change
      // this.$parent.switchPreviewFull();
      Vue.nextTick(function() {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === 'fullScreen') {
      // TODO: change
      //  this.operateFullScreen();
      return;
    } else if (command === 'toHtmlEditor') {
      // TODO: change
      //  this.switchEditorMode();
      state.aceToolbarShow = false;
      return;
    } else if (command === 'toTinyMCE') {
      // TODO: change
      // window.XKEditor.switchEditor();
      return;
    } else if (command === 'empty') {
      state.aceEditor.setValue('');
      return;
    } else if (command === 'setting') {
      state.aceEditor.commands.commands.showSettingsMenu.exec(state.aceEditor);
      return;
    } else if (command === 'undo') {
      state.aceEditor.undo();
      return;
    } else if (command === 'redo') {
      state.aceEditor.redo();
      return;
    } else if (command === 'toolbar') {
      state.aceToolbarShow = !state.aceToolbarShow;
      state.aceToolbarHtmlShow = !state.aceToolbarHtmlShow;
      return;
    } else if (command === 'resize') {
      Vue.nextTick(function() {
        state.aceEditor.resize(state.aceEditor);
      });
      return;
    } else if (command === 'addKeys') {
      for (let i = 0; i < data.length; i++) {
        state.aceEditor.commands.addCommand({
          name: data[i].name,
          bindKey: { win: data[i].win, mac: data[i].mac },
          exec: data[i].exec,
          readOnly: true
        });
      }
    } else if (command === 'removeKeys') {
      for (let i = 0; i < data.length; i++) {
        state.aceEditor.commands.removeCommand(data[i]);
      }
    } else if (command === 'typewriter') {
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
                    .getElementsByClassName('ace_cursor')[0]
                    .style.top.replace('px', '')
                ) -
                  document.getElementsByClassName('ace-editor')[0]
                    .offsetHeight /
                    3);
              isOne = false;
            } else {
              let rows = nowRow - lastRow;
              if (rows === 0) {
                if (event.key === 'ArrowDown') {
                  rows = 1;
                } else if (event.key === 'ArrowUp') {
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
      if (!state.typewriterMode) {
        state.aceEditor.selection.on('changeCursor', window.$typewriter);
      } else {
        state.aceEditor.selection.off('changeCursor', window.$typewriter);
      }
      state.typewriterMode = !state.typewriterMode;
      return;
    } else if (command === 'format') {
      if (!prettier) return;
      // TODO: change
      // let formated = prettier.format(this.value, {
      //   parser: 'markdown',
      //   plugins: prettierPlugins
      // });
      // this.setValue(formated);
    } else if (command === 'pasteFormat') {
      state.setting.xkSetting.pasteFormat = !state.setting.xkSetting
        .pasteFormat;
    }
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
