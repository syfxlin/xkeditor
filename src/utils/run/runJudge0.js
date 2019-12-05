import axios from "axios";
import store from "../../store";
export default function runJudge0(code, languageId, input, outputEle) {
  outputEle.innerHTML = '<span class="process"># Processing...</span>';
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
              outputEle.innerHTML =
                '<span class="success"># Accepted Time: ' +
                res.data.time +
                " Memory: " +
                res.data.memory +
                "KB</span>\n" +
                "> " +
                res.data.stdout.replace(/\n/g, "\n  ");
              return;
            }
            if (
              (count < 30 && res.data.status.id === 1) ||
              res.data.status.id === 2
            ) {
              setTimeout(fetchOut, 500);
              return;
            } else {
              outputEle.innerHTML =
                '<span class="error"># ' +
                res.data.status.description +
                " Time: " +
                res.data.time +
                " Memory: " +
                res.data.memory +
                'KB</span>\n<span class="o1">compile_output: </span>' +
                res.data.compile_output +
                '\n<span class="o1">stderr: </span>' +
                res.data.stderr;
            }
          })
          .catch(err => {
            clearTimeout(timer);
            outputEle.innerHTML = '<span class="error"># ' + err + "</span>";
          });
      };
      fetchOut();
    });
}
