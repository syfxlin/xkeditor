import Vue from 'vue';

const store = {
  state: Vue.observable({
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
  }),
  actions: {
    operateModal(operate, isShow, title = '') {
      // if (!isShow) {
      //   this.aceToolbarModal[operate] = false;
      //   return;
      // }
      // this.aceToolbarModal[operate] = true;
      this.aceToolbarModal.content = operate;
      this.aceToolbarModal.data.modalTitle = title;
      this.aceToolbarModal.show = true;
    },
    aceToolbarSubmit() {},
    aceToolbarCancer() {
      this.aceToolbarModal.content = '';
      this.aceToolbarModal.show = false;
    },
    imgUpload() {},
    graffUpload() {}
  }
};

export const mapState = states => {
  let ret = {};
  for (let i = 0; i < states.length; i++) {
    ret[states[i]] = store.state[states[i]];
  }
  return ret;
};

export const mapActions = actions => {
  let ret = {};
  for (let i = 0; i < states.length; i++) {
    ret[states[i]] = store.actions[states[i]];
  }
  return ret;
};

export default store;
