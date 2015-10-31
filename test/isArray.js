require('babel-core/register');

const tap = require('tap');
const isArray = require('lodash.isarray');

tap.test('isArray', function cb(t) {
  t.plan(1);
  t.equal(isArray({}), false);
  // call t.end() when you're done
  t.end();
});
