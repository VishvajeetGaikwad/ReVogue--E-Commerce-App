const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Import routers
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const app = express(); // Initialize Express
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Local dev
  "http://localhost:5000", // Local backend
  "https://your-production-url.com", // Replace with your production frontend URL
  "https://revogue-e-commerce-app-1.onrender.com", // Another production URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(cookieParser()); // Middleware to parse cookies
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
