/**
 * Clean up MongoDB User collection and indexes
 */

const mongoose = require("mongoose");
require("./config/db");

const cleanupDatabase = async () => {
  try {
    console.log("🧹 Starting database cleanup...");

    const User = require("./models/User");

    // 1. Drop the entire User collection
    console.log("🗑️ Dropping User collection...");
    try {
      await User.collection.drop();
      console.log("✅ User collection dropped successfully");
    } catch (e) {
      if (e.code === 26) {
        console.log("⚠️ Collection doesn't exist (this is fine)");
      } else {
        console.error("❌ Error dropping collection:", e.message);
      }
    }

    // 2. Drop all indexes
    console.log("🗑️ Dropping all indexes...");
    try {
      await User.collection.dropIndexes();
      console.log("✅ All indexes dropped");
    } catch (e) {
      if (e.code === 27) {
        console.log("⚠️ No indexes to drop");
      } else {
        console.error("⚠️ Error dropping indexes:", e.message);
      }
    }

    // 3. Create fresh collection with proper schema
    console.log("📝 Creating fresh collection...");
    await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log("✅ New unique email index created");

    console.log("\n✅ Database cleanup completed successfully!");
    console.log("📌 You can now register with any email address");

  } catch (error) {
    console.error("❌ Cleanup error:", error.message);
  } finally {
    process.exit(0);
  }
};

cleanupDatabase();
