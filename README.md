# XK-Editor

> 一个支持富文本和Markdown的编辑器

![Version](https://img.shields.io/github/release/syfxlin/xkeditor.svg?label=Version&style=flat-square) ![Npm-Latest](https://img.shields.io/npm/v/xkeditor/latest.svg?style=flat-square) ![Author](https://img.shields.io/badge/Author-Otstar%20Lin-blue.svg?style=flat-square) ![Lincense](https://img.shields.io/github/license/syfxlin/xkeditor.svg?style=flat-square) ![Build Status](https://drone.lincdn.top/api/badges/syfxlin/xkeditor/status.svg)

## 目录 Contents

- [XK-Editor](#xk-editor)
  - [目录 Contents](#%e7%9b%ae%e5%bd%95-contents)
  - [简介 Introduction](#%e7%ae%80%e4%bb%8b-introduction)
  - [特性 Feature](#%e7%89%b9%e6%80%a7-feature)
  - [演示 Demo](#%e6%bc%94%e7%a4%ba-demo)
  - [安装 Install](#%e5%ae%89%e8%a3%85-install)
    - [注意事项](#%e6%b3%a8%e6%84%8f%e4%ba%8b%e9%a1%b9)
    - [从 NPM 安装](#%e4%bb%8e-npm-%e5%ae%89%e8%a3%85)
    - [从本项目上构建](#%e4%bb%8e%e6%9c%ac%e9%a1%b9%e7%9b%ae%e4%b8%8a%e6%9e%84%e5%bb%ba)
    - [组件方式使用](#%e7%bb%84%e4%bb%b6%e6%96%b9%e5%bc%8f%e4%bd%bf%e7%94%a8)
    - [调用方法](#%e8%b0%83%e7%94%a8%e6%96%b9%e6%b3%95)
    - [所需依赖](#%e6%89%80%e9%9c%80%e4%be%9d%e8%b5%96)
    - [setting.json](#settingjson)
  - [运行代码块](#%e8%bf%90%e8%a1%8c%e4%bb%a3%e7%a0%81%e5%9d%97)
  - [文档 Doc](#%e6%96%87%e6%a1%a3-doc)
  - [维护者 Maintainer](#%e7%bb%b4%e6%8a%a4%e8%80%85-maintainer)
  - [许可证 License](#%e8%ae%b8%e5%8f%af%e8%af%81-license)
  - [渲染 Render](#%e6%b8%b2%e6%9f%93-render)

## 简介 Introduction

`XK-Editor` = `Vue2.0` + `Ace` + `TinyMCE`;

XK-Editor支持富文本编辑和Markdown，同时可以在Markdown和HTML互转，满足各种人的需求。

## 特性 Feature

- [两种编辑器] 支持富文本编辑和Markdown编辑
- [两种格式互转] 支持Markdown和HTML互转
- [打字机模式] 支持打字机模式，编辑时无需使用鼠标滚轮，并可调节定位位置，满足各种屏幕和使用者的需求
- [粘贴自动格式化] 支持在粘贴HTML时自动将HTML格式化为Markdown
- [图片粘贴自动上传] 支持粘贴图片自动上传，并自动填充链接
- [嵌入运行块] 支持嵌入可运行的代码块，通过与后端交互可以支持多种语言
- [下载] 支持导出下载Markdown和HTML格式的文件
- [即时保存] 支持即时保存到浏览器，无惧网络波动
- [移动端优化] 优化移动端的编辑体验，支持惯性滚动，并默认关闭实时预览
- [滚动绑定] 支持双向/单向滚动绑定，使预览能够跟随输入
- [树形TOC] 目录可折叠，不用再翻阅很久来定位
- [自定义主题] 支持自定义主题，可以通过替换CSS来更换显示样式
- [Emoji表情] 支持Github语法的表情`:smile:`
- [Task lists] 支持创建Task列表
- [TeX公式] 支持插入KaTex公式
- [流程图/时序图/甘特图] 支持mermaid语法编写各种图
- [解析HTML] 支持解析各种HTML标签，并支持过滤标签
- [独有的扩展语法] 支持通过`[text]{style|label}`的方式解析文字
- [自动补全] 支持语法自动补全
- [图片上传] 支持图片上传
- 还有多种神奇的功能等待你的发掘。

## 演示 Demo

[XK-Editor](https://xkeditor.ixk.me/)

## 安装 Install

### 注意事项

从 Version 1.0.8 开始，为了减小Vendor体积，防止加载时间过长，XK-Editor默认使用`jsDelivr CDN`加载部分`node_modules`
需要在index.html中添加一下script标签，若您不打算使用该方式加载，请将`node_modules/xkeditor/components`下的文件中s所有的`import`注释取消。
```html
<!-- ACE Editor -->
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/ace.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/ace-builds@1.4.4/src-noconflict/ext-language_tools.js"></script>
<!-- Preitter -->
<script src="https://cdn.jsdelivr.net/npm/prettier@1.18.2/standalone.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prettier@1.18.2/parser-markdown.js"></script>
<!-- Prism.js -->
<script src="/static/prism.js"></script>
<link rel="stylesheet" href="/static/prism-okaidia.css">
<link rel="stylesheet" href="/static/prism-line-numbers.css">
<link rel="stylesheet" href="/static/prism-toolbar.css">
<link rel="stylesheet" href="/static/prism-copy-to-clipboard.min.css">
<!-- Katex -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/contrib/auto-render.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css">
<!-- Mermaid -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@8.0.0/dist/mermaid.min.js"></script>
<!-- Emoji-js -->
<script src="https://cdn.jsdelivr.net/npm/emoji-js@3.4.1/lib/emoji.min.js"></script>
<!-- TinyMCE -->
<script src="https://cdn.jsdelivr.net/npm/tinymce@5.0.5/tinymce.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tinymce@5.0.5/themes/silver/theme.min.js"></script>
<script src="https://cdn.jsdelivr.net/combine/npm/tinymce@5.0.5/plugins/print/plugin.min.js,npm/tinymce@5.0.5/plugins/preview/plugin.min.js,npm/tinymce@5.0.5/plugins/fullpage/plugin.min.js,npm/tinymce@5.0.5/plugins/fullscreen/plugin.min.js,npm/tinymce@5.0.5/plugins/searchreplace/plugin.min.js,npm/tinymce@5.0.5/plugins/autolink/plugin.min.js,npm/tinymce@5.0.5/plugins/directionality/plugin.min.js,npm/tinymce@5.0.5/plugins/code/plugin.min.js,npm/tinymce@5.0.5/plugins/visualblocks/plugin.min.js,npm/tinymce@5.0.5/plugins/visualchars/plugin.min.js,npm/tinymce@5.0.5/plugins/image/plugin.min.js,npm/tinymce@5.0.5/plugins/link/plugin.min.js,npm/tinymce@5.0.5/plugins/media/plugin.min.js,npm/tinymce@5.0.5/plugins/template/plugin.min.js,npm/tinymce@5.0.5/plugins/codesample/plugin.min.js,npm/tinymce@5.0.5/plugins/table/plugin.min.js,npm/tinymce@5.0.5/plugins/charmap/plugin.min.js,npm/tinymce@5.0.5/plugins/hr/plugin.min.js,npm/tinymce@5.0.5/plugins/pagebreak/plugin.min.js,npm/tinymce@5.0.5/plugins/nonbreaking/plugin.min.js,npm/tinymce@5.0.5/plugins/anchor/plugin.min.js,npm/tinymce@5.0.5/plugins/toc/plugin.min.js,npm/tinymce@5.0.5/plugins/insertdatetime/plugin.min.js,npm/tinymce@5.0.5/plugins/advlist/plugin.min.js,npm/tinymce@5.0.5/plugins/lists/plugin.min.js,npm/tinymce@5.0.5/plugins/wordcount/plugin.min.js,npm/tinymce@5.0.5/plugins/imagetools/plugin.min.js,npm/tinymce@5.0.5/plugins/textpattern/plugin.min.js"></script>
```

### 从 NPM 安装

你可以轻松将 XK-Editor 引入你现有的项目

1. 安装XK-Editor
```bash
npm i --save xkeditor
```
2. 将XK-Editor static文件复制到项目根目录
```bash
cp -r ./node_modules/xkeditor/static ./
```
3. 导入XK-Editor组件
```javascript
import XK_Editor from 'xkeditor'
export default {
    components: {
        'xk-editor': XK_Editor
    }
}
```

### 从本项目上构建
1. 首先clone本项目，或者前往[Releases](https://github.com/syfxlin/xkeditor/releases)下载本项目并解压
```bash
git clone https://github.com/syfxlin/xkeditor.git
```
2. 进入项目文件夹
```bash
cd xkeditor
```
3. 执行`yarn`或者`npm install`
```bash
yarn
//or
npm install
```
4. 测试运行
```bash
yarn start
//or
npm run dev
```
然后打开浏览器访问指定http://ip:8080，如果能正常访问则可以进行下一步
5. build
```bash
yarn build
//or
npm run build
```
6. 将项目文件夹下的文件复制到网站目录即可

### 组件方式使用
1. 首先clone本项目，或者前往[Releases](https://github.com/syfxlin/xkeditor/releases)下载本项目并解压
```bash
git clone https://github.com/syfxlin/xkeditor.git
```
2. 进入项目文件夹
```bash
cd xkeditor
```
3. 将`static`文件夹下的所有文件复制到Vue项目下的`static`文件夹下
4. 将`src/utils`和`src/components`下的所有问文件复制到Vue项目下的`src/utils`和`src/components`文件夹下
5. 导入XK-Editor组件
```javascript
import XK_Editor from '@/components/XK_Editor'
export default {
    components: {
        'xk-editor': XK_Editor
    }
}
```

### 调用方法
1. 导入XK-Editor组件
```javascript
import XK_Editor from '@/components/XK_Editor'
export default {
    components: {
        'xk-editor': XK_Editor
    }
}
```
2. 在合适的位置调用组件
```javascript
<xk-editor :settingApi="setting" :contentApi="content" />
//settingApi: setting.json的地址，或者返回setting的API接口地址(GET)
//contentApi: Markdown文件的地址，或者返回Markdown格式的API接口地址(GET)

//or
<xk-editor :setting="setting" :content="content" />
//setting: 即setting object，解析setting.json得到的对象
//content： Markdown内容文本
```

### 所需依赖
```
ace-builds
@fortawesome/fontawesome-svg-core
@fortawesome/free-solid-svg-icons
@fortawesome/vue-fontawesome
@tinymce/tinymce-vue
axios
emoji-js
katex
marked
mermaid
prismjs
tinymce
turndown
turndown-plugin-gfm
```

### setting.json
```json
{
    "tinymceSetting":{
        "language_url":"/static/tinymce/langs/zh_CN.js",
        "language":"zh_CN",
        "skin_url":"/static/tinymce/skins/ui/oxide",
        "body_class":"markdown-body",
        "content_css":"/static/github-markdown.css",
        "plugins":"print preview fullpage searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern",
        "toolbar":"formatselect | fontsizeselect | bold italic underline strikethrough blockquote forecolor backcolor prismjs | link image media pageembed | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | tex-$ tex-math flow seq gantt mermaid | removeformat code toMarkdownEditor | undo redo",
        "image_advtab":true,
        "importcss_append":true,
        "height":"100%",
        "template_cdate_format":"[CDATE: %m/%d/%Y : %H:%M:%S]",
        "template_mdate_format":"[MDATE: %m/%d/%Y : %H:%M:%S]",
        "image_caption":true,
        "spellchecker_dialog":true,
        "spellchecker_whitelist":[
            "Ephox",
            "Moxiecode"
        ]
    },
    "aceSetting":{
        "minLines":10,
        "fontSize":"17px",
        "theme":"ace/theme/solarized_light",
        "mode":"ace/mode/markdown",
        "tabSize":4,
        "wrap":true,
        "enableSnippets":true,
        "enableLiveAutocompletion":true,
        "enableBasicAutocompletion":true,
        "value":"# XK-Editor"
    },
    "xkSetting":{
        "apiBaseUrl": "",
        "previewCss": "/static/github-markdown.css",
        "previewClass": "markdown-body",
        "delayToHtml": 500,
        "scrollBind": "both",
        "imgUpload": "http://test.ixk.me/upload.php",
        "graffUrl": "static/",
        "graffUpload": "http://test.ixk.me/upload.php",
        "scrollMode": "javascript",
        "pasteFormat": true,
        "pasteImageUpload": true,
        "enableTinyMCE": true
    }
}
```

## 运行代码块

运行代码块除javascript不需要使用后端，其他语言都需要有后端负责执行代码。
后端执行器基于 [judge0/api](https://github.com/judge0/api) 重新build而来，支持的语言详见 [run-code](https://github.com/syfxlin/run-code) ，若您有其他语言的需求，您可以自行参照教程重新build

[run-code](https://github.com/syfxlin/run-code)

## 文档 Doc

[Wiki](https://github.com/syfxlin/xkeditor/wiki/)

## 维护者 Maintainer

XK-Editor 由 [Otstar Lin](https://ixk.me/)和下列[贡献者](https://github.com/syfxlin/xkeditor/graphs/contributors)的帮助下撰写和维护。

> Otstar Lin - [Personal Website](https://ixk.me/) · [Blog](https://blog.ixk.me/) · [Github](https://github.com/syfxlin)

## 许可证 License

![lincense](https://img.shields.io/github/license/syfxlin/xkeditor.svg?style=flat-square)

根据 Apache License 2.0 许可证开源。

## 渲染 Render

![xkeditor01.png](https://raw.githubusercontent.com/syfxlin/xkeditor/master/xkeditor01.png)
![xkeditor02.png](https://raw.githubusercontent.com/syfxlin/xkeditor/master/xkeditor02.png)
