const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/user.controller");

router.use(auth);

// Profile
router.get("/me", ctrl.getMe);
router.put("/me", ctrl.updateMe);

// Preferences
router.get("/preferences", ctrl.getPreferences);
router.put("/preferences", ctrl.savePreferences);

// Addresses
router.get("/addresses", ctrl.getAddresses);
router.put("/addresses", ctrl.saveAddresses);

// Wishlist
router.get("/wishlist", ctrl.getWishlist);
router.post("/wishlist", ctrl.addToWishlist);
router.delete("/wishlist/:foodId", ctrl.removeFromWishlist);

module.exports = router;
