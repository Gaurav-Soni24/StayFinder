const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  location: { type: String, required: true },
  dates: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, required: true, enum: ["upcoming", "completed", "cancelled"] },
})

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    birthdate: { type: String, default: "" },
    location: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    joinDate: { type: String, default: () => new Date().toISOString() },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    trips: [tripSchema],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("User", userSchema)
