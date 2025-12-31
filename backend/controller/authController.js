const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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
// REGISTER → SEND OTP
// ======================================================
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (!user) {
      user = await User.create({ name, email, password });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailOtp = hashedOtp;
    user.emailOtpExpires = Date.now() + 1 * 60 * 1000;
    await user.save();

    res.json({
      success: true,
      message: "OTP sent to email",
    });
    sendEmail({
      to: user.email,
      subject: "Verify your email - OTP",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f6f9fc; padding:40px 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="100%" max-width="480" cellspacing="0" cellpadding="0"
            style="background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <img 
                  src="https://res.cloudinary.com/dsmzpe5fo/image/upload/v1766946846/AI_E-book_ddhtlh.png"
                  alt="AI eBook Creator"
                  height="40"
                  style="display:block;"
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="color:#111827; font-size:20px; font-weight:600; padding-bottom:12px;">
                Verify your email address
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#374151; font-size:14px; line-height:22px; padding-bottom:24px;">
                Use the verification code below to complete your sign-up for
                <strong>AI eBook Creator</strong>.  
                This code is valid for the next <strong>1 minute</strong>.
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div
                  style="
                    display:inline-block;
                    background:#f3f4f6;
                    padding:14px 24px;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:6px;
                    color:#111827;
                    border-radius:6px;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Security note -->
            <tr>
              <td style="color:#6b7280; font-size:13px; line-height:20px; padding-bottom:24px;">
                If you did not request this code, you can safely ignore this email.
                For your security, never share this code with anyone.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="border-top:1px solid #e5e7eb; padding-top:16px; color:#9ca3af; font-size:12px;">
                © ${new Date().getFullYear()} AI eBook Creator  
                <br />
                <a href="https://ai-poweredebookcreater-1.onrender.com" style="color:#6b7280; text-decoration:none;">
                  https://ai-poweredebookcreater-1.onrender.com
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email sending failed" });
  }
};

// ======================================================
// VERIFY OTP
// ======================================================
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      emailOtp: hashedOtp,
      emailOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    user.isEmailVerified = true;
    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// RESEND OTP
// ======================================================
exports.resendEmailOtp = async (req, res) => {
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailOtp = hashedOtp;
    user.emailOtpExpires = Date.now() + 1 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your new OTP",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f6f9fc; padding:40px 0;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table width="100%" max-width="480" cellspacing="0" cellpadding="0"
            style="background:#ffffff; border-radius:8px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <img 
                  src="https://res.cloudinary.com/dsmzpe5fo/image/upload/v1766946846/AI_E-book_ddhtlh.png"
                  alt="AI eBook Creator"
                  height="40"
                  style="display:block;"
                />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="color:#111827; font-size:20px; font-weight:600; padding-bottom:12px;">
                Verify your email address
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color:#374151; font-size:14px; line-height:22px; padding-bottom:24px;">
                Use the verification code below to complete your sign-up for
                <strong>AI eBook Creator</strong>.  
                This code is valid for the next <strong>1 minute</strong>.
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding-bottom:24px;">
                <div
                  style="
                    display:inline-block;
                    background:#f3f4f6;
                    padding:14px 24px;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:6px;
                    color:#111827;
                    border-radius:6px;
                  "
                >
                  ${otp}
                </div>
              </td>
            </tr>

            <!-- Security note -->
            <tr>
              <td style="color:#6b7280; font-size:13px; line-height:20px; padding-bottom:24px;">
                If you did not request this code, you can safely ignore this email.
                For your security, never share this code with anyone.
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="border-top:1px solid #e5e7eb; padding-top:16px; color:#9ca3af; font-size:12px;">
                © ${new Date().getFullYear()} AI eBook Creator  
                <br />
                <a href="https://ai-poweredebookcreater-1.onrender.com" style="color:#6b7280; text-decoration:none;">
                  your-website.com
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`,

    });

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ======================================================
// LOGIN (PASSWORD)
// ======================================================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isEmailVerified) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================================================
// GET PROFILE
// ======================================================
exports.getProfile = async (req, res) => {
  if(!req.user) {
    return res.status(401).json({message: "Not authorized"});
  }
  
  res.json(req.user);
}

// ======================================================
// UPDATE PROFILE
// ======================================================
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name || user.name;
  await user.save();
  res.json(user);
};
