const mongoose = require("mongoose");

module.exports = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("URI:", process.env.MONGODB_URI ? "✅ Found" : "❌ Missing");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error("Error details:", err.message);
    process.exit(1);
  }
};
