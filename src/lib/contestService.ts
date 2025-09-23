import {
  Contest,
  UserContestParticipation,
  Quiz,
  Question
} from "./types.ts";
import {
  contestService,
  userContestParticipationService,
  quizService
} from "./firestoreService.ts";
import { db } from "./firebase.ts";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  onSnapshot
} from "firebase/firestore";

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

// Contest service functions
export const contestServiceFunctions = {
  // Get all active contests
  async getActiveContests(limitCount?: number): Promise<Contest[]> {
    try {
      const now = new Date();
      let q = query(
        collection(db, "contests"),
        where("startDate", "<=", toTimestamp(now)),
        where("endDate", ">=", toTimestamp(now)),
        orderBy("startDate")
      );
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: toDate(data.startDate)!,
          endDate: toDate(data.endDate)!,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Contest;
      });
    } catch (error) {
      console.error("Error getting active contests:", error);
      throw error;
    }
  },

  // Get upcoming contests
  async getUpcomingContests(limitCount?: number): Promise<Contest[]> {
    try {
      const now = new Date();
      let q = query(
        collection(db, "contests"),
        where("startDate", ">", toTimestamp(now)),
        orderBy("startDate")
      );
      
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: toDate(data.startDate)!,
          endDate: toDate(data.endDate)!,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Contest;
      });
    } catch (error) {
      console.error("Error getting upcoming contests:", error);
      throw error;
    }
  },

  // Get contest by ID
 async getContest(id: string): Promise<Contest | null> {
    return await contestService.getContest(id);
  },

  // Create contest
  async createContest(contestData: Omit<Contest, "id" | "createdAt" | "updatedAt">): Promise<string> {
    return await contestService.createContest(contestData);
  },

  // Update contest
  async updateContest(id: string, contestData: Partial<Contest>): Promise<void> {
    return await contestService.updateContest(id, contestData);
  },

  // Delete contest
  async deleteContest(id: string): Promise<void> {
    return await contestService.deleteContest(id);
  },

  // Get user's contest participations
  async getUserContestParticipations(userId: string): Promise<UserContestParticipation[]> {
    return await userContestParticipationService.getUserContestParticipations(userId);
  },

  // Get contest participants
  async getContestParticipants(contestId: string): Promise<UserContestParticipation[]> {
    return await userContestParticipationService.getContestParticipants(contestId);
  },

  // Join contest
  async joinContest(contestId: string, userId: string): Promise<string> {
    try {
      // Check if user already joined
      const existingParticipation = await this.getUserContestParticipation(contestId, userId);
      if (existingParticipation) {
        throw new Error("User already joined this contest");
      }

      // Create participation
      const participationId = await userContestParticipationService.createUserContestParticipation({
        userId,
        contestId,
        score: 0
      });

      // Update contest participants count
      const contest = await this.getContest(contestId);
      if (contest) {
        await this.updateContest(contestId, {
          participants: [...(contest.participants || []), userId],
          updatedAt: new Date()
        });
      }

      return participationId;
    } catch (error) {
      console.error("Error joining contest:", error);
      throw error;
    }
  },

  // Get user's participation in a specific contest
  async getUserContestParticipation(contestId: string, userId: string): Promise<UserContestParticipation | null> {
    try {
      const q = query(
        collection(db, "userContestParticipations"),
        where("contestId", "==", contestId),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          joinedAt: toDate(data.joinedAt)!
        } as UserContestParticipation;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user contest participation:", error);
      throw error;
    }
  },

  // Update user's contest score
  async updateUserContestScore(participationId: string, score: number): Promise<void> {
    try {
      await userContestParticipationService.updateUserContestParticipation(participationId, {
        score
      });
    } catch (error) {
      console.error("Error updating user contest score:", error);
      throw error;
    }
  },

  // Get user's contest history
  async getUserContestHistory(userId: string): Promise<UserContestParticipation[]> {
    try {
      const participations = await this.getUserContestParticipations(userId);
      
      // Sort by joined date (newest first)
      return participations.sort((a, b) =>
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      );
    } catch (error) {
      console.error("Error getting user contest history:", error);
      throw error;
    }
  },

  // Get user's best contest performances
  async getUserBestContestPerformances(userId: string, limitCount: number = 5): Promise<UserContestParticipation[]> {
    try {
      const participations = await this.getUserContestHistory(userId);
      
      // Sort by score (highest first) and limit
      return participations
        .sort((a, b) => b.score - a.score)
        .slice(0, limitCount);
    } catch (error) {
      console.error("Error getting user best contest performances:", error);
      throw error;
    }
  },

  // Get contest leaderboard
  async getContestLeaderboard(contestId: string, limitCount: number = 10): Promise<UserContestParticipation[]> {
    try {
      const q = query(
        collection(db, "userContestParticipations"),
        where("contestId", "==", contestId),
        orderBy("score", "desc"),
        limit(limitCount)
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
      console.error("Error getting contest leaderboard:", error);
      throw error;
    }
  },

  // Get quizzes for a contest
  async getContestQuizzes(subjectId?: string): Promise<Quiz[]> {
    try {
      if (subjectId) {
        return await quizService.getQuizzesBySubject(subjectId);
      }
      
      // If no subject specified, get all quizzes (this is just a placeholder)
      // In a real implementation, you might want to filter by contest-specific criteria
      const q = query(collection(db, "quizzes"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!,
          questions: data.questions?.map((q: any) => ({ ...q })) || []
        } as Quiz;
      });
    } catch (error) {
      console.error("Error getting contest quizzes:", error);
      throw error;
    }
  },

  // Check if contest is active (between start and end dates)
  isContestActive(contest: Contest): boolean {
    const now = new Date();
    return now >= contest.startDate && now <= contest.endDate;
  },

  // Check if contest has ended
  isContestEnded(contest: Contest): boolean {
    const now = new Date();
    return now > contest.endDate;
  },

  // Check if contest is upcoming
  isContestUpcoming(contest: Contest): boolean {
    const now = new Date();
    return now < contest.startDate;
  },

  // Real-time listeners
  // Listen to active contests changes
  onActiveContestsChange(callback: (contests: Contest[]) => void) {
    const now = new Date();
    const q = query(
      collection(db, "contests"),
      where("startDate", "<=", toTimestamp(now)),
      where("endDate", ">=", toTimestamp(now)),
      orderBy("startDate")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const contests = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: toDate(data.startDate)!,
          endDate: toDate(data.endDate)!,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Contest;
      });
      callback(contests);
    });
  },

  // Listen to upcoming contests changes
  onUpcomingContestsChange(callback: (contests: Contest[]) => void) {
    const now = new Date();
    const q = query(
      collection(db, "contests"),
      where("startDate", ">", toTimestamp(now)),
      orderBy("startDate")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const contests = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: toDate(data.startDate)!,
          endDate: toDate(data.endDate)!,
          createdAt: toDate(data.createdAt)!,
          updatedAt: toDate(data.updatedAt)!
        } as Contest;
      });
      callback(contests);
    });
  },

  // Listen to contest participants changes
  onContestParticipantsChange(contestId: string, callback: (participants: UserContestParticipation[]) => void) {
    const q = query(
      collection(db, "userContestParticipations"),
      where("contestId", "==", contestId),
      orderBy("score", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const participants = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          joinedAt: toDate(data.joinedAt)!
        } as UserContestParticipation;
      });
      callback(participants);
    });
  },

  // Listen to user's contest participations changes
  onUserContestParticipationsChange(userId: string, callback: (participations: UserContestParticipation[]) => void) {
    const q = query(
      collection(db, "userContestParticipations"),
      where("userId", "==", userId),
      orderBy("joinedAt", "desc")
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const participations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          joinedAt: toDate(data.joinedAt)!
        } as UserContestParticipation;
      });
      callback(participations);
    });
  }
};