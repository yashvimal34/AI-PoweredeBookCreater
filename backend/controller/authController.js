const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // 🔹 OTP EMAIL UTILITY

// ======================================================
// Helper: Generate JWT
// ======================================================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ======================================================
// Helper: Generate 6-digit OTP
// ======================================================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ======================================================
// @desc Register new user (MANUAL SIGNUP WITH OTP)
// @route POST /api/auth/register
// @access Public
// ======================================================
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ======================================================
    // 🔐 OTP IMPLEMENTATION START
    // ======================================================

    // Create user as UNVERIFIED
    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
    });

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP before saving
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save OTP + expiry (10 minutes)
    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is ${otp}. It expires in 2 minutes.`,
    });

    // ======================================================
    // 🔐 OTP IMPLEMENTATION END
    // ======================================================

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to continue.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// @desc Verify Email OTP
// @route POST /api/auth/verify-email
// @access Public
// ======================================================
exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select(
      "+emailVerificationOTP"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isOTPValid = await bcrypt.compare(
      otp,
      user.emailVerificationOTP
    );

    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// @desc Resend Email OTP
// @route POST /api/auth/resend-otp
// @access Public
// ======================================================
exports.resendEmailOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = Date.now() + 2 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Resend OTP - Verify your email",
      text: `Your new verification code is ${otp}. It expires in 2 minutes.`,
    });

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ======================================================
// @desc Login User
// @route POST /api/auth/login
// @access Public
// ======================================================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 Block login if email not verified (manual users only)
    if (!user.isEmailVerified && !user.googleId) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    if (await user.matchPassword(password)) {
      res.json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// @desc Get current logged-in user
// @route GET /api/auth/profile
// @access Private
// ======================================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
// ======================================================
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
