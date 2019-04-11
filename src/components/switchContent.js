import marked from "marked"
import turndown from "turndown"
var turndownGfm = require("turndown-plugin-gfm")

var tocContent = [];
export function getTocHtml() {
  var html = '<ul class="toc">' + getTocHtmlTree(0, '') + '</ul>'
  return html;
}
function getTocHtmlTree(index, str) {
  if(index >= tocContent.length) return str;
  if(index == 0) {
    str += ''
  } else if(tocContent[index].level > tocContent[index-1].level) {
    for(let i = tocContent[index-1].level; i < tocContent[index].level; i++) {
      str += '<ul>'
    }
  } else if(tocContent[index].level < tocContent[index-1].level) {
    for(let i = tocContent[index].level; i < tocContent[index-1].level; i++) {
      str += '</ul>'
    }
  }
  //eslint-disable-next-line
  str += '<li><a href="javascript:scrollToAnchor(\'' + tocContent[index].title.toLowerCase().replace(/ /g, "-").replace(/[^\u4e00-\u9fa5a-zA-Z0-9-]/g, "") + '\');">' + tocContent[index].title + '</a></li>'
  return getTocHtmlTree(index+1, str)
}
export function toHtml(markdownVal) {
  tocContent = [];
  var markedRenderer = new marked.Renderer()
  // markedRenderer.paragraph = function(text) {
  //   //Tex替换
  //   if(/\$\$(.*)\$\$/g.test(text)) {
  //     //eslint-disable-next-line
  //     text = text.replace(/(\$\$([^\$]*)\$\$)/g, function($1, $2) {
  //       let data = $2.replace(/\$/g, "")
  //       var html = katex.renderToString(data, {
  //         throwOnError: false
  //       })
  //       return html
  //     })
  //   }
  //   return text
  // }
  markedRenderer.heading = function(title, level) {
    tocContent.push({title: title, level: level})
    return marked.Renderer.prototype.heading.apply(this, arguments)
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      return '<pre class="xkeditor-tex">$$\n' + code + '\n$$</pre>\n'
    }
    if(/flow(TB|BT|RL|LR|TD)$/.test(language)) {
      return '<pre class="xkeditor-mermaid">graph ' + language.substring(language.length-2) + '\n' + code + '</pre>'
    }
    if(language === 'seq') {
      return '<pre class="xkeditor-mermaid">sequenceDiagram\n' + code + '</pre>'
    }
    if(language === 'gantt') {
      return '<pre class="xkeditor-mermaid">gantt\n' + code + '</pre>'
    }
    if(language === 'mermaid') {
      return '<pre class="xkeditor-mermaid">' + code + '</pre>'
    }
    return marked.Renderer.prototype.code.apply(this, arguments)
  }

  marked.setOptions({
    langPrefix: "line-numbers language-",
    renderer: markedRenderer
  });
  return marked(markdownVal);
}
export function toMarkdown(htmlVal) {
  var turndownService = new turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  });
  turndownService.keep([
    "iframe",
    "style",
    "script",
    "title",
    "span",
    "font"
  ]);
  turndownService.use(turndownGfm.gfm);
  turndownService.addRule('mermaid', {
    filter:  function (node) {
      return (node.nodeName == 'PRE')&&(node.classList.contains('xkeditor-mermaid'))
    },
    replacement: function (content, node) {
      return '\n\n```mermaid\n' + node.textContent + '\n```\n'
    }
  })
  turndownService.addRule('math', {
    filter:  function (node) {
      return (node.nodeName == 'PRE')&&(node.classList.contains('xkeditor-tex'))
    },
    replacement: function (content, node) {
      console.log('out')
      console.dir(node)
      return node.textContent
    }
  })
  return turndownService.turndown(htmlVal)
}
