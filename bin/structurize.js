/* eslint-disable no-console */
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Process = require('../lib/Process');

const currPath = process.cwd();
const yamlFilePath = path.resolve(currPath, 'structure.yml');

// add exist condition
fs.readFile(yamlFilePath, 'utf8', (err, structure) => {
  if (err) throw new Error(err);
  const parsedStructure = yaml.parse(structure);
  const P1 = new Process(parsedStructure, currPath);

  try {
    const report = P1.generateReport();
    const { positive, negative, neutral } = report;

    if (positive.number) {
      console.log(`\n${chalk.blue(positive.number)} file(s)/folder(s) exists as well as defined in structure.yml`);
      console.log(`\n${JSON.stringify(positive.detailsOfChunks, null, ' ')}`);
    }
    if (negative.number) {
      console.log(`\n${chalk.red(negative.number)} file(s)/folder(s) don't exist but defined in structure.yml`);
      console.log(`\n${JSON.stringify(negative.detailsOfChunks, null, ' ')}`);
    }
    if (neutral.number) {
      console.log(`\n${chalk.green(neutral.number)} file(s)/folder(s) exist but not defined in structure.yml`);
      console.log(`\n${JSON.stringify(neutral.detailsOfChunks, null, ' ')}`);
    }
  } catch (error) {
    throw new Error(error);
  }
});
