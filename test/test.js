import test from 'ava';
import 'babel/register';
import { getResult, getXMLresult } from '../src/util/parseXML';
import format from '../src/util/format';
import getReviews from '../src/util/getReviews';
import { readFileSync } from 'fs';
import nock from 'nock';

test('parseXML/getResult', t => {
  t.plan(4);

  const input = {
    feed: {
      entry: ['abc', 'def', 'xyz'],
    },
  };

  t.same(getResult(input), ['def', 'xyz']);
  t.same(getResult({ feed: { entry: 'a' }}), []);
  t.same(getResult(), []);
  t.same(getResult({}), []);
});

test('parseXML/getXMLresult', t => {
  const fixture = readFileSync('./fixture/getXMLresult.xml', { encoding: 'utf8' });
  const fixtureJson = readFileSync('./fixture/getXMLresult.json', { encoding: 'utf8' });
  return getXMLresult(fixture).then(result => {
    t.same(result, JSON.parse(fixtureJson));
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
    t.same(Object.keys(result), ['us', 'de']);
    t.same(result.de, [[]]);
    t.ok(result.us);
    t.same(scope.isDone(), true);
  });
});

test('format', t => {
  const data = JSON.parse(readFileSync('./fixture/format.json', { encoding: 'utf8' }));
  const output = format(data);
  const fixture = readFileSync('./fixture/format.txt', { encoding: 'utf8' });

  t.same(output, fixture);
  t.end();
});
