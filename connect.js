import { subscribe, getState, logger } from './store';
import diff from './shallowEqualFilter';

const hasOwnProperty = Object.prototype.hasOwnProperty;

// lodash isEmpty simplified
function isEmpty(value) {
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

const isFunction = func => typeof func === 'function';

function connect(
  lifecycleFnNames,
  methodsRoot,
  mapStateToData,
  { setDataHook } = {}
) {
  // eslint-disable-next-line camelcase
  function __internal__updateData(actionName) {
    const nextData = mapStateToData.call(null, getState(), this.data);
    // referential comparison
    if (this.data !== nextData) {
      // const filtered = nextData;
      const filtered = diff(nextData, this.data, collect);
      if (isEmpty(filtered)) return;

      // logging
      logger &&
        logger({
          action: this.is + ' - ' + actionName,
          changed: filtered
        });

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
    let injections;
    if (methodsRoot) {
      injections = {
        [methodsRoot]: {
          ...config[methodsRoot],
          __internal__updateData,
          __internal__subscribeToStore
        }
      };
    } else {
      injections = {
        __internal__updateData,
        __internal__subscribeToStore
      };
    }

    // lifecycles
    injections[init] = function(...args) {
      this.__internal__subscribeToStore();
      // it's not allowed to call setData in Component#created
      if (init !== 'created') {
        // flush state
        this.__internal__updateData(this.is + ' ' + init);
      }
      // call the original function if there is one
      if (isFunction(config[init])) {
        return config[init].apply(this, args);
      }
    };
    injections[show] = function(...args) {
      this.__internal__subscribeToStore();
      // flush state
      this.__internal__updateData(this.is + ' ' + show);
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
    undefined,
    a,
    b
  );
}

function connectComponent(a, b) {
  return connect(
    componentLifecycleFnNames,
    'methods',
    a,
    b
  );
}

export { connectPage, connectComponent };
