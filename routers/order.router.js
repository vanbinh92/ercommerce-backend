const router = require("express").Router();
const {
  getOrders,
  getOrdersByUserId,
  getOrderById,
  initOrder,
} = require("../controllers/order.controller");

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.get("/user/:userId/", getOrdersByUserId);
router.post("/", initOrder);

module.exports = router;
