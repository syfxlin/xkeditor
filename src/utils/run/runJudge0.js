import axios from "axios";
import store from "../../store";
export default function runJudge0(code, languageId, input, outputEle) {
  outputEle.textContent = "Loading";
  axios
    .post(
      store.state.setting.xkSetting.judge0API +
        "/submissions?base64_encoded=false&wait=false",
      {
        source_code: code,
        language_id: languageId,
        stdin: input
      }
    )
    .then(res => {
      return res.data.token;
    })
    .then(token => {
      let timer = null;
      let count = 0;
      let fetchOut = () => {
        axios
          .get(
            store.state.setting.xkSetting.judge0API +
              "/submissions/" +
              token +
              "?base64_encoded=false"
          )
          .then(res => {
            count++;
            if (res.data.status.id == 3) {
              outputEle.textContent =
                "> " + res.data.stdout.replace("\n", "\n> ");
              return;
            }
            if (
              count < 20 &&
              (res.data.status.id === 1 || res.data.status.id === 2)
            ) {
              fetchOut();
              return;
            }
          })
          .catch(err => {
            clearInterval(timer);
            outputEle.textContent = err;
          });
      };
      fetchOut();
    });
}
