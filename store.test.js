'use strict';

const {
  init,
  createAction,
  subscribe,
  getState,
  callListeners
} = require('./store');
const sleep = t => new Promise(r => setTimeout(r, t));

test('store', async () => {
  let unsubscribe;
  const initialState = {
    a: {
      aa: {
        aaa: {
          aaaa: 'hello'
        },
        aab: {
          aaba: 10
        }
      }
    },
    b: {
      ba: {
        baa: 'foo'
      },
      bb: {
        bba: {
          bbaa: 'bar'
        }
      }
    }
  };

  init(initialState);

  // normal example
  const a1 = createAction(draft => {
    draft.b.ba.baa = 'fo';
  });
  unsubscribe = subscribe(() => {
    const s = getState();
    expect(initialState.b.ba.baa).toBe('foo');
    expect(s.b.ba.baa).toBe('fo');
  });
  a1();
  unsubscribe();

  // async example
  const a2 = async () => {
    createAction(draft => {
      draft.b.ba.baa = 'f';
    }, false)();
    await sleep(50);
    createAction(draft => {
      draft.b.bb.bba.bbaa = 'b';
    })();
  };
  let called = false;
  unsubscribe = subscribe(() => {
    called = true;
    const s = getState();
    expect(s.b.ba.baa).toBe('f');
    expect(s.b.bb.bba.bbaa).toBe('b');
  });
  await a2();
  expect(called).toBe(true);
  unsubscribe();
});
