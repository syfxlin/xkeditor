import marked from "marked";
import turndown from "turndown";
var turndownGfm = require("turndown-plugin-gfm");

export function toHtml(markdownVal) {
  var markedRenderer = new marked.Renderer()
  markedRenderer.paragraph = function(text) {
    if(/\$\$(.*)\$\$/g.test(text)) {
      text = text.replace(/(\$\$([^\$]*)\$\$)/g, function($1, $2) {
        return $2.replace(/\$/g, "")
      })
    }
    return text
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