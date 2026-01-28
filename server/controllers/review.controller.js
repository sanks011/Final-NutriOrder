const Review = require("../models/Review");

exports.create = async (req, res) => {
  const review = await Review.create({
    user: req.user.id,
    food: req.body.foodId,
    rating: req.body.rating,
    comment: req.body.comment
  });
  res.json(review);
};

exports.byFood = async (req, res) => {
  const reviews = await Review.find({ food: req.params.foodId })
    .populate("user", "name");
  res.json(reviews);
};
