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
      return '```' + language + '\n' + code + '\n```'
    }
    if(/flow(TB|BT|RL|LR|TD)$/.test(language)) {
      return '<div class="mermaid">graph ' + language.substring(language.length-2) + '\n' + code + '</div><div class="mermaid-text" style="display:none">graph ' + language.substring(language.length-2) + '\n' + code + '</div>'
    }
    if(language === 'seq') {
      return '<div class="mermaid">sequenceDiagram\n' + code + '</div><div class="mermaid-text" style="display:none">sequenceDiagram' + code + '</div>'
    }
    if(language === 'gantt') {
      return '<div class="mermaid">gantt\n' + code + '</div><div class="mermaid-text" style="display:none">gantt' + code + '</div>'
    }
    if(language === 'mermaid') {
      return '<div class="mermaid">' + code + '</div><div class="mermaid-text" style="display:none">' + code + '</div>'
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
  return turndownService.turndown(htmlVal)
}
