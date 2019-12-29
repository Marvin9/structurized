const path = require('path');
const Process = require('../../lib/Process');
const structure = require('./structure');

const P1 = new Process(structure, path.resolve('./test/negative-structure-nested/structure'));

test('c.js & b.js is missing at nested, negative number should be 2, positive should be 5, neutral should be 2(2 .keep files)', () => {
  const report = P1.generateReport();
  expect(report.positive.number).toBe(5);
  expect(report.negative.number).toBe(2);
  expect(report.neutral.number).toBe(1);
});
