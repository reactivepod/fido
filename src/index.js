import getReviews from './util/getReviews';
import getMetadata from './util/getMetadata';
import promiseProps from 'promise-props';
import { transform } from './util/format';

export default function fido(config, page = 1, fromDate = null) {
  const allPromises = config.reduce((all, cfg) => {
    all[cfg.podcastId] = Promise.all([
      getMetadata(cfg.podcastId),
      getReviews(cfg.countries, page, cfg.podcastId)
    ]).then(result => {
      const [meta, review] = result;

      return {
        name: cfg.name,
        fromDate,
        id: cfg.podcastId,
        data: review,
        meta,
        reviews: transform(review, fromDate),
      };
    });

    return all;
  }, {});

  return promiseProps(allPromises);
}
