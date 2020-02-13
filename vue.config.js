module.exports = {
  configureWebpack: {
    externals: {
      "ace-builds": "ace",
      marked: "marked",
      turndown: "TurndownService",
      "turndown-plugin-gfm": "turndownPluginGfm",
      prismjs: "Prism",
      "emoji-js": "EmojiConvertor",
      "tinymce/tinymce": "tinyMCE",
      mermaid: "mermaid",
      katex: "katex",
      "katex/dist/contrib/auto-render": "renderMathInElement"
    }
  }
};
