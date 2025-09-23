import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { X, Mail, Lock, User, Chrome, Facebook } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("student");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const { login, signup, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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
        toast.success("Signed in successfully!");
        onClose();
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
        toast.success("Account created successfully!");
        onClose();
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
      toast.success("Signed in with Google successfully!");
      onClose();
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
    try {
      await signInWithFacebook(activeTab === "student" ? "student" : "teacher");
      toast.success("Signed in with Facebook successfully!");
      onClose();
    } catch (error: any) {
      console.error("Facebook sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Facebook");
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card className="cosmic-card">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardTitle className="text-2xl font-display text-center">
                  {isSignIn ? "Welcome Back! 🚀" : "Join EduQuest! 🚀"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="teacher">Teacher</TabsTrigger>
                  </TabsList>

                  <TabsContent value="student">
                    <div className="space-y-6">
                      {/* Google Sign In */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        type="button"
                      >
                        <Chrome className="mr-2 h-4 w-4" />
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                      </Button>
                      
                      {/* Facebook Sign In */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleFacebookSignIn}
                        disabled={facebookLoading}
                        type="button"
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        {facebookLoading ? "Signing in..." : "Continue with Facebook"}
                      </Button>

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
                      <form onSubmit={handleSubmit} className="space-y-4">
                      {!isSignIn && (
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="name" 
                              placeholder="Enter your name" 
                              className="pl-10" 
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
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
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="Create password" 
                            className="pl-10" 
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant="cosmic" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : isSignIn ? "Sign In" : "Start My Learning Journey! 🌟"}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <button 
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => setIsSignIn(!isSignIn)}
                        >
                          {isSignIn ? "Sign up" : "Sign in"}
                        </button>
                      </div>
                      
                      {isSignIn && (
                        <div className="text-center text-sm">
                          <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={() => {
                              onClose();
                              navigate("/reset-password");
                            }}
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="teacher">
                    <div className="space-y-6">
                      {/* Google Sign In */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        type="button"
                      >
                        <Chrome className="mr-2 h-4 w-4" />
                        {googleLoading ? "Signing in..." : "Continue with Google"}
                      </Button>
                      
                      {/* Facebook Sign In */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleFacebookSignIn}
                        disabled={facebookLoading}
                        type="button"
                      >
                        <Facebook className="mr-2 h-4 w-4" />
                        {facebookLoading ? "Signing in..." : "Continue with Facebook"}
                      </Button>

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
                      <form onSubmit={handleSubmit} className="space-y-4">
                      {!isSignIn && (
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="name" 
                              placeholder="Enter your name" 
                              className="pl-10" 
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
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
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="Create password" 
                            className="pl-10" 
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant="cosmic" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Processing..." : isSignIn ? "Sign In" : "Join as Teacher 📚"}
                      </Button>

                      <div className="text-center text-sm text-muted-foreground">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <button 
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => setIsSignIn(!isSignIn)}
                        >
                          {isSignIn ? "Sign up" : "Sign in"}
                        </button>
                      </div>
                      
                      {isSignIn && (
                        <div className="text-center text-sm">
                          <button
                            type="button"
                            className="text-primary hover:underline"
                            onClick={() => {
                              onClose();
                              navigate("/reset-password");
                            }}
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}