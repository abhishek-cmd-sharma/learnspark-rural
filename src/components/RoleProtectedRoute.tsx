import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Role } from "@/lib/roleService";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
  const { currentUser, loading, userData } = useAuth();
  const location = useLocation();
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  // Check if user's email is verified
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      setIsEmailVerified(false);
    }
  }, [currentUser]);

  // Show loading state while checking auth status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // If no user, redirect to home page
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If user exists but email is not verified, redirect to verification page
  if (!isEmailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // If user data is not loaded, show loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Check if user has one of the allowed roles
  if (!allowedRoles.includes(userData.role)) {
    // Redirect to appropriate dashboard based on user role
    if (userData.role === "student") {
      return <Navigate to="/student-dashboard" state={{ from: location }} replace />;
    } else if (userData.role === "teacher") {
      return <Navigate to="/teacher-dashboard" state={{ from: location }} replace />;
    } else if (userData.role === "admin") {
      return <Navigate to="/admin-dashboard" state={{ from: location }} replace />;
    } else {
      // Default redirect to home page
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  // If user exists, email is verified, and has the correct role, render children
  return <>{children}</>;
}