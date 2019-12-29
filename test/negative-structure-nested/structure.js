module.exports = {
  root: ['A', 'B', 'index.js'],
  childStruct: {
    A: {
      root: ['C', 'a.js'],
      childStruct: {
        C: {
          root: ['c.js'],
        },
      },
    },
    B: {
      root: ['b.js'],
    },
  },
};
