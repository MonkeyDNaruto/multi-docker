function errorHandler(err, req, res, next) {
  res.status(500).json({
    success: false,
    data: null,
    message: err.message || "server error",
  });
}
module.exports = errorHandler;
