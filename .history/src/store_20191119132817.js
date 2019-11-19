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
  aceToolbarModal: {
    show: false,
    data: {},
    content: ''
  }
});

const actions = {
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
    state.aceToolbarModal.content = '';
    state.aceToolbarModal.show = false;
  },
  imgUpload() {},
  graffUpload() {
    console.log('graffupload');
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
      ret[states[i]] = store.state[states[i]];
    }
  } else {
    for (const key in states) {
      if (states[key] instanceof Function) {
        ret[key] = states[key](store.state);
      } else {
        ret[key] = store.state[states[key]];
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
