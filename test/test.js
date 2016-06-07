import test from 'ava';
import 'babel-register';
import { getResult, getXMLresult } from '../src/util/parseXML';
import { format, transform } from '../src/util/format';
import getReviews from '../src/util/getReviews';
import { readFileSync } from 'fs';
import nock from 'nock';
import { stripColor } from 'chalk';

test('parseXML/getResult', t => {
  t.plan(4);

  const input = {
    feed: {
      entry: ['abc', 'def', 'xyz'],
    },
  };

  t.deepEqual(getResult(input), ['def', 'xyz']);
  t.deepEqual(getResult({ feed: { entry: 'a' } }), []);
  t.deepEqual(getResult(), []);
  t.deepEqual(getResult({}), []);
});

test('parseXML/getXMLresult', t => {
  const fixture = readFileSync('./fixture/getXMLresult.xml', { encoding: 'utf8' });
  const fixtureJson = readFileSync('./fixture/getXMLresult.json', { encoding: 'utf8' });
  return getXMLresult(fixture).then(result => {
    t.deepEqual(result, JSON.parse(fixtureJson));
  });
});

test('getReviews', t => {
  t.plan(4);

  const config = JSON.parse(readFileSync('./fixture/config.json', { encoding: 'utf8' }));
  const scope = nock('https://itunes.apple.com')
                .get('/us/rss/customerreviews/page=1/id=1020286000/sortBy=mostRecent/xml')
                .replyWithFile(200, './fixture/getXMLresult.xml')
                .get('/de/rss/customerreviews/page=1/id=1020286000/sortBy=mostRecent/xml')
                .reply(404);
  const reactive = config.podcasts[0];

  return getReviews(reactive.countries, 1, reactive.podcastId).then(result => {
    t.deepEqual(Object.keys(result), ['us', 'de']);
    t.deepEqual(result.de, [[]]);
    t.truthy(result.us);
    t.deepEqual(scope.isDone(), true);
  });
});

test('format', t => {
  const data = JSON.parse(readFileSync('./fixture/format.json', { encoding: 'utf8' }));
  const output = stripColor(format(transform(data)));
  const fixture = readFileSync('./fixture/format.txt', { encoding: 'utf8' });

  t.deepEqual(output, fixture);
});
