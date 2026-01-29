const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Build response with populated items
    let populatedItems = [];

    // If there are items, manually populate them
    if (cart.items && cart.items.length > 0) {
      const Food = require("../models/Food");
      const mongoose = require("mongoose");

      // Convert string IDs to ObjectIds and fetch food data
      const foodIds = cart.items
        .map(item => item.food)
        .filter(foodId => mongoose.Types.ObjectId.isValid(foodId))
        .map(foodId => new mongoose.Types.ObjectId(foodId));

      if (foodIds.length > 0) {
        const foods = await Food.find({ _id: { $in: foodIds } }).populate(
          "restaurant",
          "name image rating isOpen"
        );

        // Map foods back to cart items
        const foodMap = new Map();
        foods.forEach(food => {
          foodMap.set(food._id.toString(), food.toObject());
        });

        populatedItems = cart.items
          .map(item => {
            const foodData = foodMap.get(item.food);
            if (!foodData) return null;
            
            return {
              food: foodData,
              quantity: item.quantity
            };
          })
          .filter(item => item !== null); // Remove items with missing food
      }
    }

    // Return properly structured response
    res.json({
      _id: cart._id,
      user: cart.user,
      items: populatedItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    console.error("❌ GET CART ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items } = req.body;

    console.log("📥 Received cart update request:", req.body);

    if (!items || !Array.isArray(items)) {
      console.error("❌ Invalid items format:", items);
      return res.status(400).json({ 
        message: "Invalid cart items format",
        received: items,
        type: typeof items
      });
    }

    // Handle empty cart
    if (items.length === 0) {
      const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        { items: [] },
        { upsert: true, new: true }
      );
      return res.json(cart);
    }

    const mongoose = require("mongoose");
    
    // Validate and normalize items
    const normalizedItems = [];
    
    for (const item of items) {
      try {
        // Get food ID
        let foodId = item.food;
        if (typeof item.food === "object" && item.food !== null) {
          foodId = item.food._id || item.food.id;
        }

        // Validate it's a string
        if (typeof foodId !== "string") {
          console.warn("⚠️ Food ID is not a string:", foodId);
          continue;
        }

        // Validate it's a valid ObjectId format (24 hex chars)
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
          console.warn("⚠️ Invalid ObjectId format:", foodId);
          continue;
        }

        // Validate quantity
        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

        normalizedItems.push({
          food: foodId, // Keep as string
          quantity: quantity,
        });
      } catch (e) {
        console.warn("⚠️ Error processing cart item:", e.message);
        continue;
      }
    }

    if (normalizedItems.length === 0) {
      console.error("❌ No valid items after normalization. Original items:", items);
      return res.status(400).json({ 
        message: "No valid items in cart after validation",
        originalItems: items,
        validationDetails: "Check food IDs and quantities"
      });
    }

    console.log("📦 Updating cart with items:", normalizedItems);

    // Update the cart
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: normalizedItems },
      { upsert: true, new: true }
    );

    console.log("✅ Cart updated successfully");

    // Build response with populated items
    let populatedItems = [];

    // Manually populate the foods
    const Food = require("../models/Food");
    
    if (cart.items && cart.items.length > 0) {
      const foodIds = cart.items
        .map(item => item.food)
        .filter(foodId => mongoose.Types.ObjectId.isValid(foodId))
        .map(foodId => new mongoose.Types.ObjectId(foodId));

      if (foodIds.length > 0) {
        const foods = await Food.find({ _id: { $in: foodIds } }).populate(
          "restaurant",
          "name image rating isOpen"
        );

        const foodMap = new Map();
        foods.forEach(food => {
          foodMap.set(food._id.toString(), food.toObject());
        });

        populatedItems = cart.items
          .map(item => {
            const foodData = foodMap.get(item.food);
            if (!foodData) return null;
            
            return {
              food: foodData,
              quantity: item.quantity
            };
          })
          .filter(item => item !== null);
      }
    }

    // Return properly structured response
    res.json({
      _id: cart._id,
      user: cart.user,
      items: populatedItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  } catch (err) {
    console.error("❌ CART UPDATE ERROR:", {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ 
      message: "Failed to update cart",
      error: err.message 
    });
  }
};

exports.clearCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [] }
  );

  res.json({ success: true });
};
