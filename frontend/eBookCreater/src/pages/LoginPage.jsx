import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";
import Google from "../assets/g1.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================================
  // PASSWORD LOGIN
  // ================================
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        formData
      );

      const { token } = response.data;

      // Save token
      localStorage.setItem("token", token);

      // Fetch profile
      const profileResponse = await axiosInstance.get(
        API_PATHS.AUTH.GET_PROFILE,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      login(profileResponse.data, token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      localStorage.removeItem("token");

      // 🔐 AUTO REDIRECT IF EMAIL NOT VERIFIED
      if (error.response?.data?.requiresVerification) {
        toast.error("Please verify your email first");
        navigate("/verify-email", {
          state: { email: formData.email },
        });
        return;
      }

      toast.error(
        error.response?.data?.message || "Login failed. Try again"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to your AI eBook Creator account
            </p>
          </div>

          {/* PASSWORD LOGIN FORM */}
          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="relative">
              <InputField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full rounded-xl py-2.5 text-sm font-medium"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            onClick={() => {
              window.location.href = `${BASE_URL}/api/auth/google`;
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 text-sm font-medium hover:bg-slate-50 transition"
          >
            <img src={Google} alt="Google" className="h-5 w-5" />
            Continue with Google
          </Button>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
