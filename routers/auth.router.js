const { LoginGoogle } = require("../controllers/auth.controller");
const { verifyTokenSocial } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/google/login",verifyTokenSocial, LoginGoogle);

module.exports = router;
