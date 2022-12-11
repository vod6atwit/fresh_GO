class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // not appear in the stack trace when new Error obj creates
    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
