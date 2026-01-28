const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  rating: Number,
  isOpen: Boolean
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
