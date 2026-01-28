const Food = require("../models/Food");

exports.getAll = async (_, res) => {
  try {
    const foods = await Food.find().populate('restaurant', 'name image rating isOpen');
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch foods", error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant', 'name image rating isOpen');
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch food", error: err.message });
  }
};
