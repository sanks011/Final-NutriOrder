const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Review",
  new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
    rating: Number,
    comment: String
  }, { timestamps: true })
);
