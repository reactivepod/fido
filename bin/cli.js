#!/usr/bin/env node
require('babel/register');

const Yam = require('yam');
const pathHelper = require('../lib/util/pathHelper');
const getCurrentPath = pathHelper.getCurrentPath;
const getUserHomeDirectory = pathHelper.getUserHomeDirectory;

const config = new Yam('fido', {
  primary: getUserHomeDirectory(),
  secondary: getCurrentPath(),
});

const fido = require('../');

const argv = require('yargs')
  .usage('Usage: fido')
  .option('i', {
    alias: 'id',
    demand: false,
    describe: 'The podcast id to query (single numeric value)',
  })
  .option('n', {
    alias: 'name',
    demand: false,
    describe: 'The name of the podcast to query',
    type: 'string',
  })
  .option('c', {
    alias: 'countries',
    demand: false,
    describe: 'The countries to query (space separated)',
    type: 'array',
  })
  .option('p', {
    alias: 'pages',
    demand: false,
    describe: 'The number of pages to fetch (page size is 50)',
  })
  .help('h')
  .alias('h', 'help')
  .argv;

var cfg = [];

if (typeof argv.id !== 'undefined') {
  cfg.push({
    id: argv.id,
    name: argv.name,
    countries: argv.countries,
  });
} else {
  cfg = config.get('podcasts');
}

fido(cfg, argv.pages);
