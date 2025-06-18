console.log('Starting StayFinder backend...');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log('Loaded .env, MONGODB_URI:', process.env.MONGODB_URI);
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set!');
}


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/reviews");
const notificationRoutes = require("./routes/notifications");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options('*', cors({ origin: true, credentials: true }));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  console.log("Received request for /");
  res.json({ status: "OK", message: "Welcome to the StayFinder API!" });
});

// Health check endpoint (works even if DB is down)
app.get("/api/health", (req, res) => {
  console.log("Received request for /api/health");
  res.json({ status: "OK", message: "StayFinder API is running" });
});

// Serverless-safe MongoDB connection
let isConnected = false;
async function connectToDatabase() {
  console.log('connectToDatabase called');
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Ensure DB connection only for /api/* routes
app.use("/api", async (req, res, next) => {
  await connectToDatabase();
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
