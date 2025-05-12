const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedtoken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifiedtoken", verifiedtoken);
    req.userId = verifiedtoken.userId;
    next();
  } catch (error) {
    console.log("Auth Error => ", error);
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};

module.exports = auth;
