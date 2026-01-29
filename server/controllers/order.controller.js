const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Manually populate food items
    const foodIds = cart.items
      .map(item => item.food)
      .filter(foodId => mongoose.Types.ObjectId.isValid(foodId))
      .map(foodId => new mongoose.Types.ObjectId(foodId));

    if (foodIds.length === 0) {
      return res.status(400).json({ message: "No valid food items in cart" });
    }

    const foods = await Food.find({ _id: { $in: foodIds } });

    // Create a map of food data
    const foodMap = new Map();
    foods.forEach(food => {
      foodMap.set(food._id.toString(), food);
    });

    // Build order items with prices
    const orderItems = cart.items
      .map((item) => {
        const food = foodMap.get(item.food);
        if (!food) return null;
        
        return {
          food: food._id,
          quantity: item.quantity,
          price: food.price,
        };
      })
      .filter(item => item !== null);

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid items to order" });
    }

    const total = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total,
      status: "pending",
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate("items.food");

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.food")
    .sort({ createdAt: -1 });

  res.json(orders);
};

exports.details = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.food");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json(order);
};
