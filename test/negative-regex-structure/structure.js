module.exports = {
  root: [
    {
      A: [
        {
          matcher: {
            match: '*-foo',
            root: [
              {
                matcher: {
                  match: '*.Routes.js',
                },
              },
            ],
          },
        },
        'a.js',
      ],
    },
    {
      B: [
        'b.js',
      ],
    },
    'index.js',
  ],
};
