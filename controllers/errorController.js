const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  //   console.log(err);
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log(Object.keys(err.keyValue)[0]);
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value`;
  // const message = `Duplicate: ${Object.keys(
  //   err.keyValue
  // )[0].toUpperCase()}. Please use another ${Object.keys(
  //   err.keyValue
  // )[0].toUpperCase()}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  console.log(err);
  const message = `Invalid input data: ${errors.join(', ')}.`;
  return new AppError(message, 400);
};

const sendErrorforDev = (err, req, res) => {
  // FOR API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // FOR RENDERED WEBSITE
  console.error('Error 🚨', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorforProd = (err, req, res) => {
  // FOR API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: dont leak error details
    // log error
    console.error('Error 🚨', err);
    // send generic error message
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }

  // For RENDERED WEBSITE
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or other unknown error: dont leak error details
  // log error
  console.error('Error 🚨', err);
  // send generic error message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your Token has expired!. Please log in again!', 401);

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorforDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    //     let error = { ...err };
    //     console.log(error.name);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorforProd(error, req, res);
  }
};
