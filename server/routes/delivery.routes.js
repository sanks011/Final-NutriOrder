const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const ctrl = require("../controllers/delivery.controller");

router.use(auth, role("DELIVERY"));

router.get("/orders", ctrl.assignedOrders);
router.put("/orders/:id/status", ctrl.updateStatus);

module.exports = router;
