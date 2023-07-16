const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

//routes
const appRoutes = require("../routes/appRoutes")
const  userRoutes = require("../routes/userRoutes")
const admin = require("../routes/adminRoutes")


const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';

app.use(express.static(path.join(__dirname, distDir)))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());


// API router
app.use('/api', appRoutes); //for app actions 
app.use('/api/user', userRoutes); //for user actions
app.use('/api/admin', admin); //for admin actions


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404)
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

module.exports = app;