const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      items: Array,
      status: String,
      total: Number
    },
    { timestamps: true }
  )
);
