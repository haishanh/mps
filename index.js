'use strict';

const {
  immer,
  init,
  subscribe,
  createAction,
  getState,
  callListeners
} = require('./store');

const { connectPage, connectComponent } = require('./connect');

module.exports = {
  immer,
  init,
  subscribe,
  createAction,
  getState,
  callListeners,
  connectPage,
  connectComponent
};
