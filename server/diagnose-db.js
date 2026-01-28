/**
 * Complete database diagnostic and fix
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI;

const diagnose = async () => {
  try {
    console.log("🔍 Connecting to MongoDB...");
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    
    // Clear module cache and reload User model
    delete require.cache[require.resolve("./models/User")];
    const User = require("./models/User");

    // 1. Check if collection exists
    console.log("1️⃣ Checking if 'users' collection exists...");
    const collections = await db.listCollections().toArray();
    const userCollectionExists = collections.find(col => col.name === "users");
    
    if (userCollectionExists) {
      console.log("✅ Users collection exists");
    } else {
      console.log("❌ Users collection does NOT exist - creating...");
      await db.createCollection("users");
      console.log("✅ Users collection created");
    }

    // 2. Count documents
    console.log("\n2️⃣ Counting documents in users collection...");
    const userCount = await User.countDocuments();
    console.log(`📊 Total users: ${userCount}`);

    // 3. List all users
    if (userCount > 0) {
      console.log("\n3️⃣ Existing users:");
      const allUsers = await User.find().select("email name");
      allUsers.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.email} (${u.name})`);
      });
    }

    // 4. Check indexes
    console.log("\n4️⃣ Checking indexes...");
    const indexes = await User.collection.getIndexes();
    console.log("Current indexes:");
    Object.entries(indexes).forEach(([name, spec]) => {
      console.log(`  - ${name}:`, JSON.stringify(spec));
    });

    // 5. Fix: Drop stale indexes and recreate
    console.log("\n5️⃣ Fixing indexes...");
    try {
      // Get all index names except _id_
      const indexNames = Object.keys(indexes).filter(name => name !== "_id_");
      
      if (indexNames.length > 0) {
        console.log(`Dropping ${indexNames.length} indexes...`);
        for (const indexName of indexNames) {
          await User.collection.dropIndex(indexName);
          console.log(`  ✓ Dropped ${indexName}`);
        }
      }

      // Create fresh unique email index with collation for case-insensitive uniqueness
      await User.collection.createIndex(
        { email: 1 },
        {
          unique: true,
          sparse: true,
          collation: { locale: "en", strength: 2 } // Case-insensitive
        }
      );
      console.log("✅ Created new case-insensitive unique email index");
    } catch (indexError) {
      console.error("⚠️ Index error:", indexError.message);
    }

    // 6. Test registration
    console.log("\n6️⃣ Test: Attempting to create test user...");
    try {
      const testUser = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword123",
        role: "USER"
      });
      console.log("✅ Test user created successfully:", testUser.email);

      // Try creating with different case
      try {
        const duplicateTest = await User.create({
          name: "Duplicate Test",
          email: "TEST@EXAMPLE.COM",
          password: "hashedpassword456",
          role: "USER"
        });
        console.log("❌ ERROR: Duplicate was created! Index not working properly");
      } catch (dupError) {
        if (dupError.code === 11000) {
          console.log("✅ Duplicate email correctly rejected (code 11000)");
        } else {
          console.log("✅ Duplicate email correctly rejected:", dupError.message);
        }
      }

      // Clean up test user
      await User.deleteOne({ email: "test@example.com" });
      console.log("✅ Test user cleaned up");
    } catch (testError) {
      console.error("❌ Test error:", testError.message);
    }

    console.log("\n✨ Diagnosis complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    process.exit(0);
  }
};

diagnose();
