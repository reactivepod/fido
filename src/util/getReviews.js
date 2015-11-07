import fetch from 'isomorphic-fetch';
import promiseProps from 'promise-props';
import { getXMLresult, getResult} from './parseXML';


function checkStatus(response) {
  const isReponseGood = response.status >= 200 && response.status < 300;

  if (!isReponseGood) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  return response;
}

function parseText(response) {
  return response.text();
}

function doGet(country, page, itemId) {
  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${itemId}/sortBy=mostRecent/xml`;

  return fetch(url)
    .then(checkStatus)
    .then(parseText)
    .then(getXMLresult)
    .then(getResult);
}


function getByCountry(country, pageCount, itemId) {
  const requests = Array.from(
    {length: pageCount},
    (k, i) => doGet(country, i + 1, itemId)
  );

  return Promise.all(requests);
}

function getReviews(countries, pageCount, itemId) {
  const countriesArr = Array.isArray(countries) ? countries : [countries];
  const requests = {};

  countriesArr.forEach(country => {
    requests[country] = getByCountry(country, pageCount, itemId);
  });

  return promiseProps(requests);
}

export default getReviews;
