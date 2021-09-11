if (process.env.NODE_ENV == 'develop') {
  var config = require('./config/default');
} else {
  var config = require('./config/production');
}

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const indexRouter = require('./routes/index.js');

mongoose.connect(config.NODE_ENV_MONGO_DB_PATH);

// Configuration

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

app.use(function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url });
    },
    json: function () {
      res.json({ error: 'Not found' });
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
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.listen(port, () => {
  console.log(`The app listening at http://localhost:${port}`);
});

module.exports = app;