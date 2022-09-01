const { getCartById, getCartByUserId, getCartByProductId, initCart,removeCart,updateCart,createCarts } = require('../controllers/cart.controller');
const router = require("express").Router();

router.get("/cart/:id", getCartById)
router.get("/user/:userId", getCartByUserId)
router.get("/product/:productId", getCartByProductId)
router.post("/user/:userId/product/:productId", initCart)
router.post("/user/:userId/products", createCarts)
router.put("/user/:userId/product/:productId", updateCart)
router.delete("/user/:userId/product/:productId", removeCart)

module.exports = router;
