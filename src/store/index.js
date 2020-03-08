import state from "./state";
import actions from "./actions";

window.isMobile = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
  navigator.userAgent
);

window.toggleToc = ele => {
  ele.classList.toggle("active");
  ele.nextElementSibling.nextElementSibling.classList.toggle("active");
};

const store = {
  state,
  actions
};

export const mapState = states => {
  let ret = {};
  if (states instanceof Array) {
    for (let i = 0; i < states.length; i++) {
      ret[states[i]] = {
        get() {
          return store.state[states[i]];
        },
        set(value) {
          store.state[states[i]] = value;
        }
      };
    }
  } else {
    for (const key in states) {
      if (states[key] instanceof Function) {
        ret[key] = {
          get() {
            return states[key](store.state);
          }
        };
      } else {
        ret[key] = {
          get() {
            return store.state[states[key]];
          },
          set(value) {
            store.state[states[key]] = value;
          }
        };
      }
    }
  }
  return ret;
};

export const mapActions = actions => {
  let ret = {};
  if (actions instanceof Array) {
    for (let i = 0; i < actions.length; i++) {
      ret[actions[i]] = store.actions[actions[i]];
    }
  } else {
    for (const key in actions) {
      if (actions[key] instanceof Function) {
        ret[key] = actions[key](store.actions);
      } else {
        ret[key] = store.actions[actions[key]];
      }
    }
  }
  return ret;
};

export default store;
