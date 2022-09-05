const { LoginGoogle,LoginFacebook } = require("../controllers/auth.controller");
const { verifyTokenSocial } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/google/login",verifyTokenSocial, LoginGoogle);
router.get("/facebook/login",verifyTokenSocial, LoginFacebook);

module.exports = router;
