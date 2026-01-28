const Order = require("../models/Order");

exports.assignedOrders = async (req, res) => {
  res.json(await Order.find({ assignedDelivery: req.user.id }));
};

exports.updateStatus = async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.json({ message: "Status updated" });
};
