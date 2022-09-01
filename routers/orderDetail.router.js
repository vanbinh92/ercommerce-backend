const { getOrderDetailById, getOrdersDetailByOrderId, getOrdersDetailByProductId, initOrderDetail } = require("../controllers/orderDetai.controller");

const router = require("express").Router();

router.get("/:id", getOrderDetailById)
router.get("/order/:orderId", getOrdersDetailByOrderId)
router.get("/product/:productId", getOrdersDetailByProductId)
router.post("/order/:orderId", initOrderDetail)

module.exports = router;
