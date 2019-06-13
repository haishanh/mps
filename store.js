import produce from 'immer';

let state;
let listeners = [];

function getState() {
  return state;
}

function callListeners(actionName) {
  for (let i = 0; i < listeners.length; i++) {
    listeners[i](actionName);
  }
}

function createAction(fn, shouldCallListeners = true) {
  return () => {
    state = produce(getState(), fn);
    shouldCallListeners && callListeners(fn.name);
  };
}

function dispatch(fn, actionName = 'anonymous action') {
  state = produce(getState(), fn);
  callListeners(actionName);
}

function subscribe(listener) {
  listeners.push(listener);
  return function unsubscribe() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

let logger;
function init(initialState, _logger) {
  state = initialState;
  if (_logger) logger = _logger;
}

export {
  produce,
  init,
  logger,
  subscribe,
  createAction,
  dispatch,
  getState,
  callListeners
};
