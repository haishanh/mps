'use strict';

const diff = require('./diff');

test('one', () => {
  const o1 = {
    a: 3,
    b: 'b'
  };
  const o2 = {
    a: 3
  };
  const ret = diff(o1, o2);
  expect({ b: 'b' }).toEqual(ret);
});

test('one2', () => {
  const o1 = {
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
  const o2 = {
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
          bbaa: 'barx'
        }
      }
    }
  };
  const ret = diff(o1, o2);
  expect({ 'b.bb.bba.bbaa': 'bar' }).toEqual(ret);
});

test('one3', () => {
  const o1 = {};
  const o2 = {
    a: 3
  };
  const ret = diff(o1, o2);
  expect({ '': {} }).toEqual(ret);
});

test('one4', () => {
  const o = { a: { b: { c: 3 } } };

  const o1 = {
    a: [o]
  };
  const o2 = {
    a: [o]
  };
  const ret = diff(o1, o2);
  expect({}).toEqual(ret);
});
