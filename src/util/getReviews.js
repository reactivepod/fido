import fetch from 'isomorphic-fetch';
import promiseProps from 'promise-props';
import {
  getXMLresult,
  getResult,
  checkStatus,
  parseText,
} from './parseXML';

function doGet(country, page, itemId) {
  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${itemId}/sortBy=mostRecent/xml`;

  return fetch(url)
    .then(checkStatus)
    .then(parseText)
    .then(getXMLresult)
    .then(getResult)
    .catch(() => []);
}


function getByCountry(country, pageCount, itemId) {
  if (Array.isArray(pageCount)) {
    return pageCount.map(page => doGet(country, page, itemId));
  }

  const requests = Array.from(
    { length: pageCount },
    (k, i) => doGet(country, i + 1, itemId)
  );


  return Promise.all(requests);
}

export default function getReviews(countries, pageCount, itemId) {
  const countriesArr = Array.isArray(countries) ? countries : [countries];
  const requests = {};

  countriesArr.forEach(country => {
    requests[country] = getByCountry(country, pageCount, itemId);
  });

  return promiseProps(requests);
}
