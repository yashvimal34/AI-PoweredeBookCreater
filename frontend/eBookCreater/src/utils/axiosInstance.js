import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000, // 60 seconds
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors in globally
        if (error.response) {
            if (error.response.status === 500) console.error("Server error. Try later.");
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout.");
        } else {
            console.error("Network or CORS issue.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;