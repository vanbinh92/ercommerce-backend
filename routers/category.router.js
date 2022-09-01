const router = require('express').Router();
const { getCategory, initCategory, updateCategory, removeCategory,  getCategoryByCategoryId } = require('../controllers/category.controller.js');
const { verifyTok } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/permission.js');


router.get("/", getCategory);
router.get("/:categoryId", getCategoryByCategoryId);


router.post("/",verifyTok,isAdmin, initCategory)
router.put("/:categoryId", verifyTok, isAdmin, updateCategory)
router.delete("/:categoryId", verifyTok, isAdmin, removeCategory)


module.exports = router;
