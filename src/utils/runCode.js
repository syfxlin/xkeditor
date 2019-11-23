import runJS from "./run/runJS";
import runJudge0 from "./run/runJudge0";

const langList = {
  node: 29,
  c: 4,
  cpp: 10,
  csharp: 16,
  go: 22,
  java: 26,
  python: 34,
  ruby: 38
};

export default function runCode(code, lang, input, outputEle) {
  if (lang === "javascript" || lang === "js") {
    runJS(code, outputEle);
  } else {
    runJudge0(code, langList[lang], input, outputEle);
  }
}
