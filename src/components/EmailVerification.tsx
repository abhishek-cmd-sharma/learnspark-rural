import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function EmailVerification() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const { currentUser, sendVerificationEmail, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    try {
      await sendVerificationEmail();
      setCountdown(60);
      toast.success("Verification email resent! Check your inbox.");
    } catch (error: any) {
      console.error("Resend verification email error:", error);
      toast.error(error.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="text-2xl font-display text-center">
              Verify Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground mb-2">
                We've sent a verification email to:
              </p>
              <p className="font-medium">
                {currentUser?.email}
              </p>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-2">Didn't receive the email?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check your spam folder or click below to resend the verification email.
              </p>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleResendEmail}
                disabled={resending || countdown > 0}
              >
                {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend Verification Email"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}