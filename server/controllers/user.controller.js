const User = require("../models/User");

/* =========================
   PROFILE
========================= */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

exports.updateMe = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(user);
};

/* =========================
   HEALTH / PREFERENCES
========================= */
exports.savePreferences = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      preferences: req.body,
      hasCompletedHealthProfile: true,
    },
    { new: true }
  ).select("-password");

  res.json(user);
};

exports.getPreferences = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.preferences || {});
};

/* =========================
   ADDRESSES
========================= */
exports.getAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses || []);
};

exports.saveAddresses = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { addresses: req.body },
    { new: true }
  );
  res.json(user.addresses);
};

/* =========================
   WISHLIST
========================= */
exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist || []);
};

exports.addToWishlist = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { wishlist: req.body.foodId },
  });
  res.json({ success: true });
};

exports.removeFromWishlist = async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { wishlist: req.params.foodId },
  });
  res.json({ success: true });
};
