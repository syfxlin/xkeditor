import runJS from "./run/runJS";
import runJudge0 from "./run/runJudge0";
import store from "../store";

export default function runCode(code, lang, input, outputEle) {
  if (lang === "javascript" || lang === "js") {
    runJS(code, outputEle);
  } else {
    runJudge0(
      code,
      store.state.setting.xkSetting.runCodeLangList[lang],
      input,
      outputEle
    );
  }
}
