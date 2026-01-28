require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const errorHandler = require("./middlewares/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const foodRoutes = require("./routes/food.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const paymentRoutes = require("./routes/payment.routes");
const healthRoutes = require("./routes/health.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
const cartRoutes = require("./routes/cart.routes");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(express.json());
app.use(cookieParser());

// ✅ FIXED CORS (NO WILDCARD ROUTES)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS not allowed for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use(errorHandler);

module.exports = app;
