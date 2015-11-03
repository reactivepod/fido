import fetch from 'node-fetch';
import { parseString as parseXmlString } from 'xml2js';
import pify from 'pify';
import promiseProps from 'promise-props';

const parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false,
};

function doGet(country, page, itemId) {
  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${itemId}/sortBy=mostRecent/xml`;

  return fetch(url)
    .then(result => result.text())
    .then(result => {
      return pify(parseXmlString)(result, parseOptions);
    })
    .then(result => {
      const reviews = result.feed.entry || [];
      if (reviews.length !== 0) {
        reviews.shift();
      }
      return reviews;
    });
}

function getByCountry(country, pageCount, itemId) {
  const requests = [];

  for (let i = 0; i < pageCount; i++) {
    requests.push(doGet(country, i + 1, itemId));
  }

  return Promise.all(requests);
}

function getReviews(countries, pageCount, itemId) {
  const countriesArr = Array.isArray(countries) ? countries : [countries];
  const requests = {};

  for (const country of countriesArr) {
    requests[country] = getByCountry(country, pageCount, itemId);
  }

  return promiseProps(requests);
}

export default getReviews;
