'use strict';

const {
  init,
  dispatch,
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

test('dispatch', async () => {
  let unsubscribe;
  const initialState = {
    a: 'a',
    b: {}
  };
  init(initialState);

  let count = 0;
  unsubscribe = subscribe(x => {
    console.log(x);
    switch (++count) {
      case 1:
        expect(x).toBe('change a');
        expect(getState().a).toBe('aa');
        expect(getState().b).toBe(initialState.b);
        break;
      case 2:
        expect(x).toBe('change a again');
        expect(getState().a).toBe('aaa');
        expect(getState().b).toBe(initialState.b);
        break;
    }
  });

  dispatch(s => {
    s.a = 'aa';
  }, 'change a');

  dispatch(s => {
    s.a = 'aaa';
  }, 'change a again');

  unsubscribe();
});
