import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation();

    if (loading) {
        // adding spinner here
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
export default ProtectedRoute