# Weather Challenge

This weather app is based on Stencil App Starter from https://github.com/ionic-team/stencil-app-starter.

What it does is take a city as an input and then makes an API call to openweathermap.org for a 5 day forecast for that city. Then it displays the weather for current day and the next 4 days. 1st weatherbox contains the current days most recent forecast (every 3h). The other days weatherboxes hold forecast at 15:00 for that day. Clicking the boxes shows more detailed info about that specific day in a collapsible list.

## Getting Started

To start a new project using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/Vanutappi/Weather_Challenge.git
git remote rm origin
```

and run:

```bash
npm install
npm start
```

To build the app for production, run:

```bash
npm run build
```

To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```
