const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number,
    sodium: Number,
    cholesterol: Number
  },
  isDiabeticSafe: { type: Boolean, default: false },
  isVegan: { type: Boolean, default: false },
  isGlutenFree: { type: Boolean, default: false },
  isKeto: { type: Boolean, default: false },
  isHeartHealthy: { type: Boolean, default: false },
  isLowSodium: { type: Boolean, default: false },
  spiceLevel: String,
  tags: [String],
  ingredients: [String],
  recipe: {
    prepTime: String,
    cookTime: String,
    servings: Number,
    instructions: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model("Food", FoodSchema);
