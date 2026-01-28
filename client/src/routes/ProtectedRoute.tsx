import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHealth } from "@/context/HealthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireHealthProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireHealthProfile = false,
}) => {
  const { user, loading } = useAuth();
  const { isProfileComplete } = useHealth();
  const location = useLocation();

  // ⏳ WAIT until auth is resolved
  if (loading) {
    return null; // or spinner
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 🛡️ ADMIN GUARD
  if (requireAdmin && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // 🧠 HEALTH PROFILE GUARD
  if (
    requireHealthProfile &&
    !isProfileComplete &&
    !user.hasCompletedHealthProfile &&
    location.pathname !== "/preferences"
  ) {
    return <Navigate to="/preferences" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
