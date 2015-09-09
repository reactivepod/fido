'use strict';

var config = require('./configuration');
var iTunesReviews = require('./lib/review');
var reviews = new iTunesReviews();
var FormatPodcastReview = require('./lib/format');
var formater = new FormatPodcastReview();
var clc = require('cli-color');
var page = 1;

console.log(clc.green('\niTunes-Podcast-Reviews\n2015 (c) Reactivists (https://github.com/orgs/reactivepod/teams/reactivists)\nMIT\n'));

config.forEach(function(cfg) {
  reviews.get(cfg.countries, page, cfg.podcastId, function(error, data) {
    console.log(clc.bold.black('** ' + cfg.name + ' **'));
    console.log(formater.execute(data));
  });
});
