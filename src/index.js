import getReviews from './util/getReviews';
import format from './util/format';
import chalk from 'chalk';

async function fido(config, page = 1, fromDate = null) {
  for (let cfg of config) {
    console.log(`fetching reviews for ${cfg.name}...\n`);

    try {
      let data = await getReviews(cfg.countries, page, cfg.podcastId);
      console.log(chalk.bold.black(`** ${cfg.name} **`));
      console.log(format(data, fromDate));
    } catch (e) {
      console.log(e);
    }
  }
}

export default fido;
