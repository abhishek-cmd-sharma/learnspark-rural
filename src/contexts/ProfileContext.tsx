import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { profileService, ProfileServiceError } from "@/lib/profileService";
import { UserProfile, StudentProfile, TeacherProfile } from "@/lib/types";
import { useAuth } from "./AuthContext";

// Define the shape of our profile context
interface ProfileContextType {
  userProfile: UserProfile | null;
  studentProfile: StudentProfile | null;
  teacherProfile: TeacherProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  updateStudentProfile: (profileData: Partial<StudentProfile>) => Promise<void>;
  updateTeacherProfile: (profileData: Partial<TeacherProfile>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserProfile["preferences"]>) => Promise<void>;
}

// Create the context
const ProfileContext = createContext<ProfileContextType | null>(null);

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

// Profile provider component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, userData } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profiles when user is authenticated
  useEffect(() => {
    if (currentUser && userData) {
      loadProfiles();
    } else {
      // Clear profiles when user logs out
      setUserProfile(null);
      setStudentProfile(null);
      setTeacherProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [currentUser, userData]);

  // Load all profiles for the current user
  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser || !userData) {
        throw new Error("User not authenticated");
      }
      
      // Load user profile
      const userProfileData = await profileService.getUserProfile(currentUser.uid);
      if (userProfileData) {
        setUserProfile(userProfileData);
      } else {
        // Create initial user profile if it doesn't exist
        await profileService.createUserProfile(currentUser.uid, {
          email: currentUser.email || "",
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || null,
          role: userData.role,
          preferences: {
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: {
              email: true,
              push: true
            }
          }
        });
        
        // Reload the profile
        const newUserProfileData = await profileService.getUserProfile(currentUser.uid);
        setUserProfile(newUserProfileData);
      }
      
      // Load role-specific profile
      if (userData.role === "student") {
        const studentProfileData = await profileService.getStudentProfile(currentUser.uid);
        if (studentProfileData) {
          setStudentProfile(studentProfileData);
        } else {
          // Create initial student profile if it doesn't exist
          await profileService.createStudentProfile(currentUser.uid, {
            userId: currentUser.uid,
            age: userData.age ? parseInt(userData.age) : 0,
            gradeLevel: userData.class || "",
            school: userData.school || "",
            location: userData.location || "",
            nativeLanguage: "en",
            targetLanguages: [],
            learningGoals: [],
            proficiencyLevel: {
              speaking: "beginner",
              listening: "beginner",
              reading: "beginner",
              writing: "beginner"
            },
            xp: userData.xp || 0,
            level: userData.level || 1,
            streak: userData.streak || 0,
            lastStreakDate: userData.lastStreakDate || new Date(),
            enrolledClasses: [],
            achievements: []
          });
          
          // Reload the profile
          const newStudentProfileData = await profileService.getStudentProfile(currentUser.uid);
          setStudentProfile(newStudentProfileData);
        }
      } else if (userData.role === "teacher") {
        const teacherProfileData = await profileService.getTeacherProfile(currentUser.uid);
        if (teacherProfileData) {
          setTeacherProfile(teacherProfileData);
        } else {
          // Create initial teacher profile if it doesn't exist
          await profileService.createTeacherProfile(currentUser.uid, {
            userId: currentUser.uid,
            qualifications: [],
            specializations: [],
            yearsOfExperience: 0,
            bio: "",
            school: userData.school || "",
            location: userData.location || "",
            teachingLanguages: [],
            availability: {
              monday: { start: "09:00", end: "17:00" },
              tuesday: { start: "09:00", end: "17:00" },
              wednesday: { start: "09:00", end: "17:00" },
              thursday: { start: "09:00", end: "17:00" },
              friday: { start: "09:00", end: "17:00" },
              saturday: { start: "09:00", end: "17:00" },
              sunday: { start: "09:00", end: "17:00" }
            },
            rating: 0,
            totalRatings: 0,
            classesTaught: []
          });
          
          // Reload the profile
          const newTeacherProfileData = await profileService.getTeacherProfile(currentUser.uid);
          setTeacherProfile(newTeacherProfileData);
        }
      }
    } catch (err) {
      console.error("Error loading profiles:", err);
      setError(err instanceof ProfileServiceError ? err.message : "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  // Refresh all profiles
  const refreshProfile = async () => {
    await loadProfiles();
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      // Validate profile data
      const validationErrors = profileService.validateProfileData(profileData);
      if (validationErrors.length > 0) {
        throw new ProfileServiceError(`Validation errors: ${validationErrors.join(", ")}`);
      }
      
      await profileService.updateUserProfile(currentUser.uid, profileData);
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...profileData
        });
      }
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError(err instanceof ProfileServiceError ? err.message : "Failed to update profile");
      throw err;
    }
  };

  // Update student profile
  const updateStudentProfile = async (profileData: Partial<StudentProfile>) => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      if (userData?.role !== "student") {
        throw new Error("User is not a student");
      }
      
      // Validate profile data
      const validationErrors = profileService.validateStudentProfileData(profileData);
      if (validationErrors.length > 0) {
        throw new ProfileServiceError(`Validation errors: ${validationErrors.join(", ")}`);
      }
      
      await profileService.updateStudentProfile(currentUser.uid, profileData);
      
      // Update local state
      if (studentProfile) {
        setStudentProfile({
          ...studentProfile,
          ...profileData
        });
      }
    } catch (err) {
      console.error("Error updating student profile:", err);
      setError(err instanceof ProfileServiceError ? err.message : "Failed to update student profile");
      throw err;
    }
  };

  // Update teacher profile
  const updateTeacherProfile = async (profileData: Partial<TeacherProfile>) => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      if (userData?.role !== "teacher") {
        throw new Error("User is not a teacher");
      }
      
      // Validate profile data
      const validationErrors = profileService.validateTeacherProfileData(profileData);
      if (validationErrors.length > 0) {
        throw new ProfileServiceError(`Validation errors: ${validationErrors.join(", ")}`);
      }
      
      await profileService.updateTeacherProfile(currentUser.uid, profileData);
      
      // Update local state
      if (teacherProfile) {
        setTeacherProfile({
          ...teacherProfile,
          ...profileData
        });
      }
    } catch (err) {
      console.error("Error updating teacher profile:", err);
      setError(err instanceof ProfileServiceError ? err.message : "Failed to update teacher profile");
      throw err;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<UserProfile["preferences"]>) => {
    try {
      if (!currentUser) {
        throw new Error("User not authenticated");
      }
      
      await profileService.updateUserPreferences(currentUser.uid, preferences);
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          preferences: {
            ...userProfile.preferences,
            ...preferences
          }
        });
      }
    } catch (err) {
      console.error("Error updating user preferences:", err);
      setError(err instanceof ProfileServiceError ? err.message : "Failed to update preferences");
      throw err;
    }
  };

  const value = {
    userProfile,
    studentProfile,
    teacherProfile,
    loading,
    error,
    refreshProfile,
    updateUserProfile,
    updateStudentProfile,
    updateTeacherProfile,
    updateUserPreferences
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};