const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

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
// REGISTER USER (MANUAL SIGNUP WITH OTP)
// ======================================================
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      isEmailVerified: false,
    });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    // 🔥 NON-BLOCKING EMAIL SEND (CRITICAL FIX)
    sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is ${otp}. It expires in 2 minutes.`,
    }).catch((err) => {
      console.error("Email send failed:", err.message);
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// VERIFY EMAIL OTP
// ======================================================
exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select(
      "+emailVerificationOTP +emailVerificationExpires"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // ⛔ HARD EXPIRY CHECK (FIXED)
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(
      otp,
      user.emailVerificationOTP
    );

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({
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
// RESEND OTP
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
    user.emailVerificationExpires = new Date(Date.now() + 2 * 60 * 1000);
    await user.save();

    // ⏱ HARD 10s TIMEOUT
    await Promise.race([
      sendEmail({
        to: user.email,
        subject: "Resend OTP - Verify your email",
        text: `Your new verification code is ${otp}. It expires in 2 minutes.`,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 10000)
      ),
    ]);

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// LOGIN USER
// ======================================================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🚫 BLOCK UNVERIFIED MANUAL USERS
    if (!user.isEmailVerified && !user.googleId) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// GET PROFILE
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
// UPDATE PROFILE
// ======================================================
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
