import runJS from "./runJS";

export default function runCode(code, lang, output) {
  if (lang === "javascript" || lang === "js") {
    runJS(code, output);
  }
}
