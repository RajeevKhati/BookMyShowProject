const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "Registration Successful, Please login",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist. Please register.",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User logged in!",
      data: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.userId).select("-password"); //this will not include password in response object

  res.send({
    success: true,
    message: "You are authorized to go to the protected route!",
    data: user,
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
