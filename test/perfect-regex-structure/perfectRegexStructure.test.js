const path = require('path');
const Process = require('../../lib/Process');
const structure = require('./structure');

const P1 = new Process(structure, path.resolve('./test/perfect-regex-structure/structure'));

test('if user follow 100% structure then negative & neutral number in report should be 0 & positive should be 5', () => {
  const report = P1.generateReport();
  expect(report.positive.number).toBe(7);
  expect(report.negative.number).toBe(0);
  expect(report.neutral.number).toBe(0);
});
