import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase.ts";
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
  TeacherStudent,
  StudentPerformance,
  LessonAssignment,
  TeacherClass,
  LessonResource,
  XPGain
} from "./types.ts";

// Utility function to convert Firestore Timestamp to Date
export const toDate = (timestamp: Timestamp | null | undefined): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

// Utility function to convert Date to Firestore Timestamp
export const toTimestamp = (date: Date | null | undefined): Timestamp | null => {
  if (!date) return null;
  return Timestamp.fromDate(date);
};

// Utility function to add server timestamp
export const withServerTimestamp = () => {
  return serverTimestamp();
};

// Generic error handler
export const handleFirestoreError = (error: any) => {
  console.error("Firestore error:", error);
  throw new Error(`Firestore operation failed: ${error.message}`);
};

// User operations
export const userService = {
  // Get user by ID
  async getUser(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          ...data,
          uid: userDoc.id,
          createdAt: toDate(data.createdAt)!,
          lastLoginAt: toDate(data.lastLoginAt)!,
          lastStreakDate: toDate(data.lastStreakDate)
        } as User;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create or update user
  async setUser(uid: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        ...userData,
        updatedAt: withServerTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update user
  async updateUser(uid: string, userData: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Subject operations
export const subjectService = {
  // Get all subjects
  async getAllSubjects(): Promise<Subject[]> {
    try {
      const q = query(collection(db, "subjects"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Subject;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get subject by ID
  async getSubject(id: string): Promise<Subject | null> {
    try {
      const subjectDoc = await getDoc(doc(db, "subjects", id));
      if (subjectDoc.exists()) {
        const data = subjectDoc.data();
        return {
          ...data,
          id: subjectDoc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Subject;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create subject
  async createSubject(subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const subjectRef = doc(collection(db, "subjects"));
      await setDoc(subjectRef, {
        ...subjectData,
        createdAt: withServerTimestamp(),
        updatedAt: withServerTimestamp()
      });
      return subjectRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update subject
  async updateSubject(id: string, subjectData: Partial<Subject>): Promise<void> {
    try {
      const subjectRef = doc(db, "subjects", id);
      await updateDoc(subjectRef, {
        ...subjectData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Delete subject
  async deleteSubject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "subjects", id));
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// XP Gain operations
export const xpGainService = {
  // Create XP gain record
  async createXPGain(xpGainData: Omit<XPGain, "id" | "timestamp">): Promise<string> {
    try {
      const xpGainRef = doc(collection(db, "xpGains"));
      await setDoc(xpGainRef, {
        ...xpGainData,
        timestamp: withServerTimestamp()
      });
      return xpGainRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get user's XP gains within a date range
  async getUserXPGains(userId: string, startDate: Date, endDate: Date): Promise<XPGain[]> {
    try {
      const q = query(
        collection(db, "xpGains"),
        where("userId", "==", userId),
        where("timestamp", ">=", toTimestamp(startDate)),
        where("timestamp", "<=", toTimestamp(endDate)),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp: toDate(data.timestamp)!
        } as XPGain;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get total XP gained by user within a date range
  async getTotalXPGained(userId: string, startDate: Date, endDate: Date): Promise<number> {
    try {
      const xpGains = await this.getUserXPGains(userId, startDate, endDate);
      return xpGains.reduce((total, xpGain) => total + xpGain.amount, 0);
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Quiz operations
export const quizService = {
  // Get quizzes by subject ID
  async getQuizzesBySubject(subjectId: string): Promise<Quiz[]> {
    try {
      const q = query(
        collection(db, "quizzes"), 
        where("subjectId", "==", subjectId),
        orderBy("createdAt")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!,
          questions: data.questions.map((q: any) => ({
            ...q
          }))
        } as Quiz;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get quiz by ID
  async getQuiz(id: string): Promise<Quiz | null> {
    try {
      const quizDoc = await getDoc(doc(db, "quizzes", id));
      if (quizDoc.exists()) {
        const data = quizDoc.data();
        return {
          ...data,
          id: quizDoc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!,
          questions: data.questions.map((q: any) => ({
            ...q
          }))
        } as Quiz;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create quiz
  async createQuiz(quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const quizRef = doc(collection(db, "quizzes"));
      await setDoc(quizRef, {
        ...quizData,
        createdAt: withServerTimestamp(),
        updatedAt: withServerTimestamp()
      });
      return quizRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update quiz
  async updateQuiz(id: string, quizData: Partial<Quiz>): Promise<void> {
    try {
      const quizRef = doc(db, "quizzes", id);
      await updateDoc(quizRef, {
        ...quizData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Delete quiz
  async deleteQuiz(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "quizzes", id));
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// User quiz attempt operations
export const userQuizAttemptService = {
  // Get user's quiz attempts
  async getUserQuizAttempts(userId: string): Promise<UserQuizAttempt[]> {
    try {
      const q = query(
        collection(db, "userQuizAttempts"), 
        where("userId", "==", userId),
        orderBy("completedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startedAt: toDate(data.startedAt)!,
          completedAt: toDate(data.completedAt)!,
          answers: data.answers || []
        } as UserQuizAttempt;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get quiz attempts by quiz ID
  async getQuizAttempts(quizId: string): Promise<UserQuizAttempt[]> {
    try {
      const q = query(
        collection(db, "userQuizAttempts"), 
        where("quizId", "==", quizId),
        orderBy("completedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startedAt: toDate(data.startedAt)!,
          completedAt: toDate(data.completedAt)!,
          answers: data.answers || []
        } as UserQuizAttempt;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create user quiz attempt
  async createUserQuizAttempt(attemptData: Omit<UserQuizAttempt, "id" | "startedAt" | "completedAt">): Promise<string> {
    try {
      const attemptRef = doc(collection(db, "userQuizAttempts"));
      await setDoc(attemptRef, {
        ...attemptData,
        startedAt: withServerTimestamp(),
        completedAt: withServerTimestamp()
      });
      return attemptRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update user quiz attempt
  async updateUserQuizAttempt(id: string, attemptData: Partial<UserQuizAttempt>): Promise<void> {
    try {
      const attemptRef = doc(db, "userQuizAttempts", id);
      await updateDoc(attemptRef, {
        ...attemptData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Leaderboard operations
export const leaderboardService = {
// Get global leaderboard (top users by XP)
async getGlobalLeaderboard(limitCount: number = 100): Promise<any[]> {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("xp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        ...data,
        uid: doc.id,
        rank: index + 1,
        createdAt: toDate(data.createdAt)!,
        lastLoginAt: toDate(data.lastLoginAt)!,
        lastStreakDate: toDate(data.lastStreakDate),
        badges: 0 // Will be updated when we fetch user achievements
      };
    });
    
    // Update badges count for each user
    const usersWithBadges = await Promise.all(
      users.map(async (user) => {
        try {
          const userAchievements = await userAchievementService.getUserAchievements(user.uid);
          return {
            ...user,
            badges: userAchievements.length
          };
        } catch (error) {
          console.error(`Error fetching achievements for user ${user.uid}:`, error);
          return {
            ...user,
            badges: 0
          };
        }
      })
    );
    
    return usersWithBadges;
  } catch (error) {
    handleFirestoreError(error);
  }
},

// Get weekly leaderboard (users with most XP gained in the last 7 days)
async getWeeklyLeaderboard(limitCount: number = 100): Promise<any[]> {
  try {
    // Get all users
    const usersQuery = query(
      collection(db, "users"),
      orderBy("xp", "desc"),
      limit(limitCount)
    );
    const usersSnapshot = await getDocs(usersQuery);
    
    // Calculate date range for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    // Get XP gains for each user in the last 7 days
    const usersWithWeeklyXP = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        // Get total XP gained in the last 7 days
        const weeklyXP = await xpGainService.getTotalXPGained(userId, startDate, endDate);
        
        return {
          ...userData,
          uid: userId,
          weeklyXP: weeklyXP
        };
      })
    );
    
    // Sort by weekly XP gained (descending)
    usersWithWeeklyXP.sort((a, b) => b.weeklyXP - a.weeklyXP);
    
    // Add ranks
    const usersWithRanks = usersWithWeeklyXP.map((user, index) => ({
      ...user,
      rank: index + 1,
      createdAt: toDate((user as any).createdAt)!,
      lastLoginAt: toDate((user as any).lastLoginAt)!,
      lastStreakDate: toDate((user as any).lastStreakDate),
      badges: 0 // Will be updated when we fetch user achievements
    }));
    
    // Update badges count for each user
    const usersWithBadges = await Promise.all(
      usersWithRanks.map(async (user) => {
        try {
          const userAchievements = await userAchievementService.getUserAchievements(user.uid);
          return {
            ...user,
            badges: userAchievements.length
          };
        } catch (error) {
          console.error(`Error fetching achievements for user ${user.uid}:`, error);
          return {
            ...user,
            badges: 0
          };
        }
      })
    );
    
    return usersWithBadges;
  } catch (error) {
    handleFirestoreError(error);
  }
},

// Get monthly leaderboard (users with most XP gained in the last 30 days)
async getMonthlyLeaderboard(limitCount: number = 100): Promise<any[]> {
  try {
    // Get all users
    const usersQuery = query(
      collection(db, "users"),
      orderBy("xp", "desc"),
      limit(limitCount)
    );
    const usersSnapshot = await getDocs(usersQuery);
    
    // Calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    // Get XP gains for each user in the last 30 days
    const usersWithMonthlyXP = await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        // Get total XP gained in the last 30 days
        const monthlyXP = await xpGainService.getTotalXPGained(userId, startDate, endDate);
        
        return {
          ...userData,
          uid: userId,
          monthlyXP: monthlyXP
        };
      })
    );
    
    // Sort by monthly XP gained (descending)
    usersWithMonthlyXP.sort((a, b) => b.monthlyXP - a.monthlyXP);
    
    // Add ranks
    const usersWithRanks = usersWithMonthlyXP.map((user, index) => ({
      ...user,
      rank: index + 1,
      createdAt: toDate((user as any).createdAt)!,
      lastLoginAt: toDate((user as any).lastLoginAt)!,
      lastStreakDate: toDate((user as any).lastStreakDate),
      badges: 0 // Will be updated when we fetch user achievements
    }));
    
    // Update badges count for each user
    const usersWithBadges = await Promise.all(
      usersWithRanks.map(async (user) => {
        try {
          const userAchievements = await userAchievementService.getUserAchievements(user.uid);
          return {
            ...user,
            badges: userAchievements.length
          };
        } catch (error) {
          console.error(`Error fetching achievements for user ${user.uid}:`, error);
          return {
            ...user,
            badges: 0
          };
        }
      })
    );
    
    return usersWithBadges;
  } catch (error) {
    handleFirestoreError(error);
  }
},

// Listen to global leaderboard changes
onGlobalLeaderboardChange(limitCount: number = 100, callback: (users: any[]) => void) {
  const q = query(
    collection(db, "users"),
    orderBy("xp", "desc"),
    limit(limitCount)
  );
  
  return onSnapshot(q, async (querySnapshot) => {
    const users = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        ...data,
        uid: doc.id,
        rank: index + 1,
        createdAt: toDate(data.createdAt)!,
        lastLoginAt: toDate(data.lastLoginAt)!,
        lastStreakDate: toDate(data.lastStreakDate),
        badges: 0 // Will be updated when we fetch user achievements
      };
    });
    
    // Update badges count for each user
    const usersWithBadges = await Promise.all(
      users.map(async (user) => {
        try {
          const userAchievements = await userAchievementService.getUserAchievements(user.uid);
          return {
            ...user,
            badges: userAchievements.length
          };
        } catch (error) {
          console.error(`Error fetching achievements for user ${user.uid}:`, error);
          return {
            ...user,
            badges: 0
          };
        }
      })
    );
    
    callback(usersWithBadges);
  });
},

// Listen to weekly leaderboard changes
onWeeklyLeaderboardChange(limitCount: number = 100, callback: (users: any[]) => void) {
  // For now, we'll use a simple approach that fetches data periodically
  // In a production app, you might want to use a more sophisticated approach
  const interval = setInterval(async () => {
    try {
      const users = await this.getWeeklyLeaderboard(limitCount);
      callback(users);
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error);
    }
  }, 30000); // Update every 30 seconds
  
  // Return a function to clear the interval
  return () => clearInterval(interval);
},

// Listen to monthly leaderboard changes
onMonthlyLeaderboardChange(limitCount: number = 100, callback: (users: any[]) => void) {
  // For now, we'll use a simple approach that fetches data periodically
  // In a production app, you might want to use a more sophisticated approach
  const interval = setInterval(async () => {
    try {
      const users = await this.getMonthlyLeaderboard(limitCount);
      callback(users);
    } catch (error) {
      console.error("Error fetching monthly leaderboard:", error);
    }
  }, 30000); // Update every 30 seconds
  
  // Return a function to clear the interval
  return () => clearInterval(interval);
}
};

// Achievement operations
export const achievementService = {
  // Get all achievements
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const q = query(collection(db, "achievements"), orderBy("title"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!
        } as Achievement;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get achievement by ID
 async getAchievement(id: string): Promise<Achievement | null> {
    try {
      const achievementDoc = await getDoc(doc(db, "achievements", id));
      if (achievementDoc.exists()) {
        const data = achievementDoc.data();
        return {
          ...data,
          id: achievementDoc.id,
          createdAt: toDate(data.createdAt)!
        } as Achievement;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create achievement
  async createAchievement(achievementData: Omit<Achievement, "id" | "createdAt">): Promise<string> {
    try {
      const achievementRef = doc(collection(db, "achievements"));
      await setDoc(achievementRef, {
        ...achievementData,
        createdAt: withServerTimestamp()
      });
      return achievementRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update achievement
  async updateAchievement(id: string, achievementData: Partial<Achievement>): Promise<void> {
    try {
      const achievementRef = doc(db, "achievements", id);
      await updateDoc(achievementRef, {
        ...achievementData
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// User achievement operations
export const userAchievementService = {
  // Get user's achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const q = query(
        collection(db, "userAchievements"), 
        where("userId", "==", userId),
        orderBy("unlockedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          unlockedAt: toDate(data.unlockedAt)!
        } as UserAchievement;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Check if user has achievement
  async hasUserAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, "userAchievements"),
        where("userId", "==", userId),
        where("achievementId", "==", achievementId)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create user achievement
  async createUserAchievement(achievementData: Omit<UserAchievement, "id" | "unlockedAt">): Promise<string> {
    try {
      // Check if user already has this achievement
      const hasAchievement = await this.hasUserAchievement(achievementData.userId, achievementData.achievementId);
      if (hasAchievement) {
        throw new Error("User already has this achievement");
      }

      const achievementRef = doc(collection(db, "userAchievements"));
      await setDoc(achievementRef, {
        ...achievementData,
        unlockedAt: withServerTimestamp()
      });
      return achievementRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Contest operations
export const contestService = {
  // Get all active contests
  async getActiveContests(): Promise<Contest[]> {
    try {
      const now = new Date();
      // First get contests that have started (startDate <= now)
      const startedContestsQuery = query(
        collection(db, "contests"),
        where("startDate", "<=", toTimestamp(now)),
        orderBy("startDate")
      );
      const startedContestsSnapshot = await getDocs(startedContestsQuery);

      // Filter contests that are still active (endDate >= now) in the application
      const activeContests = startedContestsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: toDate(data.startDate)!,
            endDate: toDate(data.endDate)!,
            createdAt: toDate(data.createdAt)!,
            updatedAt: toDate(data.updatedAt)!
          } as Contest;
        })
        .filter(contest => contest.endDate >= now);

      return activeContests;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get contest by ID
  async getContest(id: string): Promise<Contest | null> {
    try {
      const contestDoc = await getDoc(doc(db, "contests", id));
      if (contestDoc.exists()) {
        const data = contestDoc.data();
        return {
          ...data,
          id: contestDoc.id,
          startDate: toDate(data.startDate)!,
          endDate: toDate(data.endDate)!,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Contest;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create contest
  async createContest(contestData: Omit<Contest, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const contestRef = doc(collection(db, "contests"));
      await setDoc(contestRef, {
        ...contestData,
        createdAt: withServerTimestamp(),
        updatedAt: withServerTimestamp()
      });
      return contestRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update contest
  async updateContest(id: string, contestData: Partial<Contest>): Promise<void> {
    try {
      const contestRef = doc(db, "contests", id);
      await updateDoc(contestRef, {
        ...contestData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Delete contest
  async deleteContest(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "contests", id));
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// User contest participation operations
export const userContestParticipationService = {
  // Get user's contest participations
  async getUserContestParticipations(userId: string): Promise<UserContestParticipation[]> {
    try {
      // First get all participations for the user
      const userParticipationsQuery = query(
        collection(db, "userContestParticipations"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(userParticipationsQuery);

      // Sort by joinedAt in descending order in the application
      const participations = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            joinedAt: toDate(data.joinedAt)!
          } as UserContestParticipation;
        })
        .sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());

      return participations;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get contest participants
  async getContestParticipants(contestId: string): Promise<UserContestParticipation[]> {
    try {
      const q = query(
        collection(db, "userContestParticipations"), 
        where("contestId", "==", contestId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          joinedAt: toDate(data.joinedAt)!
        } as UserContestParticipation;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create user contest participation
  async createUserContestParticipation(participationData: Omit<UserContestParticipation, "id" | "joinedAt">): Promise<string> {
    try {
      const participationRef = doc(collection(db, "userContestParticipations"));
      await setDoc(participationRef, {
        ...participationData,
        joinedAt: withServerTimestamp()
      });
      return participationRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update user contest participation
  async updateUserContestParticipation(id: string, participationData: Partial<UserContestParticipation>): Promise<void> {
    try {
      const participationRef = doc(db, "userContestParticipations", id);
      await updateDoc(participationRef, {
        ...participationData
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Real-time listeners
export const createRealTimeListener = {
  // Listen to user changes
  user(uid: string, callback: (user: User | null) => void) {
    const userRef = doc(db, "users", uid);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          ...data,
          uid: doc.id,
          createdAt: toDate(data.createdAt)!,
          lastLoginAt: toDate(data.lastLoginAt)!,
          lastStreakDate: toDate(data.lastStreakDate)
        } as User);
      } else {
        callback(null);
      }
    });
  },

  // Listen to subject changes
  subject(id: string, callback: (subject: Subject | null) => void) {
    const subjectRef = doc(db, "subjects", id);
    return onSnapshot(subjectRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Subject);
      } else {
        callback(null);
      }
    });
  },

  // Listen to quiz changes
  quiz(id: string, callback: (quiz: Quiz | null) => void) {
    const quizRef = doc(db, "quizzes", id);
    return onSnapshot(quizRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!,
          questions: data.questions.map((q: any) => ({
            ...q
          }))
        } as Quiz);
      } else {
        callback(null);
      }
    });
  }
};

// Lesson operations
export const lessonService = {
  // Get lessons by subject ID
  async getLessonsBySubject(subjectId: string): Promise<Lesson[]> {
    try {
      const q = query(
        collection(db, "lessons"),
        where("subjectId", "==", subjectId),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Lesson;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get lesson by ID
  async getLesson(id: string): Promise<Lesson | null> {
    try {
      const lessonDoc = await getDoc(doc(db, "lessons", id));
      if (lessonDoc.exists()) {
        const data = lessonDoc.data();
        return {
          ...data,
          id: lessonDoc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Lesson;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create lesson
  async createLesson(lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const lessonRef = doc(collection(db, "lessons"));
      await setDoc(lessonRef, {
        ...lessonData,
        createdAt: withServerTimestamp(),
        updatedAt: withServerTimestamp()
      });
      return lessonRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update lesson
  async updateLesson(id: string, lessonData: Partial<Lesson>): Promise<void> {
    try {
      const lessonRef = doc(db, "lessons", id);
      await updateDoc(lessonRef, {
        ...lessonData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Delete lesson
  async deleteLesson(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "lessons", id));
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get lessons by teacher
  async getLessonsByTeacher(teacherId: string): Promise<Lesson[]> {
    try {
      const q = query(
        collection(db, "lessons"),
        where("createdBy", "==", teacherId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Lesson;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// User lesson progress operations
export const userLessonProgressService = {
  // Get user's lesson progress for a subject
  async getUserLessonProgress(userId: string, subjectId?: string): Promise<UserLessonProgress[]> {
    try {
      let q;
      if (subjectId) {
        q = query(
          collection(db, "userLessonProgress"),
          where("userId", "==", userId),
          where("subjectId", "==", subjectId),
          orderBy("lastAccessedAt", "desc")
        );
      } else {
        q = query(
          collection(db, "userLessonProgress"),
          where("userId", "==", userId),
          orderBy("lastAccessedAt", "desc")
        );
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data: any = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          lessonId: data.lessonId,
          subjectId: data.subjectId,
          status: data.status,
          progress: data.progress,
          timeSpent: data.timeSpent,
          startedAt: toDate(data.startedAt),
          completedAt: toDate(data.completedAt),
          lastAccessedAt: toDate(data.lastAccessedAt)!,
          notes: data.notes
        } as UserLessonProgress;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update or create user lesson progress
  async updateUserLessonProgress(progressData: Omit<UserLessonProgress, "id">): Promise<string> {
    try {
      // Check if progress record already exists
      const q = query(
        collection(db, "userLessonProgress"),
        where("userId", "==", progressData.userId),
        where("lessonId", "==", progressData.lessonId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing record
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...progressData,
          lastAccessedAt: withServerTimestamp()
        });
        return querySnapshot.docs[0].id;
      } else {
        // Create new record
        const progressRef = doc(collection(db, "userLessonProgress"));
        await setDoc(progressRef, {
          ...progressData,
          lastAccessedAt: withServerTimestamp()
        });
        return progressRef.id;
      }
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Teacher-Student relationship operations
export const teacherStudentService = {
  // Get students for a teacher
  async getStudentsByTeacher(teacherId: string): Promise<TeacherStudent[]> {
    try {
      const q = query(
        collection(db, "teacherStudents"),
        where("teacherId", "==", teacherId),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!
        } as TeacherStudent;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get teachers for a student
  async getTeachersByStudent(studentId: string): Promise<TeacherStudent[]> {
    try {
      const q = query(
        collection(db, "teacherStudents"),
        where("studentId", "==", studentId),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!
        } as TeacherStudent;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create teacher-student relationship
  async createTeacherStudent(relationshipData: Omit<TeacherStudent, "id" | "createdAt">): Promise<string> {
    try {
      const relationshipRef = doc(collection(db, "teacherStudents"));
      await setDoc(relationshipRef, {
        ...relationshipData,
        createdAt: withServerTimestamp()
      });
      return relationshipRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update teacher-student relationship
  async updateTeacherStudent(id: string, relationshipData: Partial<TeacherStudent>): Promise<void> {
    try {
      const relationshipRef = doc(db, "teacherStudents", id);
      await updateDoc(relationshipRef, relationshipData);
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Get student performance data for teacher
  async getStudentPerformance(teacherId: string, subjectId?: string): Promise<StudentPerformance[]> {
    try {
      // This is a complex query that would need to aggregate data from multiple collections
      // For now, we'll return empty array and implement this as needed
      return [];
    } catch (error) {
      handleFirestoreError(error);
    }
  },
  
  // Get user objects for students of a teacher
  async getStudentsByTeacherWithUserData(teacherId: string): Promise<User[]> {
    try {
      // First get the teacher-student relationships
      const teacherStudents = await this.getStudentsByTeacher(teacherId);
      
      // Then get the user data for each student
      const users: User[] = [];
      for (const teacherStudent of teacherStudents) {
        const user = await userService.getUser(teacherStudent.studentId);
        if (user) {
          users.push(user);
        }
      }
      
      return users;
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};

// Teacher class operations
export const teacherClassService = {
  // Get classes by teacher
  async getClassesByTeacher(teacherId: string): Promise<TeacherClass[]> {
    try {
      const q = query(
        collection(db, "teacherClasses"),
        where("teacherId", "==", teacherId),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as TeacherClass;
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Create teacher class
  async createTeacherClass(classData: Omit<TeacherClass, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const classRef = doc(collection(db, "teacherClasses"));
      await setDoc(classRef, {
        ...classData,
        createdAt: withServerTimestamp(),
        updatedAt: withServerTimestamp()
      });
      return classRef.id;
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Update teacher class
  async updateTeacherClass(id: string, classData: Partial<TeacherClass>): Promise<void> {
    try {
      const classRef = doc(db, "teacherClasses", id);
      await updateDoc(classRef, {
        ...classData,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  },

  // Delete teacher class
  async deleteTeacherClass(id: string): Promise<void> {
    try {
      const classRef = doc(db, "teacherClasses", id);
      await updateDoc(classRef, {
        isActive: false,
        updatedAt: withServerTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error);
    }
  }
};
