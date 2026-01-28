exports.summary = async (_, res) => {
  res.json({ calories: 2200, protein: 120 });
};

exports.meals = async (_, res) => {
  res.json([]);
};

exports.nutrition = async (_, res) => {
  res.json({ carbs: 50, fat: 30, protein: 20 });
};
