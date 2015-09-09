'use strict';

var interpolate = require('interpolate');
var dateformat = require('dateformat');
var clc = require('cli-color');

function FormatPodcastReview() {}

FormatPodcastReview.prototype.execute = function(data) {
  function getTemplate() {
    var template = {};

    template = '\n'
    template += '{store} / {author} / {title} / {rating} / {date}\n';
    template += '{content}\n';

    return template;
  }

  function getContent(content) {
    for (var i = 0; i < content.length; i++) {
      if (content[i].attributes.type == 'text') {
        return content[i].label;
      }
    };
  }

  function format(data) {
    var formatted = '';

    for (var country in data) {
      data[country].forEach(function(review) {
        var tReview = {
          store: clc.bold.black(country.toUpperCase()),
          author: clc.bold.red(review.author.name),
          title: clc.bold.black(review.title),
          rating: clc.bold.black(review['im:rating']),
          date: clc.bold.black(dateformat(review.updated, 'yyyy-mm-dd HH:MM:ss')),
          content: getContent(review.content)
        };

        formatted += interpolate(getTemplate(), tReview);
      });
    }

    return formatted;
  }

  return format(data);
}

module.exports = FormatPodcastReview;
