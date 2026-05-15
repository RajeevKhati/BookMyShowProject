const theatreRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { attachUser, requireRoles } = require("../middlewares/roleMiddleware");
const {
  authorizeTheatreUpdate,
  authorizeTheatreDeletion,
  authorizeOwnerListAccess,
} = require("../middlewares/resourceAuthorization");

const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresByOwner,
} = require("../controllers/theatreController");

const partnerOrAdminAdd = [
  authMiddleware,
  attachUser,
  requireRoles("admin", "partner"),
];

theatreRouter.post("/add-theatre", ...partnerOrAdminAdd, addTheatre);

theatreRouter.put(
  "/update-theatre",
  authMiddleware,
  attachUser,
  authorizeTheatreUpdate,
  updateTheatre
);

theatreRouter.delete(
  "/delete-theatre/:theatreId",
  authMiddleware,
  attachUser,
  authorizeTheatreDeletion,
  deleteTheatre
);

theatreRouter.get(
  "/get-all-theatres",
  authMiddleware,
  attachUser,
  requireRoles("admin"),
  getAllTheatres
);

theatreRouter.get(
  "/get-all-theatres-by-owner/:ownerId",
  authMiddleware,
  attachUser,
  authorizeOwnerListAccess,
  getAllTheatresByOwner
);

module.exports = theatreRouter;
