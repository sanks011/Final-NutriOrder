const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/order.controller");

router.use(auth);

router.post("/", ctrl.create);
router.get("/me", ctrl.myOrders);
router.get("/:id", ctrl.details);

module.exports = router;
