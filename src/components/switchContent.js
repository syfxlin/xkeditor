import marked from "marked"
import turndown from "turndown"
var turndownGfm = require("turndown-plugin-gfm")

import prismjs from 'prismjs'

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
  str += '<li><a href="javascript:scrollToAnchor(\'' + tocContent[index].title.toLowerCase().replace(/ /g, "-").replace(/[^\u4e00-\u9fa5a-zA-Z0-9-]/g, "") + '\');">' + tocContent[index].title + '</a></li>'
  return getTocHtmlTree(index+1, str)
}
export function toHtml(markdownVal) {
  tocContent = [];
  var markedRenderer = new marked.Renderer()
  markedRenderer.paragraph = function(text) {
    if(/\[(.*)]{(.*)}/g.test(text)) {
      text = text.replace(/(\[([^\[\]]*)]{([^{}|]*)(\|span|\|p|\|font|\||)})/g, function($1, $2, $3, $4, $5) {
        if($5 == '|' || $5 == '' || $5 == null) {
          $5 = 'p'
        } else {
          $5 = $5.substring(1)
        }
        return '<' + $5 + ' style="' + $4 + '">' + $3 + '</' + $5 + '>'
      })
      return text
    }
    return marked.Renderer.prototype.paragraph.apply(this, arguments)
  }
  markedRenderer.heading = function(title, level) {
    tocContent.push({title: title, level: level})
    return marked.Renderer.prototype.heading.apply(this, arguments)
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      return '<pre class="xkeditor-tex">```' + language +'\n' + code + '\n```</pre>\n'
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

export function toHtmlFull(markdownVal) {
  tocContent = [];
  var markedRenderer = new marked.Renderer()
  markedRenderer.paragraph = function(text) {
    if(/\[(.*)]{(.*)}/g.test(text)) {
      text = text.replace(/(\[([^\[\]]*)]{([^{}|]*)(\|span|\|p|\|font|\||)})/g, function($1, $2, $3, $4, $5) {
        if($5 == '|' || $5 == '' || $5 == null) {
          $5 = 'p'
        } else {
          $5 = $5.substring(1)
        }
        return '<' + $5 + ' style="' + $4 + '">' + $3 + '</' + $5 + '>'
      })
      return text
    }
    return marked.Renderer.prototype.paragraph.apply(this, arguments)
  }
  markedRenderer.heading = function(title, level) {
    tocContent.push({title: title, level: level})
    return marked.Renderer.prototype.heading.apply(this, arguments)
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      return '<pre class="xkeditor-tex">```' + language +'\n' + code + '\n```</pre>\n'
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
    if(language !== '') {
      return '<pre class="line-numbers language-' + language + '"><code class="language-' + language + '">' + prismjs.highlight(code, prismjs.languages[language], prismjs.languages.markup) + '</code></pre>'
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
  ]);
  turndownService.use(turndownGfm.gfm);
  turndownService.addRule('mermaid', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-mermaid'))
    },
    replacement: function (content, node) {
      return '\n\n```mermaid\n' + node.innerHTML.replace(/(<br \/>|<br>)/g, '\n') + '\n```\n'
    }
  })
  turndownService.addRule('math', {
    filter:  function (node) {
      return (node.nodeName === 'PRE')&&(node.classList.contains('xkeditor-tex'))
    },
    replacement: function (content, node) {
      return node.innerHTML.replace(/(<br \/>|<br>)/g, '\n')
    }
  })
  turndownService.addRule('sup', {
    filter:  function (node) {
      return (node.nodeName === 'SUP')
    },
    replacement: function (content, node) {
      return '<sup>' + content + '</sup>'
    }
  })
  turndownService.addRule('sub', {
    filter:  function (node) {
      return (node.nodeName === 'SUB')
    },
    replacement: function (content, node) {
      return '<sub>' + content + '</sub>'
    }
  })
  turndownService.addRule('havaStyle', {
    filter:  function (node) {
      return (node.nodeName === 'FONT' || node.nodeName === 'P' || node.nodeName === 'SPAN')&&(node.getAttribute('style') !== null)
    },
    replacement: function (content, node) {
      var parseStyle = [
        'color',
        'font-size',
        'padding-left',
        'background-color',
        'text-align',
        'font-family'
      ]
      var out = node.outerHTML
      if(node.style.textDecoration === 'underline') {
        out = '<u>' + content + '</u>'
      } else if(node.style.textDecoration === 'line-through') {
        out = '~' + content + '~'
      } else {
        out = '[' + content + ']{'
        for(let i = 0; i < parseStyle.length; i++) {
          if(node.style[parseStyle[i]] !== '') {
            out += parseStyle[i] + ':' + node.style[parseStyle[i]] + ';'
          }
        }
        if(node.localName === 'p') {
          out += '}'
        } else {
          out += '|' + node.localName + '}'
        }
      }
      return out
    }
  })
  return turndownService.turndown(htmlVal)
}
