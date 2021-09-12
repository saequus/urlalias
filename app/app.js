var config;
if (process.env.NODE_ENV == 'develop') {
  config = require('./config/default');
} else {
  config = require('./config/production');
}

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const path = require('path');
const indexRouter = require('./routes/index.js');
const APIv1Router = require('./routes/api/v1.js');
// const APIv2Router = require('./routes/index.js');

mongoose.connect(config.MONGO_DB_PATH);

// Configuration

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, '../public')));

// Routes

app.get('/error/404', function (req, res, next) {
  next();
});

app.get('/error/403', function (req, res, next) {
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/error/500', function (req, res, next) {
  next(new Error('keyboard cat!'));
});

app.use('/', indexRouter);
app.use('/api/v1/', APIv1Router);

app.use(function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url, statusCode: 404 });
    },
    json: function () {
      res.status(404).json({ error: 'Not found' });
    },
    default: function () {
      res.type('txt').send('Not found');
    },
  });
});

app.use(function (err, req, res, next) {
  // TODO: improve error-handling
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  const statusCode = err.status || 500;
  err.url = req.url;
  err.statusCode = statusCode;
  res.status(statusCode);
  res.render('500', { error: err });
});

app.listen(port, () => {
  console.log(`The app listening at http://localhost:${port}`);
});

module.exports = app;
