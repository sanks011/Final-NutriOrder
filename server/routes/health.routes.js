const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/health.controller");

router.use(auth);

router.get("/summary", ctrl.summary);
router.get("/meals", ctrl.meals);
router.get("/nutrition", ctrl.nutrition);

module.exports = router;
