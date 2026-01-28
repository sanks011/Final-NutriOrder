/**
 * Fix duplicate email issue - drop old index and recreate
 * This handles the case where emails were stored with mixed case
 */

const mongoose = require("mongoose");
require("./config/db");

const fixEmailIndex = async () => {
  try {
    const User = require("./models/User");

    console.log("🔧 Fixing email index and duplicates...");

    // 1. Drop the old unique index
    try {
      await User.collection.dropIndex("email_1");
      console.log("✅ Dropped old email index");
    } catch (e) {
      console.log("⚠️ Index might not exist:", e.message);
    }

    // 2. Normalize all existing emails to lowercase
    console.log("📝 Normalizing existing emails...");
    const allUsers = await User.find();

    for (const user of allUsers) {
      if (user.email !== user.email.toLowerCase()) {
        console.log(`Converting: ${user.email} → ${user.email.toLowerCase()}`);
        user.email = user.email.toLowerCase().trim();
        await user.save();
      }
    }

    // 3. Recreate the unique index on lowercase emails
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log("✅ Created new lowercase email unique index");

    console.log("✅ Email index fix completed!");
  } catch (error) {
    console.error("❌ Error fixing email index:", error.message);
  } finally {
    process.exit(0);
  }
};

fixEmailIndex();
