import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, ArrowLeft, Chrome, Sparkles, Zap, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { CongratsPopup } from "@/components/CongratsPopup";
import { StudentOnboarding, StudentOnboardingData } from "@/components/StudentOnboarding";
import { userService } from "@/lib/firestoreService";

const SignIn = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [popupData, setPopupData] = useState<{
    userName?: string;
    isNewUser: boolean;
    role: "student" | "teacher";
  } | null>(null);
  const { login, signup, signInWithGoogle, resetPassword, userData } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [resetEmail, setResetEmail] = useState("");
  
  // Animation states
  const [showBlastEffect, setShowBlastEffect] = useState(false);
  const [blastPosition, setBlastPosition] = useState({ x: 0, y: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignIn) {
        // Sign in logic
        await login(formData.email, formData.password);
        // Show congrats popup for returning users
        setPopupData({
          userName: userData?.displayName,
          isNewUser: false,
          role: (userData?.role as "student" | "teacher") || "student"
        });
        setShowCongratsPopup(true);
      } else {
        // Sign up logic
        await signup(formData.email, formData.password, {
          displayName: formData.name,
          email: formData.email,
          photoURL: null,
          role: activeTab === "student" ? "student" : "teacher",
          xp: 0,
          level: 1,
          streak: 0,
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
        // Show congrats popup for new users
        setPopupData({
          userName: formData.name,
          isNewUser: true,
          role: activeTab === "student" ? "student" : "teacher"
        });
        setShowCongratsPopup(true);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle(activeTab === "student" ? "student" : "teacher");
      // Show congrats popup - for Google sign-in, we assume it's a new user if no userData exists
      setPopupData({
        userName: userData?.displayName,
        isNewUser: !userData, // If no userData, it's likely a new user
        role: activeTab === "student" ? "student" : "teacher"
      });
      setShowCongratsPopup(true);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await resetPassword(resetEmail);
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  const handleCongratsClose = () => {
    setShowCongratsPopup(false);
    
    // If it's a new student, show onboarding
    if (popupData?.isNewUser && popupData?.role === "student") {
      setShowOnboarding(true);
    } else {
      setPopupData(null);
      navigate("/dashboard");
    }
  };

  const handleOnboardingComplete = async (onboardingData: StudentOnboardingData) => {
    try {
      if (userData?.uid) {
        // Update user data with onboarding information
        await userService.updateUser(userData.uid, {
          age: onboardingData.age,
          gradeLevel: onboardingData.gradeLevel,
          school: onboardingData.school,
          location: onboardingData.location,
          class: onboardingData.class,
          nativeLanguage: onboardingData.nativeLanguage,
          targetLanguages: onboardingData.targetLanguages,
          learningGoals: onboardingData.learningGoals,
          preferredLanguage: onboardingData.preferredLanguage,
          onboardingCompleted: true
        });
        
        toast.success("Profile setup completed! Welcome to EduQuest!");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Failed to save profile information");
    } finally {
      setShowOnboarding(false);
      setPopupData(null);
      navigate("/dashboard");
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setPopupData(null);
    navigate("/dashboard");
  };

  // Create blast effect at click position
  const triggerBlastEffect = (e: React.MouseEvent) => {
    setBlastPosition({ x: e.clientX, y: e.clientY });
    setShowBlastEffect(true);
    setTimeout(() => setShowBlastEffect(false), 1000);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="cosmic-card relative overflow-hidden">
            {/* Blast effect overlay */}
            <AnimatePresence>
              {showBlastEffect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 2 }}
                  exit={{ opacity: 0, scale: 3 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ left: blastPosition.x - 20, top: blastPosition.y - 20 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent blur-md" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <CardHeader className="space-y-4 relative">
              <Button
                variant="ghost"
                className="self-start p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={() => setShowForgotPassword(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
              <CardTitle className="text-2xl font-display text-center">
                Reset Password 🔐
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Enter your email address and we'll send you a password reset link.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="resetEmail"
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full" 
                    variant="cosmic" 
                    type="submit"
                    onClick={triggerBlastEffect}
                  >
                    Send Reset Link
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-bold text-sm">EQ</span>
              </motion.div>
              <motion.span 
                className="font-display font-bold text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                EduQuest
              </motion.span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sign In Form */}
      <div className="flex items-center justify-center p-4 pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="cosmic-card relative overflow-hidden">
            {/* Blast effect overlay */}
            <AnimatePresence>
              {showBlastEffect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 2 }}
                  exit={{ opacity: 0, scale: 3 }}
                  className="absolute inset-0 pointer-events-none"
                  style={{ left: blastPosition.x - 20, top: blastPosition.y - 20 }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent blur-md" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <CardHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mx-auto mb-4"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl font-display text-center">
                {isSignIn ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Welcome Back! 🚀
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Join EduQuest! 🚀
                  </motion.span>
                )}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                {isSignIn ? "Sign in to continue your learning journey" : "Start your educational adventure today"}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>

                <TabsContent value="student" className="space-y-6">
                  {/* Google Sign In */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full relative overflow-hidden"
                      onClick={(e) => {
                        handleGoogleSignIn();
                        triggerBlastEffect(e);
                      }}
                      disabled={googleLoading}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      {googleLoading ? "Signing in..." : "Continue with Google"}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <motion.form
                    onSubmit={(e) => {
                      handleSubmit(e);
                      triggerBlastEffect(e as any);
                    }}
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                  >
                    {!isSignIn && (
                      <motion.div
                        className="space-y-2"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            className="pl-10"
                            value={formData.name}
                            onChange={handleChange}
                            required={!isSignIn}
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="space-y-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={isSignIn ? "Enter your password" : "Create password"}
                          className="pl-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    {isSignIn && (
                      <motion.div
                        className="text-right"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </button>
                      </motion.div>
                    )}

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full relative overflow-hidden"
                          variant="cosmic"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : isSignIn ? (
                            <span className="flex items-center justify-center">
                              <Zap className="mr-2 h-4 w-4" />
                              Sign In
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <Star className="mr-2 h-4 w-4" />
                              Start My Learning Journey! 🌟
                            </span>
                          )}
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.form>
                </TabsContent>

                <TabsContent value="teacher" className="space-y-6">
                  {/* Google Sign In */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full relative overflow-hidden"
                      onClick={(e) => {
                        handleGoogleSignIn();
                        triggerBlastEffect(e);
                      }}
                      disabled={googleLoading}
                      type="button"
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      {googleLoading ? "Signing in..." : "Continue with Google"}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <motion.form
                    onSubmit={(e) => {
                      handleSubmit(e);
                      triggerBlastEffect(e as any);
                    }}
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.2,
                        },
                      },
                    }}
                  >
                    {!isSignIn && (
                      <motion.div
                        className="space-y-2"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            className="pl-10"
                            value={formData.name}
                            onChange={handleChange}
                            required={!isSignIn}
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      className="space-y-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder={isSignIn ? "Enter your password" : "Create password"}
                          className="pl-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </motion.div>

                    {isSignIn && (
                      <motion.div
                        className="text-right"
                        variants={{
                          hidden: { opacity: 0, y: 10 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </button>
                      </motion.div>
                    )}

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full relative overflow-hidden"
                          variant="cosmic"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Processing..." : isSignIn ? (
                            <span className="flex items-center justify-center">
                              <Zap className="mr-2 h-4 w-4" />
                              Sign In
                            </span>
                          ) : (
                            <span className="flex items-center justify-center">
                              <Star className="mr-2 h-4 w-4" />
                              Join as Teacher 📚
                            </span>
                          )}
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.form>
                </TabsContent>
              </Tabs>

              {/* Toggle Sign In/Sign Up */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <motion.button 
                  type="button"
                  className="text-primary hover:underline font-semibold"
                  onClick={() => setIsSignIn(!isSignIn)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Congrats Popup */}
      <CongratsPopup
        isVisible={showCongratsPopup}
        onClose={handleCongratsClose}
        userName={popupData?.userName}
        isNewUser={popupData?.isNewUser}
        role={popupData?.role}
      />

      {/* Student Onboarding */}
      <StudentOnboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
};

export default SignIn;
