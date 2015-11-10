import dateformat from 'dateformat';
import chalk from 'chalk';

function formatData(data) {
  return `\n${data.store} / ${data.author} / ${data.title} / ${data.rating} / ${data.date}\n${data.content}\n`;
}

function getContent(content) {
  return content
    .filter(item => item.attributes.type === 'text')
    .map(item => item.label);
}

function isNewer(fromDate) {
  return element => {
    const reviewDate = new Date(element.updated);
    return reviewDate >= fromDate;
  };
}

export default function format(data, fromDate = null) {
  let formatted = '';

  for (const country of Object.keys(data)) {
    let reviews = [];

    if (fromDate !== null) {
      reviews = data[country][0].filter(isNewer(fromDate));
    } else {
      reviews = data[country][0];
    }

    for (const review of reviews) {
      const tReview = {
        store: chalk.bold.black(country.toUpperCase()),
        author: chalk.bold.red(review.author.name),
        title: chalk.bold.black(review.title),
        rating: chalk.bold.black(review['im:rating']),
        date: chalk.bold.black(dateformat(review.updated, 'yyyy-mm-dd HH:MM:ss', true)),
        content: getContent(review.content)[0],
      };

      formatted += formatData(tReview);
    }
  }

  if (formatted === '') {
    formatted += chalk.bold.red('\nNo reviews\n');
  }

  return formatted;
}
