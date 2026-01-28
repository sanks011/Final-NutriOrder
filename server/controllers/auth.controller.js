const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/hash");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt");

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    console.log("📝 Registration attempt with email:", email);

    // Explicit duplicate check (case-insensitive)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log("❌ User already exists:", email.toLowerCase());
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    console.log("✅ Email is unique, proceeding with registration");

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "USER",
    });

    console.log("✅ User created successfully:", user.email);

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(201).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);

    if (error.code === 11000) {
      console.error("⚠️ Unique constraint violated - likely duplicate email");
      return res.status(400).json({
        message: "An account with this email already exists",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    console.log("🔐 Login attempt with email:", email);

    // Find user (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found with email:", email.toLowerCase());
      // Also try finding with original case for debugging
      const userOriginal = await User.findOne({ email: email });
      if (userOriginal) {
        console.log("⚠️ Found user with original case:", email, "but search was lowercase");
      }
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("✅ User found:", user.email);

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Password mismatch for user:", user.email);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};

/* =========================
   REFRESH TOKEN
========================= */
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error("❌ REFRESH ERROR:", error);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/* =========================
   ME
========================= */
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/* =========================
   LOGOUT
========================= */
exports.logout = async (_, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
};
