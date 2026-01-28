const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "DELIVERY"],
      default: "USER",
    },

    // 🧠 Health / Recommendation data
    preferences: {
      age: Number,
      height: Number,
      weight: Number,
      goal: String,
      dietType: String,
      allergies: [String],
      conditions: [String],
    },

    hasCompletedHealthProfile: {
      type: Boolean,
      default: false,
    },

    // 📍 Addresses
    addresses: [
      {
        label: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],

    // ❤️ Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
