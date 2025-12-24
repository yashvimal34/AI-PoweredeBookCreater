const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email utility (OTP, etc.)
 */
const sendEmail = async ({ to, subject, text }) => {
  try {
    await resend.emails.send({
      from: "AI eBook Creator <onboarding@resend.dev>",
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
