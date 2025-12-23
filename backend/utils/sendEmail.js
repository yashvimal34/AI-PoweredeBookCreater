const nodemailer = require("nodemailer");

/**
 * Send email utility (used for OTP verification)
 */
const sendEmail = async ({ to, subject, text }) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"AI eBook Creator" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
