const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const connectDB = require("./src/db/database");
const errorMiddleware = require("./src/middleWare/errorMiddleware");
const corsOptions = require("./src/config/crosOptions");
const { globalLimiter, authLimiter } = require("./src/config/rateLimiter");

const app = express();
const path = require("path");

// Security MiddleWare - ORDER MATTERS
app.use(helmet());
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  next();
});
app.use(hpp());

// Database
connectDB();

// Route
const authRoute = require("./src/routes/authRoutes");
const userRoute = require("./src/routes/userRoutes");
const productRoute = require("./src/routes/productRoutes");
const reviewRoute = require("./src/routes/reviewRoutes");
const orderRoute = require("./src/routes/orderRoutes");

app.use("/auth", authLimiter, authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/reviews", reviewRoute);
app.use("/orders", orderRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ERROR HANDLER
app.use(errorMiddleware);

module.exports = app;
