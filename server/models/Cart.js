const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [
      {
        food: {
          type: String, // Store as string initially, will be converted to ObjectId by populate
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        _id: false, // Disable auto-generated _id for subdocuments
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
