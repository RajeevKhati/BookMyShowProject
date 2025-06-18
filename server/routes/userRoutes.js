const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", register);

userRouter.post("/login", login);

userRouter.get("/get-current-user", auth, getCurrentUser);

userRouter.patch("/forgetpassword", forgetPassword);

userRouter.patch("/resetpassword/:email", resetPassword);

module.exports = userRouter;
