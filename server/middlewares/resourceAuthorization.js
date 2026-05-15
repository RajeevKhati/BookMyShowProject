const mongoose = require("mongoose");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");

function forbidden(res) {
  return res.status(403).json({
    success: false,
    message: "Forbidden: insufficient privileges",
  });
}

function sameId(a, b) {
  return a != null && b != null && String(a) === String(b);
}

/**
 * Theatre status (isActive approve/block) mutates admin-only.
 * Other theatre fields may be edited by owning partner or admin.
 */
const authorizeTheatreUpdate = async (req, res, next) => {
  try {
    const { theatreId } = req.body;
    if (!theatreId) {
      return res.status(400).json({
        success: false,
        message: "theatreId is required",
      });
    }
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }

    const alteringActiveFlag = typeof req.body.isActive === "boolean";
    if (alteringActiveFlag && req.user.role !== "admin") {
      return forbidden(res);
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (req.user.role !== "partner") {
      return forbidden(res);
    }

    if (!sameId(theatre.owner, req.user._id)) {
      return forbidden(res);
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const authorizeTheatreDeletion = async (req, res, next) => {
  try {
    const { theatreId } = req.params;
    if (!theatreId) {
      return res.status(400).json({
        success: false,
        message: "theatreId is required",
      });
    }
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    if (req.user.role === "admin") {
      return next();
    }
    if (req.user.role !== "partner") {
      return forbidden(res);
    }
    if (!sameId(theatre.owner, req.user._id)) {
      return forbidden(res);
    }
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Owners may list their theatres; admins may impersonate lists.
 */
const authorizeOwnerListAccess = async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  const { ownerId } = req.params;
  if (!sameId(ownerId, req.userId)) {
    return forbidden(res);
  }
  return next();
};

/** Resolve theatre id from body keys (POST payloads differ per route). */
function resolveTheatreIdFromBody(req, fieldNames) {
  for (const k of fieldNames) {
    if (req.body[k]) {
      return req.body[k];
    }
  }
  return null;
}

/** Partner may act only on their theatre; admins may manage any theatre. */
const authorizePartnerOwnedTheatreFromBody =
  (fieldNames = ["theatre", "theatreId"]) =>
  async (req, res, next) => {
    try {
      const theatreId = resolveTheatreIdFromBody(req, fieldNames);
      if (!theatreId) {
        return res.status(400).json({
          success: false,
          message: "Missing theatre reference",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(theatreId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid theatre id",
        });
      }
      const theatre = await Theatre.findById(theatreId);
      if (!theatre) {
        return res.status(404).json({ success: false, message: "Theatre not found" });
      }
      if (req.user.role === "admin") {
        return next();
      }
      if (req.user.role !== "partner") {
        return forbidden(res);
      }
      if (!sameId(theatre.owner, req.user._id)) {
        return forbidden(res);
      }
      return next();
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

/** Ensures caller may mutate the referenced show's theatre */
const authorizeShowMutation = async (req, res, next) => {
  try {
    const { showId } = req.body;
    if (!showId) {
      return res.status(400).json({
        success: false,
        message: "showId is required",
      });
    }
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }
    const theatre = await Theatre.findById(show.theatre);
    if (!theatre) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    if (req.user.role === "admin") {
      return next();
    }
    if (req.user.role !== "partner") {
      return forbidden(res);
    }
    if (!sameId(theatre.owner, req.user._id)) {
      return forbidden(res);
    }
    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  authorizeTheatreUpdate,
  authorizeTheatreDeletion,
  authorizeOwnerListAccess,
  authorizePartnerOwnedTheatreFromBody,
  authorizeShowMutation,
};
