module.exports = {
  root: ['A', 'B', 'index.js'],
  childStruct: {
    A: {
      root: [{ match: '*-foo', exampleName: 'a-foo' }, 'a.js'],
      childStruct: {
        'a-foo': {
          root: [{ match: '*.Routes.js', exampleName: 'api.Routes.js' }],
        },
      },
    },
    B: {
      root: ['b.js'],
    },
  },
};
