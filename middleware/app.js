const express = require('express');
const app = express();
const error = require('../util/error');
const AppError = require('../util/AppError');
const { apiLimiter, apiLimiterUpload } = require('./../util/appLimiter');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const user = require('./../route/user');
const file = require('./../route/file');
const auth = require('./../route/auth');

app.use(morgan('tiny'));
app.set('trust proxy', 1);
app.use('/uploads', express.static('uploads'));
app.use('/download', express.static('public'));

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: '1000000kb' }));

app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(hpp());

app.use(express.json());

app.use('/api/v1/user', user);
app.use('/api/v1/file', file);
app.use('/api/v1/auth', auth);
app.all('*', function (req, res, next) {
  next(new AppError(`This url has not found: ${req.originalUrl}`, 404));
});

app.use(error);

module.exports = app;
