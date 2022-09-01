const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

// login to get token, after appending that token into header

const verifyTok = async (req, res, next) => {
  const tok = req.headers["access-token"];
  // not found token
  if (!tok) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  const accessToken = tok.split(" ")[1];
  // verify token
  try {
    const { id } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.id = id;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Forbidden! You don't have permission to access this resource.",
    });
  }
};
const verifyTokenSocial = async (req,res,next) => {
  const tok = req.headers["access-token"];
  // not found token
  if (!tok) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  const token = tok.split(" ")[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      next();
    }
  } catch (e) {
    return res.status(403).json({
      message: "Forbidden! You don't have permission to access this resource.",
    });
  }
};

module.exports = {
  verifyTok,
  verifyTokenSocial
};
