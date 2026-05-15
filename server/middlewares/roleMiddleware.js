const User = require("../models/userModel");

/**
 * Populate `req.user` after JWT `auth` has set `req.userId`.
 */
const attachUser = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Restrict route to users whose DB `role` is one of allowed roles.
 */
const requireRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient privileges",
      });
    }
    next();
  };

module.exports = { attachUser, requireRoles };
