/* eslint-disable prettier/prettier */
const AppError = require('../utils/AppError');

const handlerCastError = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handlerValidatorError = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);

};
const handlerJsonWebTokenError = () => {
  const message = 'your token is invalid , please login again';
  return new AppError(message, 401);

}
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handlerDuplicateError = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const errorHandlerInApiRoutProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
}
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).render('error', {
      titel: 'error happened!',
      msg: err.message
    });
  }
};
//send error to client in  production mode
const sendErrorprod = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) return errorHandlerInApiRoutProd(err, res);

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      titel: 'error happened',
      msg: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(500).render('error', {
    status: 'error',
    message: 'Something went very wrong!'
  });
  // Operational, trusted error: send message to client

};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err
    };
    error.message = err.message;
    if (error.name === 'CastError') error = handlerCastError(error);
    if (error.code === 11000) error = handlerDuplicateError(error);
    if (error.name === 'ValidationError') error = handlerValidatorError(error);
    if (error.name === 'JsonWebTokenError') error = handlerJsonWebTokenError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorprod(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};