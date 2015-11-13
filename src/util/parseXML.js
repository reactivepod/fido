import { parseString as parseXmlString } from 'xml2js';
import pify from 'pify';

const parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false,
};

export function getResult(result) {
  const reviews = (result && result.feed && result.feed.entry && Array.isArray(result.feed.entry)) ? result.feed.entry.slice(1) : [];
  return reviews;
}

export function getXMLresult(result) {
  return pify(parseXmlString)(result, parseOptions);
}
