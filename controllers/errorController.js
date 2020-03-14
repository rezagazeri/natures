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
const handlerDuplicateError = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
//send error to client in  production mode
const sendErrorprod = (err, res) => {
  // Operational, trusted error: send message to client
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
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err
    };
    if (error.name === 'CastError') error = handlerCastError(error);
    if (error.code === 11000) error = handlerDuplicateError(error);
    if (error.name === 'ValidationError') error = handlerValidatorError(error);
    if (error.name === 'JsonWebTokenError') error = handlerJsonWebTokenError();

    sendErrorprod(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};