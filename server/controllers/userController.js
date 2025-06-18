const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailHelper = require("../utils/emailHelper");

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

//Function for otp generation
const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000);
};
/**
* Math.random(): Generates a random floating-point number between 0 (inclusive) and 1
(exclusive).
Math.random() * 900000: Scales the random number to a range between 0 and 899999.
100000 + Math.random() * 900000: Shifts the range to be between 100000 and 999999.
Math.floor(): Rounds down to the nearest whole number.
*/

const forgetPassword = async function (req, res) {
  try {
    /****
     * 1. You can ask for email
     * 2. check if email is present or not
     * * if email is not present -> send a response to the user(user not found)
     * 3. if email is present -> create basic otp -> and send to the email
     * 4. also store that otp -> in the userModel
     *
     * ***/
    if (req.body.email == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password",
      });
    }
    // find the user -> going db -> getting it for the server
    let user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found for this email",
      });
    }
    // got the user -> on your server
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    // those updates will be send to the db
    await user.save();
    await emailHelper("otp.html", user.email, {
      name: user.name,
      otp: otp,
    });
    res.status(200).json({
      status: "success",
      message: "otp sent to your email",
    });
    // send the mail to there email -> otp
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
  // email
};

const resetPassword = async function (req, res) {
  // -> otp
  // newPassword and newConfirmPassword
  // -> params -> id
  try {
    let resetDetails = req.body;
    // required fields are there or not
    if (!resetDetails.password || !resetDetails.otp) {
      return res.status(401).json({
        status: "failure",
        message: "invalid request",
      });
    }
    // it will serach with the id -> user
    const user = await User.findOne({ email: req.params.email });
    // if user is not present
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    }
    // if otp is expired
    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "otp expired",
      });
    }
    user.password = req.body.password;
    // remove the otp from the user
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  forgetPassword,
  resetPassword,
};
