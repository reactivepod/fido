require('babel/register');

const interpolate = require('interpolate');
const dateformat = require('dateformat');
const chalk = require('chalk');
const template = `
  \n
  {store} / {author} / {title} / {rating} / {date}\n
  {content}\n
`;

function getContent(content) {
  return content
    .filter((item) => item.attributes.type === 'text')
    .map((item) => item.label);
}

function format(data) {
  let formatted = '';

  for (const country in data) {
    if ({}.hasOwnProperty.call(data, country)) {
      data[country].forEach((review) => {
        const tReview = {
          store: chalk.bold.black(country.toUpperCase()),
          author: chalk.bold.red(review.author.name),
          title: chalk.bold.black(review.title),
          rating: chalk.bold.black(review['im:rating']),
          date: chalk.bold.black(dateformat(review.updated, 'yyyy-mm-dd HH:MM:ss')),
          content: getContent(review.content)[0],
        };

        formatted += interpolate(template, tReview);
      });
    }
  }

  return formatted;
}


module.exports = format;
