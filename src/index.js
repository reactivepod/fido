import getReviews from './util/getReviews';
import { transform } from './util/format';

export default async function fido(config, page = 1, fromDate = null) {
  const output = {};

  for (const cfg of config) {
    output[cfg.podcastId] = {
      name: cfg.name,
      fromDate,
      id: cfg.podcastId,
    };

    try {
      output[cfg.podcastId].data = await getReviews(cfg.countries, page, cfg.podcastId);
      output[cfg.podcastId].reviews = transform(output[cfg.podcastId].data, fromDate);
    } catch (e) {
      output[cfg.podcastId].data = null;
      output[cfg.podcastId].reviews = null;
    }
  }

  return output;
}
