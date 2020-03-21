/* eslint-disable prettier/prettier */
const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xssCleaner = require('xss-clean');
const hpp = require('hpp');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); //for serve file in public folder

//set HTTP headers security
app.use(helmet());

//active express-rate-limit for blocking attacks
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP,please try again in an houre!'
});
app.use('/api', limiter);

const tourRouter = require('./routes/routtours');
const userRouter = require('./routes/routuser');
const reviewRouter = require('./routes/routreview');

app.use(
  express.json({
    limit: '10kb'
  })
); //client can not able request gt : 10kb

//protect app againts NOSQL Injection with delete any $
app.use(mongoSanitizer());

//protect app against xss attacks//attakers not able sent HTML OR JS correct
app.use(xssCleaner());

//protect app againt Http parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'ratingsAverage',
      'startDates'
    ]
  })
);

app.get('/', (req, res) => {
  res.status(200).render('base')
})
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this srver`, 404));
});

app.use(globalErrorHandler);

module.exports = app;