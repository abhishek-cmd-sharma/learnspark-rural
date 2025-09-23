import { doc, setDoc, getDoc, updateDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { 
  UserProfile, 
  StudentProfile, 
  TeacherProfile, 
 UserPreferences,
  ProficiencyLevel,
  TeacherAvailability
} from "./types";
import { toDate } from "./firestoreService";

// Profile service error class
export class ProfileServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ProfileServiceError";
  }
}

// Profile service functions
export const profileService = {
 // Get user profile by UID
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: userDoc.id,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          role: data.role,
          createdAt: toDate(data.createdAt)!,
          lastLoginAt: toDate(data.lastLoginAt)!,
          isActive: data.isActive ?? true,
          preferences: data.preferences || {
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: {
              email: true,
              push: true
            }
          }
        } as UserProfile;
      }
      return null;
    } catch (error) {
      throw new ProfileServiceError(`Failed to get user profile: ${error.message}`, "GET_PROFILE_ERROR");
    }
  },

  // Create or initialize user profile
  async createUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      const now = new Date();
      
      // Default preferences if not provided
      const defaultPreferences: UserPreferences = {
        language: profileData.preferences?.language || "en",
        timezone: profileData.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: profileData.preferences?.notifications || {
          email: true,
          push: true
        }
      };
      
      await setDoc(userRef, {
        uid,
        email: profileData.email || "",
        displayName: profileData.displayName || "",
        photoURL: profileData.photoURL || null,
        role: profileData.role || "student",
        createdAt: profileData.createdAt || now,
        lastLoginAt: profileData.lastLoginAt || now,
        isActive: profileData.isActive ?? true,
        preferences: defaultPreferences,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      throw new ProfileServiceError(`Failed to create user profile: ${error.message}`, "CREATE_PROFILE_ERROR");
    }
  },

  // Update user profile
  async updateUserProfile(uid: string, profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new ProfileServiceError(`Failed to update user profile: ${error.message}`, "UPDATE_PROFILE_ERROR");
    }
  },

  // Update user preferences
  async updateUserPreferences(uid: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      
      // Get current preferences
      const userProfile = await this.getUserProfile(uid);
      if (!userProfile) {
        throw new ProfileServiceError("User profile not found", "PROFILE_NOT_FOUND");
      }
      
      const updatedPreferences: UserPreferences = {
        language: preferences.language || userProfile.preferences.language,
        timezone: preferences.timezone || userProfile.preferences.timezone,
        notifications: {
          email: preferences.notifications?.email ?? userProfile.preferences.notifications.email,
          push: preferences.notifications?.push ?? userProfile.preferences.notifications.push
        }
      };
      
      await updateDoc(userRef, {
        "preferences": updatedPreferences,
        updatedAt: new Date()
      });
    } catch (error) {
      if (error instanceof ProfileServiceError) {
        throw error;
      }
      throw new ProfileServiceError(`Failed to update user preferences: ${error.message}`, "UPDATE_PREFERENCES_ERROR");
    }
  },

  // Get student profile by user ID
  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const studentDoc = await getDoc(doc(db, "studentProfiles", userId));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        return {
          userId: studentDoc.id,
          age: data.age || 0,
          gradeLevel: data.gradeLevel || "",
          school: data.school || "",
          location: data.location || "",
          nativeLanguage: data.nativeLanguage || "",
          targetLanguages: data.targetLanguages || [],
          learningGoals: data.learningGoals || [],
          proficiencyLevel: data.proficiencyLevel || {
            speaking: "beginner",
            listening: "beginner",
            reading: "beginner",
            writing: "beginner"
          },
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
          lastStreakDate: toDate(data.lastStreakDate) || new Date(),
          enrolledClasses: data.enrolledClasses || [],
          achievements: data.achievements || [],
          createdAt: toDate(data.createdAt) || new Date(),
          updatedAt: toDate(data.updatedAt) || new Date()
        } as StudentProfile;
      }
      return null;
    } catch (error) {
      throw new ProfileServiceError(`Failed to get student profile: ${error.message}`, "GET_STUDENT_PROFILE_ERROR");
    }
  },

  // Create or initialize student profile
  async createStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<void> {
    try {
      const studentRef = doc(db, "studentProfiles", userId);
      const now = new Date();
      
      // Default proficiency level if not provided
      const defaultProficiencyLevel: ProficiencyLevel = {
        speaking: profileData.proficiencyLevel?.speaking || "beginner",
        listening: profileData.proficiencyLevel?.listening || "beginner",
        reading: profileData.proficiencyLevel?.reading || "beginner",
        writing: profileData.proficiencyLevel?.writing || "beginner"
      };
      
      await setDoc(studentRef, {
        userId,
        age: profileData.age || 0,
        gradeLevel: profileData.gradeLevel || "",
        school: profileData.school || "",
        location: profileData.location || "",
        nativeLanguage: profileData.nativeLanguage || "",
        targetLanguages: profileData.targetLanguages || [],
        learningGoals: profileData.learningGoals || [],
        proficiencyLevel: defaultProficiencyLevel,
        xp: profileData.xp || 0,
        level: profileData.level || 1,
        streak: profileData.streak || 0,
        lastStreakDate: profileData.lastStreakDate || now,
        enrolledClasses: profileData.enrolledClasses || [],
        achievements: profileData.achievements || [],
        createdAt: profileData.createdAt || now,
        updatedAt: profileData.updatedAt || now
      }, { merge: true });
    } catch (error) {
      throw new ProfileServiceError(`Failed to create student profile: ${error.message}`, "CREATE_STUDENT_PROFILE_ERROR");
    }
  },

  // Update student profile
  async updateStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<void> {
    try {
      const studentRef = doc(db, "studentProfiles", userId);
      await updateDoc(studentRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new ProfileServiceError(`Failed to update student profile: ${error.message}`, "UPDATE_STUDENT_PROFILE_ERROR");
    }
  },

  // Get teacher profile by user ID
  async getTeacherProfile(userId: string): Promise<TeacherProfile | null> {
    try {
      const teacherDoc = await getDoc(doc(db, "teacherProfiles", userId));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        return {
          userId: teacherDoc.id,
          qualifications: data.qualifications || [],
          specializations: data.specializations || [],
          yearsOfExperience: data.yearsOfExperience || 0,
          bio: data.bio || "",
          school: data.school || "",
          location: data.location || "",
          teachingLanguages: data.teachingLanguages || [],
          availability: data.availability || {
            monday: { start: "09:00", end: "17:00" },
            tuesday: { start: "09:00", end: "17:00" },
            wednesday: { start: "09:00", end: "17:00" },
            thursday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
            saturday: { start: "09:00", end: "17:00" },
            sunday: { start: "09:00", end: "17:00" }
          },
          rating: data.rating || 0,
          totalRatings: data.totalRatings || 0,
          classesTaught: data.classesTaught || [],
          createdAt: toDate(data.createdAt) || new Date(),
          updatedAt: toDate(data.updatedAt) || new Date()
        } as TeacherProfile;
      }
      return null;
    } catch (error) {
      throw new ProfileServiceError(`Failed to get teacher profile: ${error.message}`, "GET_TEACHER_PROFILE_ERROR");
    }
  },

  // Create or initialize teacher profile
  async createTeacherProfile(userId: string, profileData: Partial<TeacherProfile>): Promise<void> {
    try {
      const teacherRef = doc(db, "teacherProfiles", userId);
      const now = new Date();
      
      // Default availability if not provided
      const defaultAvailability: TeacherAvailability = {
        monday: profileData.availability?.monday || { start: "09:00", end: "17:0" },
        tuesday: profileData.availability?.tuesday || { start: "09:00", end: "17:00" },
        wednesday: profileData.availability?.wednesday || { start: "09:00", end: "17:00" },
        thursday: profileData.availability?.thursday || { start: "09:00", end: "17:00" },
        friday: profileData.availability?.friday || { start: "09:00", end: "17:00" },
        saturday: profileData.availability?.saturday || { start: "09:00", end: "17:00" },
        sunday: profileData.availability?.sunday || { start: "09:00", end: "17:0" }
      };
      
      await setDoc(teacherRef, {
        userId,
        qualifications: profileData.qualifications || [],
        specializations: profileData.specializations || [],
        yearsOfExperience: profileData.yearsOfExperience || 0,
        bio: profileData.bio || "",
        school: profileData.school || "",
        location: profileData.location || "",
        teachingLanguages: profileData.teachingLanguages || [],
        availability: defaultAvailability,
        rating: profileData.rating || 0,
        totalRatings: profileData.totalRatings || 0,
        classesTaught: profileData.classesTaught || [],
        createdAt: profileData.createdAt || now,
        updatedAt: profileData.updatedAt || now
      }, { merge: true });
    } catch (error) {
      throw new ProfileServiceError(`Failed to create teacher profile: ${error.message}`, "CREATE_TEACHER_PROFILE_ERROR");
    }
  },

  // Update teacher profile
  async updateTeacherProfile(userId: string, profileData: Partial<TeacherProfile>): Promise<void> {
    try {
      const teacherRef = doc(db, "teacherProfiles", userId);
      await updateDoc(teacherRef, {
        ...profileData,
        updatedAt: new Date()
      });
    } catch (error) {
      throw new ProfileServiceError(`Failed to update teacher profile: ${error.message}`, "UPDATE_TEACHER_PROFILE_ERROR");
    }
  },

  // Validate profile data
  validateProfileData(profileData: Partial<UserProfile>): string[] {
    const errors: string[] = [];
    
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.push("Invalid email format");
    }
    
    if (profileData.displayName && profileData.displayName.length > 50) {
      errors.push("Display name must be less than 50 characters");
    }
    
    if (profileData.role && !["student", "teacher", "admin"].includes(profileData.role)) {
      errors.push("Invalid role");
    }
    
    return errors;
  },

  // Validate student profile data
  validateStudentProfileData(profileData: Partial<StudentProfile>): string[] {
    const errors: string[] = [];
    
    if (profileData.age && (profileData.age < 5 || profileData.age > 100)) {
      errors.push("Age must be between 5 and 100");
    }
    
    if (profileData.gradeLevel && profileData.gradeLevel.length > 20) {
      errors.push("Grade level must be less than 20 characters");
    }
    
    if (profileData.school && profileData.school.length > 100) {
      errors.push("School name must be less than 100 characters");
    }
    
    if (profileData.location && profileData.location.length > 100) {
      errors.push("Location must be less than 100 characters");
    }
    
    if (profileData.nativeLanguage && profileData.nativeLanguage.length > 30) {
      errors.push("Native language must be less than 30 characters");
    }
    
    return errors;
  },

  // Validate teacher profile data
  validateTeacherProfileData(profileData: Partial<TeacherProfile>): string[] {
    const errors: string[] = [];
    
    if (profileData.yearsOfExperience && profileData.yearsOfExperience < 0) {
      errors.push("Years of experience cannot be negative");
    }
    
    if (profileData.bio && profileData.bio.length > 500) {
      errors.push("Bio must be less than 500 characters");
    }
    
    if (profileData.school && profileData.school.length > 100) {
      errors.push("School name must be less than 100 characters");
    }
    
    if (profileData.location && profileData.location.length > 100) {
      errors.push("Location must be less than 100 characters");
    }
    
    return errors;
  }
};