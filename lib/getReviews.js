const request = require('request');
const async = require('async');
const parseXmlString = require('xml2js').parseString;
const isArray = require('./util/isArray');

const parseOptions = {
  attrkey: 'attributes',
  charkey: 'label',
  explicitArray: false,
};

function doGet(country, page, itemId, callback) {
  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${itemId}/sortBy=mostRecent/xml`;

  request.get(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      parseXmlString(body, parseOptions, (err, result) => {
        const reviews = result.feed.entry || [];
        if (reviews.length !== 0) {
          reviews.shift();
        }
        callback(null, reviews);
      });
    } else {
      callback(err);
    }
  });
}

function getByCountry(country, pageCount, itemId, callback) {
  function asyncSuccess(n, next) {
    const num = n + 1;

    doGet(country, num, itemId, (err, data) => {
      next(err, data);
    });
  }

  function asyncFail(err, result) {
    if (err) {
      callback(err);
    } else {
      let concatenated = [];

      result.forEach((chunk) => {
        concatenated = concatenated.concat(chunk);
      });

      callback(null, concatenated);
    }
  }

  async.times(pageCount, asyncSuccess, asyncFail);
}

function getReviews(countries, pageCount, itemId, callback) {
  let result = []; // eslint-disable-line
  const countriesArr = isArray(countries) ? countries : [countries];

  function asyncSuccess(country, next) {
    getByCountry(country, pageCount, itemId, (error, data) => {
      if (!error) {
        if (data.length === 0) {
          next();
        } else {
          result[country] = data;
          next();
        }
      } else {
        next(error);
      }
    });
  }

  function asyncFail(err) {
    if (err) {
      console.log(err);
    }

    callback(null, result);
  }

  async.each(countriesArr, asyncSuccess, asyncFail);
}

module.exports = getReviews;
