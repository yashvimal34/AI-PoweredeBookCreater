import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const completeAuth = async () => {
      try {
        // Attempt to fetch and store the user profile
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res && res.data) {
          // Use the login function from AuthContext to properly sync state
          login(res.data, token);
        }

        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to complete auth redirect:", err);
        // If fetching profile fails, still navigate to dashboard (or login)
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    completeAuth();
  }, [navigate, searchParams, login]);

  if (loading) return <div>Processing authentication...</div>;

  return null;
};

export default AuthSuccess;
