const express = require("express");
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/get-current-user", auth, getCurrentUser);

module.exports = userRouter;
