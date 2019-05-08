# XK-Editor

> 一个支持富文本和Markdown的编辑器

![Version](https://img.shields.io/github/release/syfxlin/xkeditor.svg?label=Version&style=flat-square) ![Author](https://img.shields.io/badge/Author-Otstar%20Lin-blue.svg?style=flat-square) ![Lincense](https://img.shields.io/github/license/syfxlin/xkeditor.svg?style=flat-square) ![Build Status](https://drone.lincdn.top/api/badges/syfxlin/xkeditor/status.svg)

## 目录 Contents

- [XK-Editor](#xk-editor)
  - [目录 Contents](#%E7%9B%AE%E5%BD%95-contents)
  - [简介 Introduction](#%E7%AE%80%E4%BB%8B-introduction)
  - [特性 Feature](#%E7%89%B9%E6%80%A7-feature)
  - [演示 Demo](#%E6%BC%94%E7%A4%BA-demo)
  - [安装 Install](#%E5%AE%89%E8%A3%85-install)
    - [从 NPM 安装](#%E4%BB%8E-npm-%E5%AE%89%E8%A3%85)
    - [从本项目上构建](#%E4%BB%8E%E6%9C%AC%E9%A1%B9%E7%9B%AE%E4%B8%8A%E6%9E%84%E5%BB%BA)
    - [组件方式使用](#%E7%BB%84%E4%BB%B6%E6%96%B9%E5%BC%8F%E4%BD%BF%E7%94%A8)
    - [调用方法](#%E8%B0%83%E7%94%A8%E6%96%B9%E6%B3%95)
    - [所需依赖](#%E6%89%80%E9%9C%80%E4%BE%9D%E8%B5%96)
    - [setting.json](#settingjson)
  - [文档 Doc](#%E6%96%87%E6%A1%A3-doc)
  - [维护者 Maintainer](#%E7%BB%B4%E6%8A%A4%E8%80%85-maintainer)
  - [许可证 License](#%E8%AE%B8%E5%8F%AF%E8%AF%81-license)
  - [渲染 Render](#%E6%B8%B2%E6%9F%93-render)

## 简介 Introduction

`XK-Editor` = `Vue2.0` + `Ace` + `TinyMCE`;

XK-Editor支持富文本编辑和Markdown，同时可以在Markdown和HTML互转，满足各种人的需求。

## 特性 Feature

- [两种编辑器] 支持富文本编辑和Markdown编辑
- [两种格式互转] 支持Markdown和HTML互转
- [打字机模式] 支持打字机模式，编辑时无需使用鼠标滚轮，并可调节定位位置，满足各种屏幕和使用者的需求
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
        "previewCss":"/static/github-markdown.css",
        "previewClass":"markdown-body",
        "delayToHtml":500,
        "scrollBind":"both",
        "imgUpload":false
    }
}
```

## 文档 Doc

正在加急编写文档中~(￣▽￣)~*

## 维护者 Maintainer

XK-Editor 由 [Otstar Lin](https://ixk.me/)和下列[贡献者](https://github.com/syfxlin/xkeditor/graphs/contributors)的帮助下撰写和维护。

> Otstar Lin - [Personal Website](https://ixk.me/) · [Blog](https://blog.ixk.me/) · [Github](https://github.com/syfxlin)

## 许可证 License

![lincense](https://img.shields.io/github/license/syfxlin/xkeditor.svg?style=flat-square)

根据 Apache License 2.0 许可证开源。

## 渲染 Render

![xkeditor01.png](https://raw.githubusercontent.com/syfxlin/xkeditor/master/xkeditor01.png)
![xkeditor02.png](https://raw.githubusercontent.com/syfxlin/xkeditor/master/xkeditor02.png)