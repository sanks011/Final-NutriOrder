const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: Object,
      required: true,
    },
    meals: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    nextDelivery: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
