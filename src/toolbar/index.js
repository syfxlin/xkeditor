import Vue from "vue";
import state from "../store/state";
import heading from "./heading";
import bold from "./bold";
import italic from "./italic";
import underline from "./underline";
import strikethrough from "./strikethrough";
import mark from "./mark";
import quote from "./quote";
import code from "./code";
import sup from "./sup";
import sub from "./sub";
import katex from "./katex";
import mermaid from "./mermaid";
import list from "./list";
import minus from "./minus";
import table from "./table";
import time from "./time";
import link from "./link";
import image from "./image";
import video from "./video";
import graff from "./graff";
import toLine from "./toLine";
import search from "./search";
import typewriter from "./typewriter";
import toc from "./toc";
import preview from "./preview";
import $switch from "./switch";
import edit from "./edit";
import storage from "./storage";
import other from "./other";
import setting from "./setting";

export const toolbar = Vue.observable({
  "|": {
    icon: "|"
  },
  ...heading,
  bold,
  italic,
  underline,
  strikethrough,
  mark,
  quote,
  code,
  sup,
  sub,
  ...katex,
  ...mermaid,
  ...list,
  minus,
  table,
  time,
  link,
  image,
  video,
  graff,
  toLine,
  search,
  typewriter,
  toc,
  ...preview,
  ...$switch,
  ...edit,
  ...storage,
  ...other,
  setting
});

let watchers = Object.values(toolbar).filter(item => item.watcher);

export let selects = null;
export let watcher = Vue.observable({});

for (const item of watchers) {
  watcher[item.watcher.obj] = {
    handler: item.watcher.handler.bind(item),
    deep: item.watcher.deep
  };
}

export function tbWatcher() {
  selects = Vue.observable(state.setting.aceSetting.toolbar.split(" "));
}

tbWatcher();
