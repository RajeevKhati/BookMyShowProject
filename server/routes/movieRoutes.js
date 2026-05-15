const movieRouter = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { attachUser, requireRoles } = require("../middlewares/roleMiddleware");

const {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require("../controllers/movieController");

const adminWrites = [
  authMiddleware,
  attachUser,
  requireRoles("admin"),
];

movieRouter.post("/add-movie", ...adminWrites, addMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.put("/update-movie", ...adminWrites, updateMovie);
movieRouter.put("/delete-movie", ...adminWrites, deleteMovie);
movieRouter.get("/movie/:id", getMovieById);

module.exports = movieRouter;
