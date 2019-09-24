const path = require('path');
const express = require('express');
const HttpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const expressValidator = require('express-validator');
const routes = require('../routes/index.route');
const config = require('./config');

const app = express();

const distDir = '../../dist/';
app.use(express.static(path.join(__dirname, distDir)));
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, `${distDir}/index.html`));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(compress());
app.use(cors());
app.use('/api/', routes);
app.use((req, res, next) => {
  const err = new HttpError(404);
  return next(err);
});
if (config.env === 'development') {
  app.use(logger('dev'));
}
module.exports = app;
