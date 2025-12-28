import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyEmail from "./pages/VerifyEmail";
import DashboardPage from "./pages/DashboardPage";
import EditorPage from "./pages/EditorPage";
import ViewBookPage from "./pages/ViewBookPage";
import ProfilePage from "./pages/ProfilePage";
import AuthSuccess from "./pages/AuthSuccess";

const App = () => {
  return (
    <Routes>
      {/* ===================== */}
      {/* Public Routes */}
      {/* ===================== */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/signup" element={<SignupPage />} />

      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Google OAuth redirect */}
      <Route path="/auth-success" element={<AuthSuccess />} />

      {/* ===================== */}
      {/* Protected Routes */}
      {/* ===================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor/:bookId"
        element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/view-book/:bookId"
        element={
          <ProtectedRoute>
            <ViewBookPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
