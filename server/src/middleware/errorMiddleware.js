/**
 * Handles unmatched routes with a 404 JSON response.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

/**
 * Centralized Express error handler normalizing Mongoose and validation errors.
 */
export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid task ID format' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
}

