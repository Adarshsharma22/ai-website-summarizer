//Central error handler. Ensures the client never sees raw stack traces

export function errorMiddleware(err, req, res, _next) {
  console.error(err);

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message =
    statusCode === 500
      ? "Something went wrong on our end. Please try again."
      : err.message || "Request failed.";

  res.status(statusCode).json({ message });
}

export function notFoundMiddleware(req, res) {
  res.status(404).json({ message: "Route not found." });
}
