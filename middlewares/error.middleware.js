export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (!err.isOperational) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({ error: err.message || "Internal server error" });
};