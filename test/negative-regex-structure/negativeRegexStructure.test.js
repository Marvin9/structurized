const path = require('path');
const Process = require('../../lib/Process');
const structure = require('./structure');

const P1 = new Process(structure, path.resolve('./test/negative-regex-structure/structure'));

test('if at any level regex form structured file/folder is 0, then it should add to negative report', () => {
  const report = P1.generateReport();
  expect(report.positive.number).toBe(6);
  expect(report.negative.number).toBe(1);
  expect(report.neutral.number).toBe(0);
});
