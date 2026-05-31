const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailHelper = require("../utils/emailHelper");

const SALT_ROUNDS = 10;

const register = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
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

    let passwordOk = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // Legacy: plaintext passwords stored before hashing — upgrade on successful login
    if (!passwordOk && user.password === req.body.password) {
      passwordOk = true;
      user.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      await user.save();
    }
    if (!passwordOk) {
      return res.send({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
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

// OTP: random 6-digit integer
const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000);
};
/*
 * Math.random(): 0 (inclusive) to 1 (exclusive).
 * * 900000 → range 0..899999; +100000 → 100000..999999; floor → integer.
 */

const forgetPassword = async function (req, res) {
  try {
    /****
     * 1. Ask for email
     * 2. If missing email → failure
     * 3. If user exists → generate OTP, save + expiry on user
     * 4. Send OTP email; on send failure → clear OTP and return 503
     ****/
    if (req.body.email == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password",
      });
    }
    // Look up user in DB
    let user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found for this email",
      });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    try {
      // Delegates to Resend or SendGrid based on env (see utils/email/)
      await emailHelper("otp.html", user.email, {
        name: user.name,
        otp: otp,
      });
    } catch (emailErr) {
      console.error("forgetPassword: email failed:", emailErr);
      try {
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
      } catch (rollbackErr) {
        console.error("forgetPassword: OTP rollback failed:", rollbackErr);
      }
      return res.status(503).json({
        status: "failure",
        message:
          "Unable to send the reset email. Please try again later or contact support.",
      });
    }
    res.status(200).json({
      status: "success",
      message: "otp sent to your email",
    });
    // Success: OTP email accepted by provider
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

const resetPassword = async function (req, res) {
  // Body: password, otp | Params: email (URL)
  try {
    let resetDetails = req.body;
    // Required: new password + OTP from email
    if (!resetDetails.password || !resetDetails.otp) {
      return res.status(401).json({
        status: "failure",
        message: "invalid request",
      });
    }
    // User row for this email (from URL)
    const user = await User.findOne({ email: req.params.email });
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    }
    // OTP window still valid?
    if (!user.otp || !user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "No active reset request. Please request a new code.",
      });
    }
    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "otp expired",
      });
    }
    if (String(user.otp) !== String(resetDetails.otp).trim()) {
      return res.status(401).json({
        status: "failure",
        message: "Invalid verification code",
      });
    }
    user.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    user.otp = undefined;
    user.otpExpiry = undefined; // clear OTP fields after successful reset
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
