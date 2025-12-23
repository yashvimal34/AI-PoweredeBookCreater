const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
      select: false,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    isPro: {
      type: Boolean,
      default: false,
    },

    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: function () {
        // Google user are already verified
        return !!this.googleId;
      },
    },
    emailVerificationOTP: {
      type: String,
      select: false, // never expose OTP
    },
    emailVerificationExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
