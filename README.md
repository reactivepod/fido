# Fido

Fetch reviews for one or more podcasts from a list of countries on the command line.

## Installation

```
npm install -g @reactive/fido
```

## Configuration

A default configuration is present in ./.fido. The file is in json format.
To override the configuration it is suggested to create a file with the same syntax in
~/.fido.

```javascript
{
  'podcasts': [
    {
      'name': 'Reactive',
      'podcastId': '1020286000',
      'countries': ['us', 'de', 'gb', 'se', 'ca', 'at', 'au', 'se', 'nl', 'br', 'mx', 'ru', 'gr', 'ar', 'za', 'ch', 'pt']
    },
    {
      'name': 'Descriptive',
      'podcastId': '926224392',
      'countries': ['us', 'de', 'gb', 'se', 'ca', 'at', 'au', 'se', 'nl', 'br', 'mx', 'ru', 'gr', 'ar', 'za', 'ch', 'pt']
    }
  ]
}
```

## Usage

```
fido -h
```

# License

MIT © [Reactivists](https://github.com/orgs/reactivepod/teams/reactivists)
