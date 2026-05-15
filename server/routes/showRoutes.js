const {
  addShow,
  deleteShow,
  updateShow,
  getAllShowsByTheatre,
  getAllTheatresByMovie,
  getShowById,
} = require("../controllers/showController");

const showRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { attachUser, requireRoles } = require("../middlewares/roleMiddleware");
const {
  authorizePartnerOwnedTheatreFromBody,
  authorizeShowMutation,
} = require("../middlewares/resourceAuthorization");

/** Partner dashboards and admin tooling */
const theatreScopedDashboard = [
  authMiddleware,
  attachUser,
  requireRoles("admin", "partner"),
  authorizePartnerOwnedTheatreFromBody(["theatre", "theatreId"]),
];

showRouter.post("/add-show", ...theatreScopedDashboard, addShow);
showRouter.post(
  "/get-all-shows-by-theatre",
  ...theatreScopedDashboard,
  getAllShowsByTheatre
);

showRouter.post("/delete-show", [
  authMiddleware,
  attachUser,
  requireRoles("admin", "partner"),
  authorizeShowMutation,
  deleteShow,
]);

showRouter.put("/update-show", [
  authMiddleware,
  attachUser,
  requireRoles("admin", "partner"),
  authorizeShowMutation,
  updateShow,
]);

/** Public catalogue & booking lookups */
showRouter.post("/get-all-theatres-by-movie", getAllTheatresByMovie);
showRouter.post("/get-show-by-id", getShowById);

module.exports = showRouter;
