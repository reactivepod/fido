import dateformat from 'dateformat';
import chalk from 'chalk';
import { btoa } from 'Base64';

function formatData(data) {
  return `
${data.store} / ${data.author} / ${data.title} / ${data.rating} / ${data.date}
${data.content}
`;
}

export function getContent(content) {
  return content
    .filter(item => item.attributes.type === 'text')
    .map(item => item.label);
}

export function isNewer(fromDate) {
  return element => {
    const reviewDate = new Date(element.updated);
    return reviewDate >= fromDate;
  };
}

export function transform(data, fromDate = null) {
  let reviews = [];
  const mapFn = country => review => {
    return {
      country,
      author: review.author,
      title: review.title,
      key: btoa(review.author.name),
      rating: review['im:rating'],
      date: new Date(review.updated),
      content: getContent(review.content)[0],
    };
  };

  for (const country of Object.keys(data)) {
    let temp = data[country].reduce((total, current) => [...total, ...current], []);

    if (fromDate !== null) {
      temp = temp.filter(isNewer(fromDate));
    }

    temp = temp.map(mapFn(country));

    if (temp.length) {
      reviews = reviews.concat(temp);
    }
  }

  return reviews.sort((a, b) => b.date - a.date);
}

export function format(reviews) {
  let formatted = '';

  for (const review of reviews) {
    const tReview = {
      store: chalk.bold.black(review.country.toUpperCase()),
      author: chalk.bold.red(review.author.name),
      title: chalk.bold.black(review.title),
      rating: chalk.bold.black(review.rating),
      date: chalk.bold.black(dateformat(review.date, 'yyyy-mm-dd HH:MM:ss', true)),
      content: review.content,
    };

    formatted += formatData(tReview);
  }

  if (formatted === '') {
    formatted += chalk.bold.red('\nNo reviews\n');
  }

  return formatted;
}
