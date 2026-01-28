const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const ctrl = require("../controllers/admin.controller");

router.use(auth, role("ADMIN"));

router.get("/analytics", ctrl.analytics);
router.get("/orders", ctrl.orders);
router.get("/users", ctrl.users);
router.get("/restaurants", ctrl.restaurants);
router.get("/inventory", ctrl.inventory);

module.exports = router;
