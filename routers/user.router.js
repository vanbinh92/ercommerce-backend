const router = require('express').Router();
const { getInfor, updateInfor, createNewInfor, removeInfor, uploadAvatar, getAllInfor,createNewInforByAdmin ,updateInforByAdmin,getInforByAdmin} = require('../controllers/user.controller');
const { verifyTok } = require('../middlewares/auth');
const { checkEmail, checkPhone } = require('../middlewares/checkData');
const { isAdmin } = require('../middlewares/permission');
const upload = require('../middlewares/upload')

router.get('/:accountId/getInfor', verifyTok, getInfor);
router.post('/accounts/creatProfile',checkEmail,checkPhone, createNewInfor);
router.put("/upload/:id/users", upload.single('file'), uploadAvatar);
router.put('/:accountId/updateInfor', verifyTok, updateInfor);

router.get('/getAll', getAllInfor);
router.get('/:userId/getInfor/admin', verifyTok, getInforByAdmin);
router.put('/:userId/updateInfor/admin',verifyTok,isAdmin,updateInforByAdmin)
router.delete('/:userId/deleteInfor', verifyTok,isAdmin, removeInfor);
module.exports = router;
