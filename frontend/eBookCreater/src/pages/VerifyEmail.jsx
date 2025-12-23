import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const OTP_EXPIRY_SECONDS = 120; // 2 minutes

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_EXPIRY_SECONDS);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔁 Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔐 Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      return toast.error("Email and OTP are required");
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/api/auth/verify-email", {
        email,
        otp,
      });

      const { token } = res.data;

      const profileRes = await axiosInstance.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      login(profileRes.data, token);
      toast.success("Email verified successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOTP = async () => {
    if (!email) {
      return toast.error("Please enter your email first");
    }

    try {
      setResending(true);

      await axiosInstance.post("/api/auth/resend-otp", {
  email,
});


      toast.success("New OTP sent to your email");
      setTimer(OTP_EXPIRY_SECONDS); // restart timer
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  // ⏱ Format timer
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h1>
        <p className="text-center text-slate-600 mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            label="OTP"
            type="text"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Verify Email
          </Button>
        </form>

        {/* TIMER + RESEND */}
        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-sm text-slate-500">
              Resend OTP in <span className="font-medium">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={resending}
              className="text-sm font-medium text-violet-600 hover:underline disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
