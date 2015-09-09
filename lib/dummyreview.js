var async = require('async');

function DummyITunesReview() {}

DummyITunesReview.prototype.get = function(countries, pageCount, itemId, callback) {
  var result = [];

  if (!is_array(countries)) {
    countries = [countries];
  }

  async.each(countries, function(country, next) {
    getByCountry(country, pageCount, itemId, function(error, data) {
      if (!error) {
        if (data.length == 0) {
          return;
        }

        result[country] = data;
        next();
      } else {
        next(error);
      }
    });
  },
  function(err) {
    if (err) {
      console.log(err);
    }

    callback(null, result);
  });

  function is_array(value) {
    return Object.prototype.toString.apply(value) === '[object Array]';
  };

  function getByCountry(country, pageCount, itemId, callback) {
    async.times(pageCount, function(n, next) {
      var num = ++n;

      doGet(country, num, itemId, function(err, data) {
        next(err, data);
      });
    }, function(err, result) {
      if (err) {
        callback(err);
      } else {
        var concatenated = [];

        result.forEach(function(chunk) {
            concatenated = concatenated.concat(chunk);
        });

        callback(null, concatenated);
      }
    });
  }

  function doGet(country, page, itemId, callback) {
  var reviews = [
    {
      updated: '2015-08-20T07:42:00-07:00',
      id: '1245973861',
      title: 'Great podcast with great people',
      content: 'hello this is the content',
      'im:contentType': 'review',
      'im:voteSum': '0',
      'im:voteCount': '0',
      'im:rating': '5',
      author:
       { name: 'Lewis Cowper',
         uri: 'https://itunes.apple.com/gb/reviews/id269374173' }
    },
    {
      updated: '2015-08-20T07:42:00-07:00',
      id: '1245973862',
      title: 'Great podcast with great people',
      content: 'hello this is the content',
      'im:contentType': 'review',
      'im:voteSum': '0',
      'im:voteCount': '0',
      'im:rating': '5',
      author:
       { name: 'Ding dong',
         uri: 'https://itunes.apple.com/gb/reviews/id269374173' }
    }
  ];

  callback(null, reviews);
  //callback({ error: 'this is an error'}, reviews);
  }
};

module.exports = DummyITunesReview;

