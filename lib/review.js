'use strict';

var request = require('request');
var async = require('async');
var parseXmlString = require('xml2js').parseString;
var parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false
};

function ITunesReview() {}

ITunesReview.prototype.get = function(countries, pageCount, itemId, callback) {
  var result = {};

  if (!is_array(countries)) {
    countries = [countries];
  }

  async.each(countries, function(country, next) {
    getByCountry(country, pageCount, itemId, function(error, data) {
      if (!error) {
        if (data.length == 0) {
          next();
        } else {
          result[country] = data;
          next();
        }
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
    var url = 'https://itunes.apple.com/' + country + '/rss/customerreviews/page=';
        url += page + '/id=' + itemId + '/sortBy=mostRecent/xml';

    request.get(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        parseXmlString(body, parseOptions, function(err, result) {
          var reviews = result.feed.entry || [];
          if (reviews.length != 0) {
            reviews.shift();
          }
          callback(null, reviews);
        });
      } else {
          callback(err);
      };
    });
  }
};

module.exports = ITunesReview;
