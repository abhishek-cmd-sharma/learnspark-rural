import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import {
  userService,
  subjectService,
  quizService,
  userQuizAttemptService,
  achievementService,
  userAchievementService,
  contestService,
  userContestParticipationService,
  createRealTimeListener,
  leaderboardService,
  lessonService,
  userLessonProgressService,
  teacherStudentService
} from "@/lib/firestoreService";
import {
  User,
  Subject,
  Quiz,
  UserQuizAttempt,
  Achievement,
  UserAchievement,
  Contest,
  UserContestParticipation,
  Lesson,
  UserLessonProgress,
  StudentPerformance,
  TeacherStudent
} from "@/lib/types";
import { AchievementTracker, AchievementTrackingContext } from "@/lib/achievementService";
import { initializeAchievements } from "@/lib/achievementService";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toDate } from "@/lib/firestoreService";

// Define the shape of our Firestore context
interface FirestoreContextType {
  // User data
  user: User | null;
  loadingUser: boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // Subjects
  subjects: Subject[];
  loadingSubjects: boolean;
  errorSubjects: string | null;
  getSubject: (id: string) => Promise<Subject | null>;
  createSubject: (subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateSubject: (id: string, subjectData: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  // Quizzes
  getQuizzesBySubject: (subjectId: string) => Promise<Quiz[]>;
  getQuiz: (id: string) => Promise<Quiz | null>;
  createQuiz: (quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateQuiz: (id: string, quizData: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  
  // User quiz attempts
  userQuizAttempts: UserQuizAttempt[];
  loadingUserQuizAttempts: boolean;
  errorUserQuizAttempts: string | null;
  createUserQuizAttempt: (attemptData: Omit<UserQuizAttempt, "id" | "startedAt" | "completedAt">) => Promise<string>;
  updateUserQuizAttempt: (id: string, attemptData: Partial<UserQuizAttempt>) => Promise<void>;
  
  // Achievements
  achievements: Achievement[];
  loadingAchievements: boolean;
  getAchievement: (id: string) => Promise<Achievement | null>;
  createAchievement: (achievementData: Omit<Achievement, "id" | "createdAt">) => Promise<string>;
  updateAchievement: (id: string, achievementData: Partial<Achievement>) => Promise<void>;
  
  // User achievements
  userAchievements: UserAchievement[];
  loadingUserAchievements: boolean;
  createUserAchievement: (achievementData: Omit<UserAchievement, "id" | "unlockedAt">) => Promise<string>;
  checkAchievements: () => Promise<void>;
  newlyUnlockedAchievement: Achievement | null;
  clearNewlyUnlockedAchievement: () => void;
  
  // Contests
  contests: Contest[];
  loadingContests: boolean;
  getContest: (id: string) => Promise<Contest | null>;
  createContest: (contestData: Omit<Contest, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateContest: (id: string, contestData: Partial<Contest>) => Promise<void>;
  deleteContest: (id: string) => Promise<void>;
  
  // User contest participations
  userContestParticipations: UserContestParticipation[];
  loadingUserContestParticipations: boolean;
  createUserContestParticipation: (participationData: Omit<UserContestParticipation, "id" | "joinedAt">) => Promise<string>;
  updateUserContestParticipation: (id: string, participationData: Partial<UserContestParticipation>) => Promise<void>;
  
  // Leaderboard
  getGlobalLeaderboard: (limit?: number) => Promise<any[]>;
  getWeeklyLeaderboard: (limit?: number) => Promise<any[]>;
  getMonthlyLeaderboard: (limit?: number) => Promise<any[]>;
  
  // Lessons
  getLessonsBySubject: (subjectId: string) => Promise<Lesson[]>;
  getLesson: (id: string) => Promise<Lesson | null>;
  createLesson: (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">) => Promise<string>;
  updateLesson: (id: string, lessonData: Partial<Lesson>) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  
  // User lesson progress
  getUserLessonProgress: (userId: string, subjectId?: string) => Promise<UserLessonProgress[]>;
  updateUserLessonProgress: (progressData: Omit<UserLessonProgress, "id">) => Promise<string>;
  
  // Teacher-student relationships
  getStudentsByTeacher: (teacherId: string) => Promise<TeacherStudent[]>;
  getStudentsByTeacherWithUserData: (teacherId: string) => Promise<User[]>;
  getStudentPerformance: (teacherId: string, subjectId?: string) => Promise<StudentPerformance[]>;
}

// Create the context
const FirestoreContext = createContext<FirestoreContextType | null>(null);

// Custom hook to use the Firestore context
export const useFirestore = () => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }
  return context;
};

// Firestore provider component
export const FirestoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, userData } = useAuth();
  
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);
  
  // User quiz attempts state
  const [userQuizAttempts, setUserQuizAttempts] = useState<UserQuizAttempt[]>([]);
  const [loadingUserQuizAttempts, setLoadingUserQuizAttempts] = useState(true);
  const [errorUserQuizAttempts, setErrorUserQuizAttempts] = useState<string | null>(null);
  
  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  
  // User achievements state
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loadingUserAchievements, setLoadingUserAchievements] = useState(true);
  
  // Achievement tracker state
  const [achievementTracker, setAchievementTracker] = useState<AchievementTracker | null>(null);
  
  // Newly unlocked achievement (for popup)
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);
  
  // Contests state
  const [contests, setContests] = useState<Contest[]>([]);
  const [loadingContests, setLoadingContests] = useState(true);
  
  // User contest participations state
  const [userContestParticipations, setUserContestParticipations] = useState<UserContestParticipation[]>([]);
  const [loadingUserContestParticipations, setLoadingUserContestParticipations] = useState(true);
  
  // Initialize achievements on component mount
  useEffect(() => {
    initializeAchievements();
  }, []);
  
  // Initialize achievement tracker
  useEffect(() => {
    if (user && achievements.length > 0 && userAchievements) {
      const context: AchievementTrackingContext = {
        user,
        userQuizAttempts,
        achievements,
        userAchievements,
        subjects
      };
      
      const tracker = new AchievementTracker(context, (achievement) => {
        // Callback when achievement is unlocked
        setNewlyUnlockedAchievement(achievement);
      });
      
      setAchievementTracker(tracker);
    }
  }, [user, userQuizAttempts, achievements, userAchievements, subjects]);
  
  // Update achievement tracker context when data changes
  useEffect(() => {
    if (achievementTracker) {
      const context: AchievementTrackingContext = {
        user,
        userQuizAttempts,
        achievements,
        userAchievements,
        subjects
      };
      achievementTracker.updateContext(context);
    }
  }, [user, userQuizAttempts, achievements, userAchievements, achievementTracker, subjects]);
  
  // Load user data
  useEffect(() => {
    if (!currentUser) {
      setUser(null);
      setLoadingUser(false);
      return;
    }
    
    setLoadingUser(true);
    
    // Set up real-time listener for user data
    const unsubscribe = createRealTimeListener.user(currentUser.uid, (userData) => {
      setUser(userData);
      setLoadingUser(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);
  
  // Load subjects with real-time updates (only when authenticated)
  useEffect(() => {
    if (!currentUser) {
      setSubjects([]);
      setLoadingSubjects(false);
      setErrorSubjects(null);
      return;
    }

    setLoadingSubjects(true);
    setErrorSubjects(null);

    // Set up real-time listener for subjects
    const q = query(collection(db, "subjects"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subjectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Subject;
      });

      setSubjects(subjectsData);
      setLoadingSubjects(false);
    }, (error) => {
      console.error("Error listening to subjects:", error);
      setErrorSubjects("Failed to load subjects. Please try again later.");
      setLoadingSubjects(false);
    });

    return () => unsubscribe();
  }, [currentUser]);
  
  // Load user quiz attempts
  useEffect(() => {
    if (!currentUser) {
      setUserQuizAttempts([]);
      setLoadingUserQuizAttempts(false);
      return;
    }
    
    const loadUserQuizAttempts = async () => {
      try {
        setLoadingUserQuizAttempts(true);
        setErrorUserQuizAttempts(null);
        const attempts = await userQuizAttemptService.getUserQuizAttempts(currentUser.uid);
        setUserQuizAttempts(attempts);
      } catch (error) {
        console.error("Error loading user quiz attempts:", error);
        setErrorUserQuizAttempts("Failed to load quiz attempts. Please try again later.");
      } finally {
        setLoadingUserQuizAttempts(false);
      }
    };
    
    loadUserQuizAttempts();
  }, [currentUser]);
  
  // Load achievements
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoadingAchievements(true);
        const achievementsData = await achievementService.getAllAchievements();
        setAchievements(achievementsData);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoadingAchievements(false);
      }
    };
    
    loadAchievements();
  }, []);
  
  // Load user achievements
  useEffect(() => {
    if (!currentUser) {
      setUserAchievements([]);
      setLoadingUserAchievements(false);
      return;
    }
    
    const loadUserAchievements = async () => {
      try {
        setLoadingUserAchievements(true);
        const achievements = await userAchievementService.getUserAchievements(currentUser.uid);
        setUserAchievements(achievements);
      } catch (error) {
        console.error("Error loading user achievements:", error);
      } finally {
        setLoadingUserAchievements(false);
      }
    };
    
    loadUserAchievements();
  }, [currentUser]);
  
  // Load contests
  useEffect(() => {
    const loadContests = async () => {
      try {
        setLoadingContests(true);
        const contestsData = await contestService.getActiveContests();
        setContests(contestsData);
      } catch (error) {
        console.error("Error loading contests:", error);
      } finally {
        setLoadingContests(false);
      }
    };
    
    loadContests();
  }, []);
  
  // Load user contest participations
  useEffect(() => {
    if (!currentUser) {
      setUserContestParticipations([]);
      setLoadingUserContestParticipations(false);
      return;
    }
    
    const loadUserContestParticipations = async () => {
      try {
        setLoadingUserContestParticipations(true);
        const participations = await userContestParticipationService.getUserContestParticipations(currentUser.uid);
        setUserContestParticipations(participations);
      } catch (error) {
        console.error("Error loading user contest participations:", error);
      } finally {
        setLoadingUserContestParticipations(false);
      }
    };
    
    loadUserContestParticipations();
  }, [currentUser]);
  
  // User operations
  const updateUser = async (userData: Partial<User>) => {
    if (!currentUser) throw new Error("No user logged in");
    await userService.updateUser(currentUser.uid, userData);
  };
  
  // Subject operations
  const getSubject = async (id: string) => {
    return await subjectService.getSubject(id);
  };
  
  const createSubject = async (subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    const id = await subjectService.createSubject(subjectData);
    
    // Refresh subjects list
    try {
      const subjectsData = await subjectService.getAllSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error refreshing subjects:", error);
    }
    
    return id;
  };
  
  const updateSubject = async (id: string, subjectData: Partial<Subject>) => {
    await subjectService.updateSubject(id, subjectData);
    
    // Refresh subjects list
    try {
      const subjectsData = await subjectService.getAllSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error refreshing subjects:", error);
    }
  };
  
  const deleteSubject = async (id: string) => {
    await subjectService.deleteSubject(id);
    
    // Refresh subjects list
    try {
      const subjectsData = await subjectService.getAllSubjects();
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error refreshing subjects:", error);
    }
  };
  
  // Quiz operations
  const getQuizzesBySubject = async (subjectId: string) => {
    return await quizService.getQuizzesBySubject(subjectId);
  };
  
  const getQuiz = async (id: string) => {
    return await quizService.getQuiz(id);
  };
  
  const createQuiz = async (quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => {
    return await quizService.createQuiz(quizData);
  };
  
  const updateQuiz = async (id: string, quizData: Partial<Quiz>) => {
    return await quizService.updateQuiz(id, quizData);
  };
  
  const deleteQuiz = async (id: string) => {
    return await quizService.deleteQuiz(id);
  };
  
  // User quiz attempt operations
  const createUserQuizAttempt = async (attemptData: Omit<UserQuizAttempt, "id" | "startedAt" | "completedAt">) => {
    if (!currentUser) throw new Error("No user logged in");
    const id = await userQuizAttemptService.createUserQuizAttempt(attemptData);
    
    // Refresh user quiz attempts
    try {
      const attempts = await userQuizAttemptService.getUserQuizAttempts(currentUser.uid);
      setUserQuizAttempts(attempts);
    } catch (error) {
      console.error("Error refreshing user quiz attempts:", error);
    }
    
    return id;
  };
  
  const updateUserQuizAttempt = async (id: string, attemptData: Partial<UserQuizAttempt>) => {
    await userQuizAttemptService.updateUserQuizAttempt(id, attemptData);
    
    // Refresh user quiz attempts
    if (currentUser) {
      try {
        const attempts = await userQuizAttemptService.getUserQuizAttempts(currentUser.uid);
        setUserQuizAttempts(attempts);
      } catch (error) {
        console.error("Error refreshing user quiz attempts:", error);
      }
    }
  };
  
  // Achievement operations
  const getAchievement = async (id: string) => {
    return await achievementService.getAchievement(id);
  };
  
  const createAchievement = async (achievementData: Omit<Achievement, "id" | "createdAt">) => {
    const id = await achievementService.createAchievement(achievementData);
    
    // Refresh achievements list
    try {
      const achievementsData = await achievementService.getAllAchievements();
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error refreshing achievements:", error);
    }
    
    return id;
  };
  
  const updateAchievement = async (id: string, achievementData: Partial<Achievement>) => {
    await achievementService.updateAchievement(id, achievementData);
    
    // Refresh achievements list
    try {
      const achievementsData = await achievementService.getAllAchievements();
      setAchievements(achievementsData);
    } catch (error) {
      console.error("Error refreshing achievements:", error);
    }
  };
  
  // User achievement operations
  const createUserAchievement = async (achievementData: Omit<UserAchievement, "id" | "unlockedAt">) => {
    if (!currentUser) throw new Error("No user logged in");
    const id = await userAchievementService.createUserAchievement(achievementData);
    
    // Refresh user achievements
    try {
      const achievements = await userAchievementService.getUserAchievements(currentUser.uid);
      setUserAchievements(achievements);
    } catch (error) {
      console.error("Error refreshing user achievements:", error);
    }
    
    return id;
  };
  
  // Contest operations
  const getContest = async (id: string) => {
    return await contestService.getContest(id);
  };
  
  const createContest = async (contestData: Omit<Contest, "id" | "createdAt" | "updatedAt">) => {
    const id = await contestService.createContest(contestData);
    
    // Refresh contests list
    try {
      const contestsData = await contestService.getActiveContests();
      setContests(contestsData);
    } catch (error) {
      console.error("Error refreshing contests:", error);
    }
    
    return id;
  };
  
  const updateContest = async (id: string, contestData: Partial<Contest>) => {
    await contestService.updateContest(id, contestData);
    
    // Refresh contests list
    try {
      const contestsData = await contestService.getActiveContests();
      setContests(contestsData);
    } catch (error) {
      console.error("Error refreshing contests:", error);
    }
  };
  
  const deleteContest = async (id: string) => {
    await contestService.deleteContest(id);
    
    // Refresh contests list
    try {
      const contestsData = await contestService.getActiveContests();
      setContests(contestsData);
    } catch (error) {
      console.error("Error refreshing contests:", error);
    }
  };
  
  // User contest participation operations
  const createUserContestParticipation = async (participationData: Omit<UserContestParticipation, "id" | "joinedAt">) => {
    if (!currentUser) throw new Error("No user logged in");
    const id = await userContestParticipationService.createUserContestParticipation(participationData);
    
    // Refresh user contest participations
    try {
      const participations = await userContestParticipationService.getUserContestParticipations(currentUser.uid);
      setUserContestParticipations(participations);
    } catch (error) {
      console.error("Error refreshing user contest participations:", error);
    }
    
    return id;
  };
  
  const updateUserContestParticipation = async (id: string, participationData: Partial<UserContestParticipation>) => {
    await userContestParticipationService.updateUserContestParticipation(id, participationData);
    
    // Refresh user contest participations
    if (currentUser) {
      try {
        const participations = await userContestParticipationService.getUserContestParticipations(currentUser.uid);
        setUserContestParticipations(participations);
      } catch (error) {
        console.error("Error refreshing user contest participations:", error);
      }
    }
  };
  
  // Check achievements function
  const checkAchievements = async () => {
    if (achievementTracker) {
      await achievementTracker.checkAllAchievements();
    }
  };
  
  // Clear newly unlocked achievement
  const clearNewlyUnlockedAchievement = () => {
    setNewlyUnlockedAchievement(null);
  };
  
  const value = {
    // User data
    user,
    loadingUser,
    updateUser,
    
    // Subjects
    subjects,
    loadingSubjects,
    errorSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    
    // Quizzes
    getQuizzesBySubject,
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    
    // User quiz attempts
    userQuizAttempts,
    loadingUserQuizAttempts,
    errorUserQuizAttempts,
    createUserQuizAttempt,
    updateUserQuizAttempt,
    
    // Achievements
    achievements,
    loadingAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    
    // User achievements
    userAchievements,
    loadingUserAchievements,
    createUserAchievement,
    checkAchievements,
    newlyUnlockedAchievement,
    clearNewlyUnlockedAchievement,
    
    // Contests
    contests,
    loadingContests,
    getContest,
    createContest,
    updateContest,
    deleteContest,
    
    // User contest participations
    userContestParticipations,
    loadingUserContestParticipations,
    createUserContestParticipation,
    updateUserContestParticipation,
    
    // Leaderboard
    getGlobalLeaderboard: leaderboardService.getGlobalLeaderboard,
    getWeeklyLeaderboard: leaderboardService.getWeeklyLeaderboard,
    getMonthlyLeaderboard: leaderboardService.getMonthlyLeaderboard,
    
    // Lessons
    getLessonsBySubject: lessonService.getLessonsBySubject,
    getLesson: lessonService.getLesson,
    createLesson: lessonService.createLesson,
    updateLesson: lessonService.updateLesson,
    deleteLesson: lessonService.deleteLesson,
    
   // User lesson progress
    getUserLessonProgress: userLessonProgressService.getUserLessonProgress,
    updateUserLessonProgress: userLessonProgressService.updateUserLessonProgress,
    
    // Teacher-student relationships
   getStudentsByTeacher: teacherStudentService.getStudentsByTeacher,
   getStudentsByTeacherWithUserData: teacherStudentService.getStudentsByTeacherWithUserData,
   getStudentPerformance: teacherStudentService.getStudentPerformance
 };
  
 return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
};
