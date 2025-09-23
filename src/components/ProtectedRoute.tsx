import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

  // If user exists and email is verified, render children
  return <>{children}</>;
}