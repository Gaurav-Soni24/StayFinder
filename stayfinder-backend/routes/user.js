const express = require("express")
const auth = require("../middleware/auth")
const User = require("../models/User")
const Listing = require("../models/Listing")
const Notification = require("../models/Notification")

const router = express.Router()

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("trips.listingId")
      .select("-passwordHash")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone, birthdate, avatar, location } = req.body

    if (!name) {
      return res.status(400).json({ error: "Name is required" })
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, birthdate, avatar, location },
      { new: true },
    ).select("-passwordHash")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ message: "Profile updated", user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get user wishlist
router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist")
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user.wishlist)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Add to wishlist
router.post("/wishlist", auth, async (req, res) => {
  try {
    const { listingId } = req.body
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    if (!user.wishlist.map(id => id.toString()).includes(listingId)) {
      user.wishlist.push(listingId)
      await user.save()
    }
    res.json({ message: "Added to wishlist" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Remove from wishlist
router.delete("/wishlist/:listingId", auth, async (req, res) => {
  try {
    const { listingId } = req.params
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" })
    }
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    user.wishlist = user.wishlist.filter((id) => id.toString() !== listingId)
    await user.save()
    res.json({ message: "Removed from wishlist" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Change user password
router.put("/profile/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bcrypt = require("bcryptjs");
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Book a listing (add trip to user)
router.post("/bookings", auth, async (req, res) => {
  try {
    const { listingId, dates, guests } = req.body;
    if (!listingId || !dates) {
      return res.status(400).json({ error: "listingId and dates are required" });
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.trips.push({
      listingId: listing._id,
      location: listing.location,
      dates,
      image: listing.images[0] || "",
      status: "upcoming",
      guests: guests || 1,
    });
    await user.save();
    // Send notification to user
    await Notification.create({
      userId: user._id,
      type: "booking",
      title: "Booking Confirmed",
      description: `Your booking for ${listing.title} is confirmed!`,
      image: listing.images[0] || "",
    });
    // Send notification to host
    if (listing.host) {
      await Notification.create({
        userId: listing.host,
        type: "booking",
        title: "New Booking Received",
        description: `${user.name} booked your property: ${listing.title}`,
        image: listing.images[0] || "",
      });
    }
    const updatedUser = await User.findById(req.user.id)
      .populate("wishlist")
      .populate("trips.listingId")
      .select("-passwordHash");
    res.json({ message: "Booking successful", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router
