import runJS from "./run/runJS";
import runJudge0 from "./run/runJudge0";

const langList = {
  c: 1,
  cpp: 2,
  bash: 3,
  csharp: 4,
  go: 5,
  java: 6,
  node: 7,
  php: 8,
  python: 9,
  python2: 10,
  ruby: 11,
  rust: 12,
  scala: 13,
  typescript: 14
};

export default function runCode(code, lang, input, outputEle) {
  if (lang === "javascript" || lang === "js") {
    runJS(code, outputEle);
  } else {
    runJudge0(code, langList[lang], input, outputEle);
  }
}
