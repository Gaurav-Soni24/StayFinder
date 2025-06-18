const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ["message", "booking", "review", "system"] },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString() },
    read: { type: Boolean, default: false },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Notification", notificationSchema)
