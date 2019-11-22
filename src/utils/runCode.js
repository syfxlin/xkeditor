import runJS from "./run/runJS";

export default function runCode(code, lang, output) {
  if (lang === "javascript" || lang === "js") {
    runJS(code, output);
  }
}
