const router = require('express').Router();
const { initManufacturer, getManufacturer, updateManufacturer, removeManufacturer, getManufacturerById ,getManufacturerByCategoryId} = require('../controllers/manufacture.controller')
const { verifyTok } = require('../middlewares/auth.js');
const { isAdmin } = require('../middlewares/permission.js');


router.get("/", getManufacturer);
router.get("/:manufactureId", getManufacturerById);
router.get("/category/:categoryId", getManufacturerByCategoryId);
router.post("/", verifyTok, isAdmin, initManufacturer);
router.put("/:manufactureId", verifyTok, isAdmin, updateManufacturer);
router.delete("/:manufactureId", verifyTok, isAdmin, removeManufacturer);


module.exports = router;
