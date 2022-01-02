class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // As this error operational error so we can send to client thats why we making this field

    // We are Capturing the stack  trace so we will get where the error actually happened

    // Difficult
    Error.captureStackTrace(this, this.constructor); // So, by this way when a new object is created and a constructor function is called then that function call is not gonna appear in the stack trace and will not pollute it.
  }
}

export default AppError;
