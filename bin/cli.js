#!/usr/bin/env node
require('babel/register');

const program = require('commander');

const config = require('../configuration');
const fido = require('../');

const page = 1;

program
  .version('1.0.0')
  .option('-p, --pages', 'The number of pages to fetch (default: 1)', 1)
  .parse(process.argv);

if (program.pages) page = program.pages;

fido(config, page);
