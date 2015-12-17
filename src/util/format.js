import dateformat from 'dateformat';
import chalk from 'chalk';

function formatData(data) {
  return `\n${data.store} / ${data.author} / ${data.title} / ${data.rating} / ${data.date}\n${data.content}\n`;
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

  for (const country of Object.keys(data)) {
    let temp;

    if (fromDate !== null) {
      temp = data[country][0].filter(isNewer(fromDate));
    } else {
      temp = data[country][0];
    }

    temp = temp.map(review => {
      return {
        country,
        author: review.author,
        title: review.title,
        rating: review['im:rating'],
        date: new Date(review.updated),
        content: getContent(review.content)[0],
      };
    });

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
