const express = require("express")
const auth = require("../middleware/auth")
const Notification = require("../models/Notification")

const router = express.Router()

// Get user notifications
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Mark notifications as read
router.post("/read", auth, async (req, res) => {
  try {
    const { id } = req.body

    if (id) {
      // Mark specific notification as read
      await Notification.findByIdAndUpdate(id, { read: true })
    } else {
      // Mark all notifications as read
      await Notification.updateMany({ userId: req.user.id }, { read: true })
    }

    res.json({ message: "Marked as read" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
