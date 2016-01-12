import { parseString as parseXmlString } from 'xml2js';
import pify from 'pify';

const parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false,
};

export function getResult(result) {
  const isEntry = result && result.feed && result.feed.entry && Array.isArray(result.feed.entry);
  return (isEntry) ? result.feed.entry.slice(1) : [];
}

export function getXMLresult(result) {
  return pify(parseXmlString)(result, parseOptions);
}

export function checkStatus(response) {
  const isReponseGood = response.status >= 200 && response.status < 300;

  if (!isReponseGood) {
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  return response;
}

export function parseText(response) {
  return response.text();
}
