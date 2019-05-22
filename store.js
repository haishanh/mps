'use strict';

const immer = require('immer');
const { produce } = immer;

let state;
let listeners = [];

function getState() {
  return state;
}

function callListeners(fn) {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i](fn);
  }
}

function createAction(fn, shouldCallListeners = true) {
  return () => {
    state = produce(getState(), fn);
    shouldCallListeners && callListeners(fn);
  };
}

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

function init(initialState) {
  state = initialState;
}

module.exports = {
  immer,
  init,
  subscribe,
  createAction,
  getState,
  callListeners
};
