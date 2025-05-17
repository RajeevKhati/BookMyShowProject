const theatreRouter = require("express").Router();
const {
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getAllTheatres,
  getAllTheatresByOwner,
} = require("../controllers/theatreController");

theatreRouter.post("/add-theatre", addTheatre);

// Update theatre
theatreRouter.put("/update-theatre", updateTheatre);

// Delete theatre
theatreRouter.delete("/delete-theatre/:theatreId", deleteTheatre);

// Get all theatres for Admin route
router.get("/get-all-theatres", getAllTheatres);

// Get the theatres of a specific owner
router.get("/get-all-theatres-by-owner/:ownerId", getAllTheatresByOwner);

module.exports = theatreRouter;
