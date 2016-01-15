import getReviews from './util/getReviews';
import getMetadata from './util/getMetadata';
import promiseProps from 'promise-props';
import { transform } from './util/format';

export function getMeta(config) {
  const allPromises = config.reduce((all, cfg) => {
    all[cfg.podcastId] = getMetadata(cfg.podcastId).then(metaInfo => {
      return {
        id: cfg.podcastId,
        meta: metaInfo,
      };
    });

    return all;
  }, {});

  return promiseProps(allPromises);
}

export default function fido(config, page = 1, fromDate = null) {
  const allPromises = config.reduce((all, cfg) => {
    all[cfg.podcastId] = getReviews(cfg.countries, page, cfg.podcastId).then(review => {
      return {
        name: cfg.name,
        fromDate,
        id: cfg.podcastId,
        data: review,
        reviews: transform(review, fromDate),
      };
    });


    return all;
  }, {});

  return promiseProps(allPromises);
}
