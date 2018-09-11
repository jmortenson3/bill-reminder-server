
// This will only get called if an error occurs.
// Define this last.
// call this like next(new Error('my error message.'));
exports.handleError = function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Oops, something went wrong.'
  });
}

exports.unknownRoute = function(req, res, next) {
  if (res.locals.shouldRedirect) {
    // do the redirection
  }
  let err = new Error('Not found.');
  err.status = 404;
  next(err);
}