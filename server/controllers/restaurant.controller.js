const Restaurant = require("../models/Restaurant");
exports.getAll = async (_, res) => res.json(await Restaurant.find());
exports.getOne = async (req, res) =>
  res.json(await Restaurant.findById(req.params.id));
