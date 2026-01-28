const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/subscription.controller");

router.use(auth);

router.get("/", ctrl.get);
router.post("/", ctrl.create);
router.post("/cancel", ctrl.cancel);

module.exports = router;
