const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body

      // Check if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)

      // Create user
      user = new User({
        name,
        email,
        passwordHash,
      })

      await user.save()

      // Generate JWT
      const payload = { userId: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

      // Return user without password
      const userResponse = user.toObject()
      delete userResponse.passwordHash

      res.status(201).json({ token, user: userResponse })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" })
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.passwordHash)
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" })
      }

      // Generate JWT
      const payload = { userId: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

      // Return user without password
      const userResponse = user.toObject()
      delete userResponse.passwordHash

      res.json({ token, user: userResponse })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" })
})

module.exports = router
