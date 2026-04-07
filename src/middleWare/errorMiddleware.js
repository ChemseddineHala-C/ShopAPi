const multer = require("multer");

const errorMiddleware = (err, req, res, next) => {
  // Multer file size error
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large — max 2MB allowed",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // File type error from fileFilter
  if (err.message === "Only jpeg, jpg, png allowed") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Normal errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorMiddleware;
