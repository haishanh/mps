'use strict';

const {
  immer,
  init,
  subscribe,
  dispatch,
  createAction,
  getState,
  callListeners
} = require('./store');

const { connectPage, connectComponent } = require('./connect');

module.exports = {
  immer,
  init,
  subscribe,
  dispatch,
  createAction,
  getState,
  callListeners,
  connectPage,
  connectComponent
};
