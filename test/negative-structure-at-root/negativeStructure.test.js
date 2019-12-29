const path = require('path');
const Process = require('../../lib/Process');
const structure = require('./structure');

const P1 = new Process(structure, path.resolve('./test/negative-structure-at-root/structure'));

test('index.js is missing in user structure, so negative report number should be 1', () => {
  const report = P1.generateReport();
  expect(report.positive.number).toBe(4);
  expect(report.negative.number).toBe(1);
  expect(report.neutral.number).toBe(0);
});
