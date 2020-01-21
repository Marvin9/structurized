#!/usr/bin/env node

/* eslint-disable no-console */
const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const Process = require('../lib/Process');

const currPath = process.cwd();
const yamlFilePath = path.resolve(currPath, 'structure.yml');

// add exist condition
fs.readFile(yamlFilePath, 'utf8', (err, structure) => {
  if (err) {
    console.log(`\nCan't found ${chalk.cyan('structure.yml')} in this directory.`);
    console.log(`at ${currPath}`);
    process.exit(1);
  }
  const parsedStructure = yaml.parse(structure);
  const P1 = new Process(parsedStructure, currPath);

  try {
    console.log(`\n${chalk.bold('ROOT : ')}${currPath}\n`);
    const report = P1.generateReport();
    const { positive, negative, neutral } = report;

    console.log('\n');
    if (positive.number) {
      console.log(logSymbols.success, `${chalk.green(positive.number)} file(s)/folder(s) exists as well as defined`);
    }
    if (negative.number) {
      console.log(logSymbols.error, `${chalk.red(negative.number)} file(s)/folder(s) don't exist but defined`);
    }
    if (neutral.number) {
      console.log(logSymbols.warning, `${chalk.cyan(neutral.number)} file(s)/folder(s) exist but not defined`);
    }
  } catch (error) {
    throw new Error(error);
  }
});
