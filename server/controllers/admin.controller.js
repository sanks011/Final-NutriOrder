const Order = require("../models/Order");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

exports.analytics = async (_, res) => {
  res.json({
    totalUsers: await User.countDocuments(),
    totalOrders: await Order.countDocuments(),
    totalRestaurants: await Restaurant.countDocuments()
  });
};

exports.orders = async (_, res) => {
  res.json(await Order.find().populate("user"));
};

exports.users = async (_, res) => {
  res.json(await User.find().select("-password"));
};

exports.restaurants = async (_, res) => {
  res.json(await Restaurant.find());
};

exports.inventory = async (_, res) => {
  res.json({ message: "Inventory mock" });
};
