const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  verifyEmailOtp,
  resendEmailOtp,
  loginUser,
  getProfile,
  updateUserProfile,
} = require("../controller/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/* GOOGLE OAUTH (UNCHANGED) */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  }
);

/* OTP AUTH */
router.post("/register", registerUser);
router.post("/verify-otp", verifyEmailOtp);
router.post("/resend-otp", resendEmailOtp);


/* PASSWORD LOGIN */
router.post("/login", loginUser);

/* PROFILE */
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
