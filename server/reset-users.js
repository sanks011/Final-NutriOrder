/**
 * Force reset User collection via MongoDB admin commands
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://abhijitarcade010304_db_user:abhijitarcade010304_db_user@cluster0.wsvxkiy.mongodb.net/nutriorder?retryWrites=true&w=majority";

const resetUsers = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log("✅ Connected!");

    const db = mongoose.connection.db;

    // Check if collection exists
    const collections = await db.listCollections().toArray();
    const userCollectionExists = collections.some(col => col.name === "users");

    if (userCollectionExists) {
      console.log("🗑️ Dropping users collection...");
      await db.collection("users").drop();
      console.log("✅ Users collection dropped!");
    } else {
      console.log("ℹ️ Users collection doesn't exist");
    }

    // Create fresh indexes
    console.log("📝 Creating fresh indexes...");
    await db.collection("users").createIndex(
      { email: 1 },
      { unique: true, sparse: true }
    );
    console.log("✅ Fresh unique email index created!");

    console.log("\n✨ Database reset complete!");
    console.log("📌 You can now register new users");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetUsers();
