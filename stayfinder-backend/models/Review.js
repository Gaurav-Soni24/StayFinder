const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    user: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: { type: String, default: () => new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Review", reviewSchema)
