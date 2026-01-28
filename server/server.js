const app = require("./app");
const connectDB = require("./config/db");
const seedDatabase = require("./seeds/seedData");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  // Seed database if needed (only on first run or when Food collection is empty)
  const Food = require("./models/Food");
  const foodCount = await Food.countDocuments();
  
  if (foodCount === 0) {
    console.log("📦 Database is empty, seeding initial data...");
    await seedDatabase();
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
