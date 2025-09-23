import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserData } from "@/lib/authService";
import { User as UserData } from "@/lib/types";

// Define the shape of our auth context
interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData: Omit<UserData, "uid">) => Promise<void>;
  signInWithGoogle: (role: "student" | "teacher") => Promise<void>;
  signInWithFacebook: (role: "student" | "teacher") => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (code: string, newPassword: string) => Promise<void>;
  checkPasswordResetCode: (code: string) => Promise<string>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  getStoredToken: () => string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const fetchedUserData = await getUserData(user.uid);
          if (fetchedUserData) {
            setUserData({
              uid: fetchedUserData.uid,
              email: fetchedUserData.email,
              displayName: fetchedUserData.displayName,
              photoURL: fetchedUserData.photoURL,
              role: fetchedUserData.role,
              class: fetchedUserData.class,
              age: fetchedUserData.age,
              gradeLevel: fetchedUserData.gradeLevel,
              school: fetchedUserData.school,
              location: fetchedUserData.location,
              nativeLanguage: fetchedUserData.nativeLanguage,
              targetLanguages: fetchedUserData.targetLanguages || [],
              learningGoals: fetchedUserData.learningGoals || [],
              preferredLanguage: fetchedUserData.preferredLanguage || 'en',
              onboardingCompleted: fetchedUserData.onboardingCompleted || false,
              xp: fetchedUserData.xp || 0,
              level: fetchedUserData.level || 1,
              streak: fetchedUserData.streak || 0,
              createdAt: fetchedUserData.createdAt,
              lastLoginAt: fetchedUserData.lastLoginAt,
              lastStreakDate: fetchedUserData.lastStreakDate
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const { signIn } = await import("@/lib/authService");
    await signIn(email, password);
  };

  // Signup function
  const signup = async (email: string, password: string, userData: Omit<UserData, "uid">) => {
    const { signUp } = await import("@/lib/authService");
    await signUp(email, password, userData as any);
  };

  // Logout function
  const logout = async () => {
    const { logout: signOut } = await import("@/lib/authService");
    await signOut();
  };

  // Google sign-in function
  const signInWithGoogle = async (role: "student" | "teacher") => {
    const { signInWithGoogle: googleSignIn } = await import("@/lib/authService");
    await googleSignIn(role);
  };

  // Password reset function
 const resetPassword = async (email: string) => {
    const { resetPassword: reset } = await import("@/lib/authService");
    await reset(email);
  };

  // Facebook sign-in function
  const signInWithFacebook = async (role: "student" | "teacher") => {
    const { signInWithFacebook: facebookSignIn } = await import("@/lib/authService");
    await facebookSignIn(role);
  };

  // Confirm password reset function
  const confirmResetPassword = async (code: string, newPassword: string) => {
    const { confirmResetPassword: confirm } = await import("@/lib/authService");
    await confirm(code, newPassword);
  };

  // Check password reset code function
  const checkPasswordResetCode = async (code: string) => {
    const { checkPasswordResetCode: check } = await import("@/lib/authService");
    return await check(code);
  };

  // Send email verification function
  const sendVerificationEmail = async () => {
    const { sendVerificationEmail: send } = await import("@/lib/authService");
    await send();
  };

  // Verify email function
  const verifyEmail = async (code: string) => {
    const { verifyEmail: verify } = await import("@/lib/authService");
    await verify(code);
  };

  // Refresh token function
  const refreshToken = async () => {
    const { refreshToken: refresh } = await import("@/lib/authService");
    return await refresh();
  };

  // Get stored token function
  const getStoredToken = () => {
    const { getStoredToken: getToken } = require("@/lib/authService");
    return getToken();
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    signInWithGoogle,
    signInWithFacebook,
    logout,
    resetPassword,
    confirmResetPassword,
    checkPasswordResetCode,
    sendVerificationEmail,
    verifyEmail,
    refreshToken,
    getStoredToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};