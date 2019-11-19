import Vue from 'vue';

let store = {
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
  aceToolbarSubmit() {},
  aceToolbarCancer() {
    // this.aceToolbarModal.link = false;
    // this.aceToolbarModal.image = false;
    // this.aceToolbarModal.video = false;
    // this.aceToolbarModal.toLine = false;
    // this.aceToolbarModal.search = false;
    // this.aceToolbarModal.table = false;
    // this.aceToolbarModal.help = false;
    // this.aceToolbarModal.info = false;
    // this.aceToolbarModal.localStorage = false;
    // this.aceToolbarModal.graff = false;
    this.aceToolbarModal.content = '';
    this.aceToolbarModal.show = false;
  },
  imgUpload() {},
  graffUpload() {}
};

export default store;
