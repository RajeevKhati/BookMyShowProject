const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log("req.headers", req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    console.log("token", token);
    const verifiedtoken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifiedtoken", verifiedtoken);
    req.body.userId = verifiedtoken.userId;
    next();
  } catch (error) {
    res.status(401).send({ success: false, message: "Token Invalid" });
  }
};

module.exports = auth;
