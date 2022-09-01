const express = require("express");


const router = express.Router();
const upload = require("../middlewares/upload");

const {
  getAllProduct,
  getProductById,
  getProductByCategoryId,
  getProductByManufactureId,
  pagination,
  initProduct,
  updateProduct,
  removeProduct,
  paginationByCategory,
  searchProducts,
} = require("../controllers/product.controller");
const { verifyTok } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/permission");

// API get all product
router.get("/getAll", getAllProduct);
router.get("/category/:categoryId", getProductByCategoryId);
router.get("/manufacture/:manufactureId", getProductByManufactureId);
router.get("/pagination", pagination);
router.get("/search", searchProducts);

router.get("/:productId", getProductById);
router.post("/", verifyTok, isAdmin, upload.single("file"), initProduct);
router.put("/:productId", verifyTok, isAdmin, updateProduct);
router.delete("/:productId", verifyTok, isAdmin, removeProduct);

router.get("/pagination/category/:categoryId", paginationByCategory);

module.exports = router;
