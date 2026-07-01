/**
 * errorHandler.js
 * Global error handler middleware to intercept exceptions and output clean JSON messages.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Server Error] Global exception caught:', err.stack || err.message || err);
  
  // Custom rate-limit response compatibility
  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    error: err.message || "Your message couldn't be saved right now. Please try again."
  });
};

export default errorHandler;
