import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  signInWithPopup,
  sendEmailVerification,
  applyActionCode,
  confirmPasswordReset,
  verifyPasswordResetCode
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toDate } from "./firestoreService";

// User data interface
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: "student" | "teacher" | "admin";
  class?: string;
  age?: string;
  school?: string;
  location?: string;
  xp?: number;
  level?: number;
  streak?: number;
  lastStreakDate?: Date;
  createdAt?: Date;
  lastLoginAt?: Date;
}

// Extended user data for profile
export interface ExtendedUserData extends UserData {
  createdAt: Date;
  lastLoginAt: Date;
  xp: number;
  level: number;
  streak: number;
  lastStreakDate?: Date;
}

// Sign up function
export const signUp = async (
  email: string,
  password: string,
  userData: Omit<UserData, "uid">
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName
      });
    }
    
    // Save additional user data to Firestore
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      role: userData.role,
      class: userData.class,
      age: userData.age,
      school: userData.school,
      location: userData.location,
      xp: userData.xp || 0,
      level: userData.level || 1,
      streak: userData.streak || 0,
      lastStreakDate: userData.lastStreakDate,
      createdAt: userData.createdAt || new Date(),
      lastLoginAt: userData.lastLoginAt || new Date()
    });
    
    // Send email verification
    await sendVerificationEmail();
    
    return userCredential;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign in function
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    const userDocRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userDocRef, {
      lastLoginAt: new Date()
    }, { merge: true });
    
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Google sign in function
export const signInWithGoogle = async (role: "student" | "teacher"): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create new user document for first-time Google sign-in
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        xp: 0,
        level: 1,
        streak: 0,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
    } else {
      // Update last login time for existing user
      await setDoc(userDocRef, {
        lastLoginAt: new Date()
      }, { merge: true });
    }
    
    return userCredential;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Facebook sign in function
export const signInWithFacebook = async (role: "student" | "teacher"): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithPopup(auth, facebookProvider);
    const user = userCredential.user;
    
    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Create new user document for first-time Facebook sign-in
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: role,
        xp: 0,
        level: 1,
        streak: 0,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
    } else {
      // Update last login time for existing user
      await setDoc(userDocRef, {
        lastLoginAt: new Date()
      }, { merge: true });
    }
    
    return userCredential;
  } catch (error) {
    console.error("Error signing in with Facebook:", error);
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error("No user is currently signed in");
    }
  } catch (error) {
    console.error("Error sending email verification:", error);
    throw error;
  }
};

// Verify email with code
export const verifyEmail = async (code: string): Promise<void> => {
  try {
    await applyActionCode(auth, code);
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

// Refresh auth token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true); // Force refresh
      // Store token in secure storage (localStorage/sessionStorage)
      localStorage.setItem("authToken", token);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Get stored auth token
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("authToken");
  } catch (error) {
    console.error("Error getting stored token:", error);
    return null;
  }
};

// Clear stored auth token
export const clearStoredToken = (): void => {
  try {
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error clearing stored token:", error);
  }
};

// Sign out function
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Password reset function
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Confirm password reset
export const confirmResetPassword = async (code: string, newPassword: string): Promise<void> => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error: any) {
    console.error("Error confirming password reset:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Verify password reset code
export const checkPasswordResetCode = async (code: string): Promise<string> => {
  try {
    return await verifyPasswordResetCode(auth, code);
  } catch (error: any) {
    console.error("Error verifying password reset code:", error);
    throw new Error(getAuthErrorMessage(error));
  }
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error: any): string => {
  if (!error.code) return "An unknown error occurred";
  
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please use a different email or sign in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/expired-action-code":
      return "This action code has expired.";
    case "auth/invalid-action-code":
      return "This action code is invalid.";
    case "auth/invalid-credential":
      return "Invalid credentials provided.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    default:
      return "An error occurred. Please try again.";
  }
};

// Get user data from Firestore
export const getUserData = async (uid: string): Promise<ExtendedUserData | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role,
        class: data.class,
        age: data.age,
        school: data.school,
        location: data.location,
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        lastStreakDate: toDate(data.lastStreakDate),
        createdAt: toDate(data.createdAt) || new Date(),
        lastLoginAt: toDate(data.lastLoginAt) || new Date()
      } as ExtendedUserData;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};
