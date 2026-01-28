const mongoose = require("mongoose");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await Food.deleteMany({});
    await Restaurant.deleteMany({});

    // Create restaurants
    const restaurants = await Restaurant.create([
      {
        name: "Healthy Bites",
        image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400",
        rating: 4.5,
        isOpen: true,
      },
      {
        name: "Nutrition Hub",
        image: "https://images.unsplash.com/photo-1504674900306-f58aaf15e2af?w=400",
        rating: 4.7,
        isOpen: true,
      },
      {
        name: "Fitness Food",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        rating: 4.3,
        isOpen: true,
      },
    ]);

    console.log(`✅ Created ${restaurants.length} restaurants`);

    // Create foods with complete data
    const foods = await Food.create([
      {
        name: "Grilled Chicken Salad",
        description: "Fresh grilled chicken with mixed greens and vinaigrette",
        price: 299,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        category: "Salads",
        rating: 4.5,
        reviewCount: 25,
        restaurant: restaurants[0]._id,
        nutrition: {
          calories: 350,
          protein: 45,
          carbs: 15,
          fat: 12,
          fiber: 5,
          sugar: 3,
          sodium: 450,
          cholesterol: 80,
        },
        isDiabeticSafe: true,
        isVegan: false,
        isGlutenFree: true,
        isKeto: true,
        isHeartHealthy: true,
        isLowSodium: true,
        spiceLevel: "mild",
        tags: ["high-protein", "low-carb", "salad"],
        ingredients: ["chicken", "spinach", "tomato", "cucumber", "olive oil"],
      },
      {
        name: "Quinoa Buddha Bowl",
        description: "Nutrient-rich bowl with quinoa, roasted vegetables, and tahini dressing",
        price: 249,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        category: "Bowls",
        rating: 4.6,
        reviewCount: 32,
        restaurant: restaurants[1]._id,
        nutrition: {
          calories: 420,
          protein: 15,
          carbs: 55,
          fat: 18,
          fiber: 8,
          sugar: 5,
          sodium: 380,
          cholesterol: 0,
        },
        isDiabeticSafe: true,
        isVegan: true,
        isGlutenFree: true,
        isKeto: false,
        isHeartHealthy: true,
        isLowSodium: true,
        spiceLevel: "mild",
        tags: ["vegan", "gluten-free", "high-fiber"],
        ingredients: ["quinoa", "broccoli", "carrot", "tahini", "olive oil"],
      },
      {
        name: "Protein Pancakes",
        description: "High-protein pancakes with berries and almond butter",
        price: 199,
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
        category: "Breakfast",
        rating: 4.4,
        reviewCount: 18,
        restaurant: restaurants[0]._id,
        nutrition: {
          calories: 380,
          protein: 35,
          carbs: 35,
          fat: 8,
          fiber: 4,
          sugar: 8,
          sodium: 320,
          cholesterol: 70,
        },
        isDiabeticSafe: true,
        isVegan: false,
        isGlutenFree: true,
        isKeto: false,
        isHeartHealthy: true,
        isLowSodium: true,
        spiceLevel: "none",
        tags: ["high-protein", "breakfast", "gluten-free"],
        ingredients: ["eggs", "protein powder", "berries", "almond butter"],
      },
      {
        name: "Salmon with Steamed Broccoli",
        description: "Fresh salmon fillet with steamed broccoli and lemon sauce",
        price: 349,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        category: "Main Course",
        rating: 4.7,
        reviewCount: 28,
        restaurant: restaurants[2]._id,
        nutrition: {
          calories: 450,
          protein: 48,
          carbs: 12,
          fat: 22,
          fiber: 3,
          sugar: 2,
          sodium: 520,
          cholesterol: 95,
        },
        isDiabeticSafe: true,
        isVegan: false,
        isGlutenFree: true,
        isKeto: true,
        isHeartHealthy: true,
        isLowSodium: false,
        spiceLevel: "mild",
        tags: ["high-protein", "omega-3", "keto"],
        ingredients: ["salmon", "broccoli", "lemon", "olive oil"],
      },
      {
        name: "Green Smoothie Bowl",
        description: "Spinach and banana smoothie with granola and coconut",
        price: 179,
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        category: "Breakfast",
        rating: 4.5,
        reviewCount: 22,
        restaurant: restaurants[1]._id,
        nutrition: {
          calories: 320,
          protein: 12,
          carbs: 48,
          fat: 8,
          fiber: 6,
          sugar: 18,
          sodium: 250,
          cholesterol: 10,
        },
        isDiabeticSafe: false,
        isVegan: true,
        isGlutenFree: true,
        isKeto: false,
        isHeartHealthy: true,
        isLowSodium: true,
        spiceLevel: "none",
        tags: ["vegan", "smoothie", "breakfast"],
        ingredients: ["spinach", "banana", "almond milk", "granola"],
      },
      {
        name: "Grilled Chicken Breast",
        description: "Simple grilled chicken breast with herbs and spices",
        price: 219,
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
        category: "Main Course",
        rating: 4.3,
        reviewCount: 15,
        restaurant: restaurants[0]._id,
        nutrition: {
          calories: 280,
          protein: 52,
          carbs: 0,
          fat: 6,
          fiber: 0,
          sugar: 0,
          sodium: 380,
          cholesterol: 130,
        },
        isDiabeticSafe: true,
        isVegan: false,
        isGlutenFree: true,
        isKeto: true,
        isHeartHealthy: true,
        isLowSodium: false,
        spiceLevel: "medium",
        tags: ["high-protein", "keto", "zero-carb"],
        ingredients: ["chicken breast", "herbs", "spices"],
      },
    ]);

    console.log(`✅ Created ${foods.length} food items`);
    console.log("✅ Database seeding completed successfully!");
    return true;
  } catch (err) {
    console.error("❌ Error seeding database:", err.message);
    return false;
  }
};

module.exports = seedDatabase;
