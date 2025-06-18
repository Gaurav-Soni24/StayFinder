const express = require("express")
const auth = require("../middleware/auth")
const Listing = require("../models/Listing")
const User = require("../models/User")

const router = express.Router()

// Get all listings with optional filters
router.get("/", async (req, res) => {
  try {
    const { search, location, type } = req.query
    const query = {}

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    const listings = await Listing.find(query).populate("host", "name avatar rating").populate("reviews")

    res.json(listings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get current user's listings
router.get("/user", auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({ error: "Unauthorized: user not authenticated" });
    }
    // Use both _id and id for compatibility
    const userId = req.user._id || req.user.id;
    const listings = await Listing.find({ host: userId })
      .populate("host", "name avatar rating")
      .populate("reviews");
    res.json(listings);
  } catch (error) {
    console.error('Error in GET /user:', error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get listings by any user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: "userId is required" });
    }
    const listings = await Listing.find({ host: userId })
      .populate("host", "name avatar rating")
      .populate("reviews");
    res.json(listings);
  } catch (error) {
    console.error('Error in GET /user/:userId:', error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get single listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("host", "name avatar rating").populate("reviews")

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    res.json(listing)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get current user's listings
router.get("/user", auth, async (req, res) => {
  try {
    console.log('req.user:', req.user);
    if (!req.user || (!req.user._id && !req.user.id)) {
      return res.status(401).json({ error: "Unauthorized: user not authenticated" });
    }
    // Use both _id and id for compatibility
    const userId = req.user._id || req.user.id;
    const listings = await Listing.find({ host: userId })
      .populate("host", "name avatar rating")
      .populate("reviews");
    res.json(listings);
  } catch (error) {
    console.error('Error in GET /user:', error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get listings by any user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: "userId is required" });
    }
    const listings = await Listing.find({ host: userId })
      .populate("host", "name avatar rating")
      .populate("reviews");
    res.json(listings);
  } catch (error) {
    console.error('Error in GET /user/:userId:', error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Create new listing
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      type,
      bedrooms,
      beds,
      bathrooms,
      guests,
      cleaningFee,
      serviceFee,
      images,
      amenities,
      availableDates,
      coordinates,
    } = req.body

    const listing = new Listing({
      title,
      description,
      price,
      location,
      type,
      bedrooms,
      beds,
      bathrooms,
      guests,
      cleaningFee,
      serviceFee,
      images,
      amenities,
      availableDates,
      coordinates,
      host: req.user.id,
    })

    await listing.save()
    await listing.populate("host", "name avatar rating")

    res.status(201).json(listing)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update listing
router.put("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" })
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
      "host",
      "name avatar rating",
    )

    res.json(updatedListing)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Delete listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" })
    }

    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await Listing.findByIdAndDelete(req.params.id)

    res.json({ message: "Listing deleted" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
