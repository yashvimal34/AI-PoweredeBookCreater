import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";

const OTP_EXPIRY = 60;
const OTP_EXPIRY_KEY = "otp_expiry_time";

const VerifyEmail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_EXPIRY);
  const [resending, setResending] = useState(false);

  // 🔐 Restore timer on refresh
  useEffect(() => {
    const savedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);

    if (savedExpiry) {
      const remaining = Math.floor(
        (Number(savedExpiry) - Date.now()) / 1000
      );
      setTimer(remaining > 0 ? remaining : 0);
    } else {
      const expiryTime = Date.now() + OTP_EXPIRY * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, expiryTime);
      setTimer(OTP_EXPIRY);
    }
  }, []);

  // ⏱ Countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Verify OTP
      const res = await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, {
        email,
        otp,
      });

      const { token } = res.data;

      // 2️⃣ STORE TOKEN FIRST (CRITICAL FIX)
      localStorage.setItem("token", token);

      // 3️⃣ Fetch profile (interceptor will attach token)
      const profileRes = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE
      );

      // 4️⃣ Cleanup
      localStorage.removeItem(OTP_EXPIRY_KEY);

      // 5️⃣ Login
      login(profileRes.data, token);
      toast.success("Email verified");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await axiosInstance.post(API_PATHS.AUTH.RESEND_OTP, { email });

      const newExpiry = Date.now() + OTP_EXPIRY * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, newExpiry);
      setTimer(OTP_EXPIRY);

      toast.success("OTP resent");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify Email
        </h1>

        <form onSubmit={handleVerify} className="space-y-5">
          <InputField label="Email" value={email} disabled />
          <InputField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <Button isLoading={loading} className="w-full">
            Verify
          </Button>
        </form>

        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-sm text-slate-500">
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-violet-600 font-medium"
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
