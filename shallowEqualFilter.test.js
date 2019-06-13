import filter from './shallowEqualFilter';

test('001', () => {
  const p = {};
  const n = {};
  const r = filter(n, p);
  expect(r).toEqual({});
});

test('002', () => {
  const p = {};
  const n = {
    a: 'a'
  };
  const r = filter(n, p);
  expect(r).toEqual({ a: 'a' });
});

test('003', () => {
  const p = {};
  const n = {
    a: 'a',
    b: {
      b0: {
        b00: {
          b000: 'b000'
        }
      },
      b1: {
        b11: 'b11'
      },
      b2: 'b2'
    }
  };
  const r = filter(n, p);
  expect(r).toEqual({
    a: 'a',
    b: {
      b0: {
        b00: {
          b000: 'b000'
        }
      },
      b1: {
        b11: 'b11'
      },
      b2: 'b2'
    }
  });
  expect(r.b).toBe(n.b);
});

test('004', () => {
  const p = {
    a: 'a',
    b: {
      b0: {
        b00: {
          b000: 'b000'
        }
      },
      b1: { b11: 'b11' },
      b2: 'b2'
    }
  };
  const n = {
    a: 'a',
    b: {
      ...p.b,
      b0: {
        b00: {
          b000: 'b000--change'
        }
      }
    }
  };
  const r = filter(n, p);
  expect(r).toEqual({
    b: {
      b0: {
        b00: {
          b000: 'b000--change'
        }
      },
      b1: { b11: 'b11' },
      b2: 'b2'
    }
  });
  expect(r.b).toBe(n.b);
});

test('005', () => {
  const p = {
    a: 'a',
    b: 'b',
    c: { c0: 'c0' },
    d: 'd'
  };
  const n = {
    ...p,
    b: 'b--changed'
  };
  const r = filter(n, p);
  expect(r).toEqual({
    b: 'b--changed'
  });
  expect(r.b).toBe(n.b);
});
