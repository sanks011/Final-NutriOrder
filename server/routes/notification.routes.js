const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/notification.controller");

router.use(auth);

router.get("/", ctrl.getMyNotifications);
router.put("/:id/read", ctrl.markAsRead);

module.exports = router;
