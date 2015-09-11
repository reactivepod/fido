# Fido

Fetch reviews for one or more podcasts from a list of countries on the command line.

## Installation

```
git clone git@github.com:reactivepod/fido.git
npm install
```

Git for now, until npm rolls out orgs.

## Configuration

Copy the `configuration.js.dist` file to `configuration.js` and add at least one entry

```javascript
module.exports = [
  {
    name: 'Reactive',
    podcastId: '1020286000',
    countries: ['us', 'de', 'gb', 'se', 'ca', 'at', 'au', 'se', 'nl', 'br', 'mx', 'ru', 'gr', 'ar', 'za', 'ch', 'pt']
  },
  {
    name: 'Descriptive',
    podcastId: '926224392',
    countries: ['us', 'de', 'gb', 'se', 'ca', 'at', 'au', 'se', 'nl', 'br', 'mx', 'ru', 'gr', 'ar', 'za', 'ch', 'pt']
  }
];
```

## Usage

```
node index.js
```

# License

MIT © [Reactivists](https://github.com/orgs/reactivepod/teams/reactivists)
