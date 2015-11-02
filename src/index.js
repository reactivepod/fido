import getReviews from './util/getReviews';
import format from './util/format';
import chalk from 'chalk';

function fido(config, page = 1, fromDate = null) {
  config.forEach((cfg) => {
    console.log(`fetching reviews for ${cfg.name}...\n`);
    getReviews(cfg.countries, page, cfg.podcastId, (error, data) => {
      console.log(chalk.bold.black('** ' + cfg.name + ' **'));
      console.log(format(data, fromDate));
    });
  });
}

module.exports = fido;
