const path = require('path');
const Process = require('../../lib/Process');
const structure = require('./structure');

const P1 = new Process(structure, path.resolve('./test/not-defined-in-structure/structure'));

test('if there is extra file/folder(s) not defined in structure then it should track it', () => {
  const report = P1.generateReport();
  expect(report.positive.number).toBe(5);
  expect(report.negative.number).toBe(0);
  expect(report.neutral.number).toBe(2);
});
