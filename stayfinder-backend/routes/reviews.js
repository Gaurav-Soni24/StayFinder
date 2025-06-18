const express = require("express")
const auth = require("../middleware/auth")
const Review = require("../models/Review")
const Listing = require("../models/Listing")
const User = require("../models/User")

const router = express.Router()

// Create review
router.post("/", auth, async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body

    // Get user info for the review
    const user = await User.findById(req.user.id)

    const review = new Review({
      listingId,
      userId: req.user.id,
      user: {
        name: user.name,
        avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      },
      rating,
      comment,
    })

    await review.save()

    // Add review to listing
    await Listing.findByIdAndUpdate(listingId, {
      $push: { reviews: review._id },
    })

    // Update listing rating (simple average)
    const allReviews = await Review.find({ listingId })
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await Listing.findByIdAndUpdate(listingId, { rating: Math.round(avgRating * 10) / 10 })

    res.status(201).json(review)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get reviews for a listing
router.get("/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({ listingId: req.params.listingId }).sort({ createdAt: -1 })

    res.json(reviews)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
