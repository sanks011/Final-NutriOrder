exports.create = async (_, res) => {
  res.json({ orderId: "mock_order_id" });
};

exports.verify = async (_, res) => {
  res.json({ success: true });
};
