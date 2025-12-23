const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,

  // 🔐 OTP: VERIFY EMAIL CONTROLLER (NEW)
  verifyEmailOTP,
  resendEmailOTP,
  // 🔐 OTP: VERIFY EMAIL CONTROLLER (END)

} = require("../controller/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// ======================================================
// Google OAuth Routes (UNCHANGED)
// ======================================================

// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}`
      );
    } catch (error) {
      console.error(error);
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=google_failed`
      );
    }
  }
);

// ======================================================
// Normal Auth Routes (UNCHANGED)
// ======================================================

// Manual signup (OTP is handled inside controller)
router.post("/register", registerUser);

// Login (blocks unverified users inside controller)
router.post("/login", loginUser);

// ======================================================
// 🔐 OTP ROUTE START (NEW)
// ======================================================

// Verify email OTP (manual signup only)
router.post("/verify-email", verifyEmailOTP);

// ======================================================
// 🔐 OTP ROUTE END
// ======================================================

// 🔐 Resend OTP
router.post("/resend-otp", resendEmailOTP);


// ======================================================
// Protected Routes (UNCHANGED)
// ======================================================

router.get("/me", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
