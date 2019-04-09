import marked from "marked"
import turndown from "turndown"
var turndownGfm = require("turndown-plugin-gfm")
import katex from "katex"
import "katex/dist/katex.min.css"

export function toHtml(markdownVal) {
  var markedRenderer = new marked.Renderer()
  markedRenderer.paragraph = function(text) {
    //Tex替换
    if(/\$\$(.*)\$\$/g.test(text)) {
      //eslint-disable-next-line
      text = text.replace(/(\$\$([^\$]*)\$\$)/g, function($1, $2) {
        let data = $2.replace(/\$/g, "")
        var html = katex.renderToString(data, {
          throwOnError: false
        })
        return html
      })
    }
    return text
  }
  markedRenderer.code = function(code, language) {
    if(language === 'math' || language === "tex") {
      var html = katex.renderToString(code, {
        throwOnError: false
      })
      return html
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