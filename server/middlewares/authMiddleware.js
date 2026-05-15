const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Bearer token missing" });
    }
    const token = header.slice(7).trim();
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: empty token" });
    }
    const verifiedtoken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifiedtoken.userId;
    next();
  } catch (error) {
    console.log("Auth Error => ", error);
    res.status(401).json({ success: false, message: "Token Invalid" });
  }
};

module.exports = auth;
