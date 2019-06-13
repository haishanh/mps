'use strict';

const { subscribe, getState } = require('./store');
const diff = require('./diff');

const isFunction = func => typeof func === 'function';

function connect(lifecycleFnNames, mapStateToData, { setDataHook } = {}) {
  // eslint-disable-next-line camelcase
  function __internal__updateData(actionName) {
    const nextData = mapStateToData.call(null, getState(), this.data);
    // referential comparison
    if (this.data !== nextData) {
      // const filtered = nextData;
      const filtered = diff(nextData, this.data);

      // logging
      if (process.env.NODE_ENV !== 'production') {
        if (actionName) {
          console.log('action:', actionName, 'changes:', filtered);
        }
      }

      this.setData(filtered, () => {
        setDataHook && setDataHook.call(this, filtered);
      });
    }
  }

  // eslint-disable-next-line camelcase
  function __internal__subscribeToStore() {
    if (this.unsubscribe) return;
    this.unsubscribe = subscribe(actionName => {
      this.__internal__updateData(actionName);
    });
  }

  const { init, show, hide } = lifecycleFnNames;

  return config => {
    const injections = {};

    // lifecycles
    injections[init] = function(...args) {
      this.__internal__subscribeToStore();
      // it's not allowed to call setData in Component#created
      if (init !== 'created') {
        // flush state
        this.__internal__updateData();
      }
      // call the original function if there is one
      if (isFunction(config[init])) {
        return config[init].apply(this, args);
      }
    };
    injections[show] = function(...args) {
      this.__internal__subscribeToStore();
      // flush state
      this.__internal__updateData();
      // call the original function if there is one
      if (isFunction(config[show])) {
        return config[show].apply(this, args);
      }
    };

    hide.forEach(fnName => {
      injections[fnName] = function() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
        if (isFunction(config[fnName])) {
          config[fnName].call(this);
        }
      };
    });

    return {
      __internal__updateData,
      __internal__subscribeToStore,
      ...config,
      ...injections
    };
  };
}

const pageLifecycleFnNames = {
  init: 'onLoad',
  show: 'onShow',
  hide: ['onHide', 'onUnload']
};

const componentLifecycleFnNames = {
  init: 'created',
  show: 'attached',
  hide: ['detached']
};

function connectPage(a, b) {
  return connect(
    pageLifecycleFnNames,
    a,
    b
  );
}

function connectComponent(a, b) {
  return connect(
    componentLifecycleFnNames,
    a,
    b
  );
}

module.exports = {
  connectPage,
  connectComponent
};
