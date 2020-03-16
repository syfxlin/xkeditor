// "use strict";
import marked from "marked";
import turndown from "turndown";
import turndownGfm from "turndown-plugin-gfm";
import Prism from "prismjs";
import EmojiConvertor from "emoji-js";
import store from "../store";

var emoji = new EmojiConvertor();
emoji.replace_mode = "unified";

var tocContent = [];

export function getTocHtml() {
  var html = getTocHtmlTree(0, "");
  window.$toc = html;
  return html;
}

function getTocHtmlTree(index, str) {
  if (index >= tocContent.length) return str;
  if (index == 0) {
    str += "";
  } else if (tocContent[index].level > tocContent[index - 1].level) {
    for (
      let i = tocContent[index - 1].level;
      i < tocContent[index].level;
      i++
    ) {
      str += "<ul>";
    }
  } else if (tocContent[index].level < tocContent[index - 1].level) {
    for (
      let i = tocContent[index].level;
      i < tocContent[index - 1].level;
      i++
    ) {
      str += "</ul></li>";
    }
  } else {
    str += "</li>";
  }
  var tocUrl = tocContent[index].title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9-]/g, "");
  if (store.state.setting.xkSetting.scrollMode === "anchor") {
    tocUrl = "#" + tocUrl;
  } else {
    tocUrl = "javascript:sta('" + tocUrl + "');";
  }
  str += `<li><i class="toc-icon"></i><a href="${tocUrl}">${tocContent[index].title}</a>`;
  return getTocHtmlTree(index + 1, str);
}

var Languages = {
  html: "HTML",
  xml: "XML",
  svg: "SVG",
  mathml: "MathML",
  css: "CSS",
  clike: "C-like",
  js: "JavaScript",
  abap: "ABAP",
  abnf: "Augmented Backus–Naur form",
  apacheconf: "Apache Configuration",
  apl: "APL",
  arff: "ARFF",
  asciidoc: "AsciiDoc",
  adoc: "AsciiDoc",
  asm6502: "6502 Assembly",
  aspnet: "ASP.NET (C#)",
  autohotkey: "AutoHotkey",
  autoit: "AutoIt",
  bash: "Bash",
  shell: "Bash",
  basic: "BASIC",
  bnf: "Backus–Naur form",
  rbnf: "Routing Backus–Naur form",
  csharp: "C#",
  dotnet: "C#",
  cpp: "C++",
  cil: "CIL",
  coffee: "CoffeeScript",
  cmake: "CMake",
  csp: "Content-Security-Policy",
  "css-extras": "CSS Extras",
  django: "Django/Jinja2",
  jinja2: "Django/Jinja2",
  dockerfile: "Docker",
  ebnf: "Extended Backus–Naur form",
  ejs: "EJS",
  erb: "ERB",
  fsharp: "F#",
  gcode: "G-code",
  gedcom: "GEDCOM",
  glsl: "GLSL",
  gml: "GameMaker Language",
  gamemakerlanguage: "GameMaker Language",
  graphql: "GraphQL",
  hs: "Haskell",
  hcl: "HCL",
  http: "HTTP",
  hpkp: "HTTP Public-Key-Pins",
  hsts: "HTTP Strict-Transport-Security",
  ichigojam: "IchigoJam",
  inform7: "Inform 7",
  javadoc: "JavaDoc",
  javadoclike: "JavaDoc-like",
  javastacktrace: "Java stack trace",
  jsdoc: "JSDoc",
  "js-extras": "JS Extras",
  json: "JSON",
  jsonp: "JSONP",
  json5: "JSON5",
  latex: "LaTeX",
  emacs: "Lisp",
  elisp: "Lisp",
  "emacs-lisp": "Lisp",
  lolcode: "LOLCODE",
  md: "Markdown",
  "markup-templating": "Markup templating",
  matlab: "MATLAB",
  mel: "MEL",
  n1ql: "N1QL",
  n4js: "N4JS",
  n4jsd: "N4JS",
  "nand2tetris-hdl": "Nand To Tetris HDL",
  nasm: "NASM",
  nginx: "nginx",
  nsis: "NSIS",
  objectivec: "Objective-C",
  ocaml: "OCaml",
  opencl: "OpenCL",
  parigp: "PARI/GP",
  objectpascal: "Object Pascal",
  php: "PHP",
  phpdoc: "PHPDoc",
  "php-extras": "PHP Extras",
  plsql: "PL/SQL",
  powershell: "PowerShell",
  properties: ".properties",
  protobuf: "Protocol Buffers",
  py: "Python",
  q: "Q (kdb+ database)",
  jsx: "React JSX",
  tsx: "React TSX",
  renpy: "Ren'py",
  rest: "reST (reStructuredText)",
  rb: "Ruby",
  sas: "SAS",
  sass: "Sass (Sass)",
  scss: "Sass (Scss)",
  sql: "SQL",
  soy: "Soy (Closure Template)",
  tap: "TAP",
  toml: "TOML",
  tt2: "Template Toolkit 2",
  ts: "TypeScript",
  "t4-cs": "T4 Text Templates (C#)",
  t4: "T4 Text Templates (C#)",
  "t4-vb": "T4 Text Templates (VB)",
  "t4-templating": "T4 templating",
  vbnet: "VB.Net",
  vhdl: "VHDL",
  vim: "vim",
  "visual-basic": "Visual Basic",
  vb: "Visual Basic",
  wasm: "WebAssembly",
  wiki: "Wiki markup",
  xeoracube: "XeoraCube",
  xojo: "Xojo (REALbasic)",
  xquery: "XQuery",
  yaml: "YAML",
  yml: "YAML"
};

var Colors = {
  gray: "rgba(206, 205, 202, 0.5)",
  brown: "rgba(155, 154, 151, 0.4)",
  orange: "rgba(245, 93, 0, 0.2)",
  yellow: "rgba(233, 168, 0, 0.2)",
  green: "rgba(0, 135, 107, 0.2)",
  blue: "rgba(0, 120, 223, 0.2)",
  purple: "rgba(103, 36, 222, 0.2)",
  pink: "rgba(221, 0, 129, 0.2)",
  red: "rgba(255, 0, 26, 0.2)"
};

// 公用解析器
function commonParse(text, isExport = false) {
  // :emoji:
  if (!isExport) {
    text = text.replace(/(:.*:)/g, function($1, $2) {
      return emoji.replace_colons($2);
    });
  }
  // [Text]{style|label}
  // [Text]{color,bg_color}
  text = text.replace(
    // eslint-disable-next-line no-useless-escape
    /(\[([^\[\]]*)]{([^{}|]*)(\|span|\|p|\|font|\||)})/g,
    function($1, $2, $3, $4, $5) {
      if ($3 === "graff") {
        return `[graff]{${$4}}`;
      }
      if ($5 == "|" || $5 == "" || $5 == null) {
        $5 = "span";
      } else {
        $5 = $5.substring(1);
      }
      if ($4.indexOf(":") === -1) {
        let color =
          $4.indexOf(",") === -1 && Colors[$4]
            ? ["rgb(55, 53, 47)", Colors[$4]]
            : $4.split(",");
        $4 = `color: ${color[0]}; background-color: ${color[1]}`;
      }
      return `<${$5} style="${$4}">${$3}</${$5}>`;
    }
  );
  return text;
}

function detailsParse(text) {
  // details summary [det :text][/det]
  return text.replace(/\[(|\/)(det|details)([^\]]*)\]/g, function(
    $1,
    $2,
    $3,
    $4
  ) {
    if ($2 !== "/" && $4.substring(0, 2) === " :") {
      $4 = `<summary>${$4.substring(2)}</summary>\n`;
    }
    return `<${$2}details>${$4}`;
  });
}

function mediaParse(href, title, text) {
  let options = "controls ";
  if (title && title.charAt(0) === ":") {
    let optTemp = "";
    [optTemp, title] = title.substring(1).split("|");
    for (const opt of optTemp.split(";")) {
      if (opt.indexOf("=") === -1) {
        options += opt + " ";
      } else {
        options += opt.replace("=", '="') + '"';
      }
    }
  }
  // ![vid alt](src ":option|title")
  if (/^(vid|video)/g.test(text)) {
    text = text.replace(/^(vid|video)(| )/g, "");
    return `<video src="${href}" ${
      title ? 'title="' + title + '"' : ""
    } ${options}>${text}</video>`;
  }
  // ![aud alt](src ":option|title")
  if (/^(aud|audio)/g.test(text)) {
    text = text.replace(/^(aud|audio)(| )/g, "");
    return `<audio src="${href}" ${
      title ? 'title="' + title + '"' : ""
    } ${options}>${text}</audio>`;
  }
  // ![alt](src ":option|title")
  return `<img src="${href}" ${
    title ? 'title="' + title + '"' : ""
  } ${options} alt="${text}" />`;
}

function incParse(href, title, text, render = null) {
  let type = text.replace(/^(inc|include)=/g, "");
  let options = "";
  if (title && title.charAt(0) === ":") {
    let optTemp = "";
    [optTemp, title] = title.substring(1).split("|");
    for (const opt of optTemp.split(";")) {
      if (opt.indexOf("=") === -1) {
        options += opt + " ";
      } else {
        options += opt.replace("=", '="') + '"';
      }
    }
  }
  if (type === "iframe") {
    return `<iframe src="${href}" ${
      title ? 'title="' + title + '"' : ""
    } ${options}></iframe>`;
  }
  if (type === "md" || type === "markdown") {
    // TODO: async load
    return toHtml("# this is embed", isFull);
  }
  if (type === "code" && render !== null) {
    // TODO: async load
    return render.code('console.log("This is embed")', "javascript");
  }
}

function htmlRestore(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/(<br \/>|<br>)/g, "\n");
}

export function toExport(val) {
  // [Text]{style|label}
  // [Text]{color,bg_color}
  val = commonParse(val, true);
  // details summary [det :text][/det]
  val = detailsParse(val);
  // > :color,bg_color text
  // TODO: 待定
  // ![vid alt](src ":option|title")
  // ![aud alt](src ":option|title")
  // ![alt](src ":option|title")
  val = val.replace(/!\[([^\]]*)\]\(([^)"]*)[ ]*["]?([^)"]*)["]?\)/g, function(
    $1,
    $2,
    $3,
    $4
  ) {
    if ($4.indexOf("|") === -1 && !/(video|vid|audio|aud)/g.test($2)) {
      return `![${$4}](${$3}${$4 ? '"' + $4 + '"' : ""})`;
    }
    return mediaParse($3, $4, $2);
  });
  // [inc=type](href ":option|title")
  val = val.replace(
    /[^!]\[([^\]]*)\]\(([^)"]*)[ ]*["]?([^)"]*)["]?\)/g,
    function($1, $2, $3, $4) {
      if (/^(inc|include)=/g.test($2)) {
        return incParse($3, $4, $2, new marked.Renderer());
      }
      return `[${$4}](${$3}${$4 ? '"' + $4 + '"' : ""})`;
    }
  );
  return val;
}

export function toHtml(val, isFull) {
  tocContent = [];
  var markedRenderer = new marked.Renderer();
  markedRenderer.paragraph = function(text) {
    var args = arguments;
    text = commonParse(text);
    // [graff]{hash}
    text = text.replace(/\[graff]{(.*)}/g, function($1, $2) {
      if (!isFull) {
        return text;
      } else {
        if (store.state.graffBoard.content[$2]) {
          let index = store.state.graffBoard.content[$2].indexOf("|");
          let size = store.state.graffBoard.content[$2]
            .substring(0, index)
            .split(" ")
            .map(item => parseFloat(item));
          return `<svg class="graffiti" viewBox="${size[0]} ${size[1]} ${
            size[2]
          } ${size[3]}" data-hash="${$2}">${store.state.graffBoard.content[
            $2
          ].substring(index + 1)}</svg>`;
        } else {
          return `<svg class="graffiti" data-hash="${$2}"></svg>`;
        }
      }
    });
    // [TOC]
    // [TOC :fold]
    text = text.replace(/\[TOC([^\]]*)\]/g, function($1, $2) {
      return `<div class="toc ${$2 === " :fold" ? "default-fold" : ""}"></div>`;
    });
    text = detailsParse(text);
    args[0] = text;
    return marked.Renderer.prototype.paragraph.apply(this, args);
  };
  markedRenderer.heading = function(title, level) {
    var args = arguments;
    tocContent.push({ title: title, level: level });
    args[0] = commonParse(title);
    return marked.Renderer.prototype.heading.apply(this, args);
  };
  markedRenderer.blockquote = function(quote) {
    var args = arguments;
    quote = commonParse(quote);
    // > :color,bg_color text
    if (/^(|<p>):([^ ]*)/g.test(quote)) {
      return quote.replace(/^(|<p>):([^ ]*) (.*)/g, function($1, $2, $3, $4) {
        let [color, bg_color] = $3.split(",");
        return `<div class="notebox" style="color: ${color};background-color: ${bg_color}">${$2 + $4}</div>`;
      });
    }
    args[0] = quote;
    return marked.Renderer.prototype.blockquote.apply(this, args);
  };
  markedRenderer.image = function(href, title, text) {
    return mediaParse(href, title, text);
    // return marked.Renderer.prototype.image.apply(this, args);
  };
  markedRenderer.link = function(href, title, text) {
    var args = arguments;
    // [inc=type](href ":option|title")
    if (/^(inc|include)=/g.test(text)) {
      return incParse(href, title, text, markedRenderer);
    }
    return marked.Renderer.prototype.link.apply(this, args);
  };
  markedRenderer.codespan = function(code) {
    var args = arguments;
    if (/(.*) {([^}]*)}$/g.test(code)) {
      return code.replace(/(.*) {([^}]*)}$/g, function($1, $2, $3) {
        if ($3.indexOf(":") === -1) {
          let color =
            $3.indexOf(",") === -1 && Colors[$3]
              ? ["rgb(55, 53, 47)", Colors[$3]]
              : $3.split(",");
          $3 = `color: ${color[0]}; background-color: ${color[1]}`;
        }
        return `<code style="${$3}">${$2}</code>`;
      });
    }
    args[0] = code;
    return marked.Renderer.prototype.codespan.apply(this, args);
  };
  markedRenderer.code = function(code, language) {
    if (language === "math" || language === "tex") {
      return `<pre class="xkeditor-tex">\`\`\`${language}\n${code}\n\`\`\`</pre>`;
    }
    if (/flow(TB|BT|RL|LR|TD)$/.test(language)) {
      return `<pre class="xkeditor-mermaid">graph ${language.substring(
        language.length - 2
      )}\n${code}</pre>`;
    }
    if (language === "seq") {
      return `<pre class="xkeditor-mermaid">sequenceDiagram\n${code}</pre>`;
    }
    if (language === "gantt") {
      return `<pre class="xkeditor-mermaid">gantt\n${code}</pre>`;
    }
    if (language === "mermaid") {
      return `<pre class="xkeditor-mermaid">${code}</pre>`;
    }
    var runExt = "";
    if (language.indexOf("run-") === 0) {
      language = language.substring(4);
      runExt = `
        <button language="${language}" class="run-code-btn">运行</button>\
        <button class="reset-code-btn">重置</button>
        <button class="input-code-btn">输入</button>
        <div class="run-code-input">
          <textarea></textarea>
        </div>
        <div class="run-code-output">
          <code></code>
        </div>
      `;
      if (language === "node") {
        language = "javascript";
      }
      if (language === "python2") {
        language = "python";
      }
    }
    if (isFull) {
      var langTitle =
        Languages[language] ||
        (
          language.substring(0, 1).toUpperCase() + language.substring(1)
        ).replace(/s(?=cript)/, "S");
      var lineNums = "<span></span>".repeat(code.split("\n").length);
      if (
        Prism.languages[language] != null &&
        Prism.languages[language] != undefined
      ) {
        return (
          '<div class="code-toolbar"><pre class="line-numbers language-' +
          language +
          '"><code class="language-' +
          language +
          '">' +
          Prism.highlight(
            code,
            Prism.languages[language],
            Prism.languages[language]
          ) +
          '<span aria-hidden="true" class="line-numbers-rows">' +
          lineNums +
          '</code></pre><div class="toolbar"><div class="toolbar-item"><span>' +
          langTitle +
          "</span></div></div></div>" +
          runExt
        );
      } else {
        return (
          '<pre class="line-numbers language- language-undefined"><code class="language- language-undefined">' +
          code +
          '<span aria-hidden="true" class="line-numbers-rows">' +
          lineNums +
          "</code></pre>"
        );
      }
    }
    return marked.Renderer.prototype.code.apply(this, arguments);
  };

  marked.setOptions({
    langPrefix: "line-numbers language-",
    renderer: markedRenderer
  });
  return marked(val);
}

export function toMarkdown(htmlVal, styleSwitch = true) {
  var turndownService = new turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  });
  turndownService.keep(["iframe", "style", "script", "title"]);
  turndownService.use(turndownGfm.gfm);
  turndownService.addRule("mermaid", {
    filter: function(node) {
      return (
        node.nodeName === "PRE" && node.classList.contains("xkeditor-mermaid")
      );
    },
    replacement: function(content, node) {
      return "\n\n```mermaid\n" + htmlRestore(node.innerHTML) + "\n```\n";
    }
  });
  turndownService.addRule("math", {
    filter: function(node) {
      return node.nodeName === "PRE" && node.classList.contains("xkeditor-tex");
    },
    replacement: function(content, node) {
      return htmlRestore(node.innerHTML);
    }
  });
  turndownService.addRule("prismjs", {
    filter: function(node) {
      return (
        node.nodeName === "PRE" &&
        node.children.length > 0 &&
        node.children[0].nodeName === "CODE" &&
        node.children[0].classList.length > 0
      );
    },
    replacement: function(content, node) {
      var lang = node.children[0].classList[1].substring(9);
      return "\n```" + lang + "\n" + htmlRestore(content) + "\n```\n\n";
    }
  });
  turndownService.addRule("sup", {
    filter: function(node) {
      return node.nodeName === "SUP";
    },
    replacement: function(content, node) {
      return "<sup>" + content + "</sup>";
    }
  });
  turndownService.addRule("sub", {
    filter: function(node) {
      return node.nodeName === "SUB";
    },
    replacement: function(content, node) {
      return "<sub>" + content + "</sub>";
    }
  });
  if (styleSwitch) {
    turndownService.addRule("haveStyle", {
      filter: function(node) {
        return (
          (node.nodeName === "FONT" ||
            node.nodeName === "P" ||
            node.nodeName === "SPAN") &&
          node.getAttribute("style") !== null
        );
      },
      replacement: function(content, node) {
        var parseStyle = [
          "color",
          "font-size",
          "padding-left",
          "background-color",
          "text-align",
          "font-family"
        ];
        var out = node.outerHTML;
        if (node.style.textDecoration === "underline") {
          out = "<u>" + content + "</u>";
        } else if (node.style.textDecoration === "line-through") {
          out = "~" + content + "~";
        } else {
          out = "[" + content + "]{";
          for (let i = 0; i < parseStyle.length; i++) {
            if (node.style[parseStyle[i]] !== "") {
              out += parseStyle[i] + ":" + node.style[parseStyle[i]] + ";";
            }
          }
          if (node.localName === "span") {
            out += "}";
          } else {
            out += "|" + node.localName + "}";
          }
        }
        return out;
      }
    });
  }
  return turndownService.turndown(htmlVal);
}
