const tap = require('tap');

tap.test('isArray', function cb(t) {
  t.plan(1);
  t.equal(Array.isArray({}), false);
  // call t.end() when you're done
  t.end();
});
