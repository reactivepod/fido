const getReviews = require('./lib/getReviews');
const format = require('./lib/format');
const chalk = require('chalk');

function fido(config, page = 1, fromDate = null) {
  config.forEach((cfg) => {
    getReviews(cfg.countries, page, cfg.podcastId, (error, data) => {
      console.log(chalk.bold.black('** ' + cfg.name + ' **'));
      console.log(format(data, fromDate));
    });
  });
}

module.exports = fido;
