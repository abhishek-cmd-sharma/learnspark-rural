import {
  Achievement,
  AchievementCriteria,
  UserAchievement,
  UserQuizAttempt,
  Subject
} from "./types";
import {
  achievementService,
  userAchievementService,
  userQuizAttemptService,
  userService,
  subjectService
} from "./firestoreService";
import { User } from "./types";

// Define the shape of our achievement tracking context
export interface AchievementTrackingContext {
  user: User | null;
  userQuizAttempts: UserQuizAttempt[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  subjects: Subject[];
}

// Achievement tracking service
export class AchievementTracker {
  private context: AchievementTrackingContext;
  private onAchievementUnlocked: (achievement: Achievement) => void;

  constructor(
    context: AchievementTrackingContext,
    onAchievementUnlocked: (achievement: Achievement) => void
  ) {
    this.context = context;
    this.onAchievementUnlocked = onAchievementUnlocked;
  }

  // Update the tracking context
  updateContext(context: AchievementTrackingContext) {
    this.context = context;
  }

  // Check all achievements for unlock conditions
  async checkAllAchievements() {
    if (!this.context.user) return;

    for (const achievement of this.context.achievements) {
      // Skip if user already has this achievement
      const hasAchievement = this.context.userAchievements.some(
        ua => ua.achievementId === achievement.id
      );
      
      if (!hasAchievement) {
        try {
          const unlocked = await this.checkAchievement(achievement);
          if (unlocked) {
            this.onAchievementUnlocked(achievement);
          }
        } catch (error) {
          console.error(`Error checking achievement ${achievement.id}:`, error);
        }
      }
    }
  }

  // Check a specific achievement
  async checkAchievement(achievement: Achievement): Promise<boolean> {
    if (!this.context.user) return false;

    const { criteria } = achievement;
    let progress = 0;
    let maxProgress = criteria.value;

    switch (criteria.type) {
      case "quiz_completion":
        progress = await this.getQuizCompletionCount(criteria.subjectId);
        break;
      
      case "streak":
        progress = this.context.user.streak || 0;
        break;
      
      case "subject_mastery":
        if (criteria.subjectId) {
          progress = await this.getSubjectMastery(criteria.subjectId);
        }
        break;
      
      case "perfect_score":
        progress = await this.getPerfectScoreCount(criteria.subjectId);
        break;
      
      case "speed_demon":
        progress = await this.getSpeedDemonCount(criteria.subjectId);
        break;
      
      default:
        return false;
    }

    // Check if criteria is met
    if (progress >= maxProgress) {
      // Unlock the achievement
      try {
        await userAchievementService.createUserAchievement({
          userId: this.context.user.uid,
          achievementId: achievement.id,
          progress: progress,
          maxProgress: maxProgress
        });
        
        // Award XP for unlocking achievement
        const xpReward = this.calculateXPReward(achievement.rarity);
        if (this.context.user) {
          await userService.updateUser(this.context.user.uid, {
            xp: (this.context.user.xp || 0) + xpReward,
            level: this.calculateLevel((this.context.user.xp || 0) + xpReward)
          });
        }
        
        return true;
      } catch (error) {
        console.error("Error unlocking achievement:", error);
        // Check if the error is because the achievement already exists
        if (error instanceof Error && error.message.includes("already has this achievement")) {
          // Achievement already exists, so we consider it "unlocked" but don't re-award XP
          return true;
        }
        return false;
      }
    }
    
    return false;
  }

  // Get quiz completion count (for a specific subject or all)
  private async getQuizCompletionCount(subjectId?: string): Promise<number> {
    if (!this.context.user) return 0;
    
    // Filter attempts by subject if specified
    if (subjectId) {
      // Filter attempts by subject
      return this.context.userQuizAttempts.filter(attempt => attempt.quizId === subjectId).length;
    }
    
    return this.context.userQuizAttempts.length;
  }

  // Get subject mastery (percentage of completed lessons)
  private async getSubjectMastery(subjectId: string): Promise<number> {
    // Find the subject in our context
    const subject = this.context.subjects.find(s => s.id === subjectId);
    
    if (!subject) return 0;
    
    // Calculate mastery as percentage of completed lessons
    if (subject.totalLessons > 0) {
      return Math.round((subject.completedLessons / subject.totalLessons) * 100);
    }
    
    return 0;
  }

  // Get perfect score count (for a specific subject or all)
  private async getPerfectScoreCount(subjectId?: string): Promise<number> {
    if (!this.context.user) return 0;
    
    // Filter attempts with perfect scores
    const perfectScores = this.context.userQuizAttempts.filter(attempt => {
      return attempt.score === attempt.totalPoints;
    });
    
    // Filter by subject if specified
    if (subjectId) {
      // Filter perfect scores by subject
      return perfectScores.filter(attempt => attempt.quizId === subjectId).length;
    }
    
    return perfectScores.length;
  }

  // Calculate XP reward based on achievement rarity
  private calculateXPReward(rarity: Achievement["rarity"]): number {
    switch (rarity) {
      case "bronze": return 50;
      case "silver": return 100;
      case "gold": return 200;
      case "platinum": return 500;
      default: return 50;
    }
  }

  // Calculate level based on XP (simplified formula)
  private calculateLevel(xp: number): number {
    // Simple formula: level = sqrt(xp / 100) + 1
    return Math.max(1, Math.floor(Math.sqrt(xp / 100) + 1));
  }

  // Get speed demon count (quizzes completed in under 30 seconds with 90%+ accuracy)
  private async getSpeedDemonCount(subjectId?: string): Promise<number> {
    if (!this.context.user) return 0;
    
    // Filter attempts that are completed in under 30 seconds with 90%+ accuracy
    const speedDemonAttempts = this.context.userQuizAttempts.filter(attempt => {
      // Check if time taken is under 30 seconds
      if (attempt.timeTaken >= 30) return false;
      
      // Check if accuracy is 90% or higher
      if (attempt.totalPoints === 0) return false;
      const accuracy = (attempt.score / attempt.totalPoints) * 100;
      return accuracy >= 90;
    });
    
    // Filter by subject if specified
    if (subjectId) {
      return speedDemonAttempts.filter(attempt => attempt.quizId === subjectId).length;
    }
    
    return speedDemonAttempts.length;
  }
}

// Helper function to initialize achievements in Firestore
export const initializeAchievements = async () => {
  try {
    // Check if achievements already exist
    const existingAchievements = await achievementService.getAllAchievements();
    
    if (existingAchievements.length === 0) {
      // Create default achievements
      const defaultAchievements: Omit<Achievement, "id" | "createdAt">[] = [
        {
          title: "First Quiz",
          description: "Complete your first quiz",
          icon: "🎯",
          rarity: "bronze",
          criteria: {
            type: "quiz_completion",
            value: 1
          }
        },
        {
          title: "Quick Learner",
          description: "Complete 5 quizzes",
          icon: "🚀",
          rarity: "bronze",
          criteria: {
            type: "quiz_completion",
            value: 5
          }
        },
        {
          title: "Quiz Master",
          description: "Complete 10 quizzes",
          icon: "🎓",
          rarity: "silver",
          criteria: {
            type: "quiz_completion",
            value: 10
          }
        },
        {
          title: "Streak Builder",
          description: "Maintain a 7-day learning streak",
          icon: "🔥",
          rarity: "silver",
          criteria: {
            type: "streak",
            value: 7
          }
        },
        {
          title: "Subject Specialist",
          description: "Master any subject (100% completion)",
          icon: "📚",
          rarity: "silver",
          criteria: {
            type: "subject_mastery",
            value: 100
          }
        },
        {
          title: "Perfect Score",
          description: "Achieve a perfect score on any quiz",
          icon: "⭐",
          rarity: "gold",
          criteria: {
            type: "perfect_score",
            value: 1
          }
        },
        {
          title: "Dedicated Learner",
          description: "Complete 25 quizzes",
          icon: "🏆",
          rarity: "gold",
          criteria: {
            type: "quiz_completion",
            value: 25
          }
        },
        {
          title: "Speed Demon",
          description: "Complete a quiz in under 30 seconds with 90%+ accuracy",
          icon: "⚡",
          rarity: "gold",
          criteria: {
            type: "quiz_completion",
            value: 1
          }
        },
        {
          title: "Legend",
          description: "Achieve 5 perfect scores",
          icon: "👑",
          rarity: "platinum",
          criteria: {
            type: "perfect_score",
            value: 5
          }
        },
        {
          title: "Ultimate Scholar",
          description: "Complete 50 quizzes",
          icon: "🎓",
          rarity: "platinum",
          criteria: {
            type: "quiz_completion",
            value: 50
          }
        }
      ];
      
      // Create each achievement
      for (const achievement of defaultAchievements) {
        await achievementService.createAchievement(achievement);
      }
      
      console.log("Default achievements initialized");
    }
  } catch (error) {
    console.error("Error initializing achievements:", error);
  }
};