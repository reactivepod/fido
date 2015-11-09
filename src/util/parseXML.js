import { parseString as parseXmlString } from 'xml2js';
import pify from 'pify';

const parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false,
};

export function getResult(result) {
  const reviews = result.feed.entry || [];
  if (reviews.length !== 0) {
    reviews.shift();
  }
  return reviews;
}

export function getXMLresult(result) {
  return pify(parseXmlString)(result, parseOptions);
}
