const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.create = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.food");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // ✅ NORMALIZE ORDER ITEMS
  const orderItems = cart.items.map((item) => ({
    food: item.food._id,
    quantity: item.quantity,
    price: item.food.price,
  }));

  const total = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    total,
    status: "pending", // ✅ VALID ENUM
  });

  // ✅ CLEAR CART (NOT DELETE)
  cart.items = [];
  await cart.save();

  const populatedOrder = await Order.findById(order._id).populate("items.food");

  res.status(201).json(populatedOrder);
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
