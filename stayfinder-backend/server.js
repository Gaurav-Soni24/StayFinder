const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const listingRoutes = require("./routes/listings")
const reviewRoutes = require("./routes/reviews")
const notificationRoutes = require("./routes/notifications")

const app = express()

// Middleware - Allow all origins
app.use(cors({
  origin: true, // This allows all origins
  credentials: true,
}))
// Handle preflight requests for all routes
app.options('*', cors({
  origin: true, // This allows all origins
  credentials: true,
}));
app.use(express.json())

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/stayfinder", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/listings", listingRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/notifications", notificationRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "StayFinder API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

module.exports = app;
