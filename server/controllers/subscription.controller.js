const Subscription = require("../models/Subscription");

exports.get = async (req, res) => {
  const sub = await Subscription.findOne({ user: req.user._id });
  res.json(sub);
};

exports.create = async (req, res) => {
  const existing = await Subscription.findOne({ user: req.user._id });
  if (existing) {
    return res.status(400).json({ message: "Subscription already exists" });
  }

  const sub = await Subscription.create({
    user: req.user._id,
    plan: req.body.plan,
    meals: req.body.meals || [],
    status: "active",
    nextDelivery: req.body.nextDelivery,
  });

  res.status(201).json(sub);
};

exports.cancel = async (req, res) => {
  await Subscription.findOneAndUpdate(
    { user: req.user._id },
    { status: "cancelled" }
  );
  res.json({ success: true });
};
