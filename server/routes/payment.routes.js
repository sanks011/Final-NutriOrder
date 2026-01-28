const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/payment.controller");

router.post("/create", auth, ctrl.create);
router.post("/verify", auth, ctrl.verify);

module.exports = router;
