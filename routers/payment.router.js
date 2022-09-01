const { getPayById, initPay, getPayByOrderId } = require("../controllers/payment.controller");


const router = require("express").Router();

router.get("/payments/:id", getPayById);
router.get("orders/:orderId", getPayByOrderId);
router.post("/", initPay);
  

module.exports = router;