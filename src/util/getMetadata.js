import fetch from 'isomorphic-fetch';
import {
  getXMLresult,
  checkStatus,
  parseText,
} from './parseXML';

function getResult(data) {
  const entry = data.feed.entry[0];

  return {
    name: entry['im:name'],
    artist: entry['im:artist'],
    image: entry['im:image'].reduce((total, image) => {
      total[image.attributes.height] = image.label;
      return total;
    }, {}),
    description: entry.summary,
    link: entry.id.label,
    releaseDate: new Date(entry['im:releaseDate'].label),
  };
}

export default function getMetadata(itemId) {
  const url = `https://itunes.apple.com/us/rss/customerreviews/page=1/id=${itemId}/sortBy=mostRecent/xml`;

  return fetch(url)
    .then(checkStatus)
    .then(parseText)
    .then(getXMLresult)
    .then(getResult)
    .catch(() => {
      return {};
    });
}
