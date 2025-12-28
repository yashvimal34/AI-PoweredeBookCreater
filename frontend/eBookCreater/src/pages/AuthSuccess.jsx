import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // 🔑 SAVE TOKEN FIRST (THIS WAS MISSING)
        localStorage.setItem("token", token);

        // Fetch user profile using token
        const response = await axiosInstance.get(
          API_PATHS.AUTH.GET_PROFILE,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Save user in auth context
        login(response.data, token);

        navigate("/dashboard");
      } catch (error) {
        console.error("Auth success failed", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate, login]);

  return <p className="text-center mt-10">Signing you in…</p>;
};

export default AuthSuccess;
