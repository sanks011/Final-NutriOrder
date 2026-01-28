const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/cart.controller");

router.use(auth);

router.get("/", ctrl.getCart);
router.put("/", ctrl.updateCart);
router.delete("/", ctrl.clearCart);

module.exports = router;
