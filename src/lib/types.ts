// User data model
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "student" | "teacher" | "admin";
  class?: string;
  age?: number;
  gradeLevel?: string;
  school?: string;
  location?: string;
  nativeLanguage?: string;
  targetLanguages?: string[];
  learningGoals?: string[];
  preferredLanguage?: string;
  onboardingCompleted?: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  xp: number;
  level: number;
  streak: number;
  lastStreakDate?: Date;
}

// Subject data model
export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
 color: string;
  level: number;
  progress: number;
 totalLessons: number;
  completedLessons: number;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz data model
export interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  timeLimit?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

// Question data model
export interface Question {
  id: string;
  quizId: string;
 text: string;
 options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  points: number;
}

// User quiz attempt data model
export interface UserQuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  startedAt: Date;
  completedAt: Date;
  updatedAt?: Date;
  answers: UserAnswer[];
}

// User answer data model
export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

// Achievement data model
export interface Achievement {
  id: string;
  title: string;
 description: string;
  icon: string;
  rarity: "bronze" | "silver" | "gold" | "platinum";
  criteria: AchievementCriteria;
  createdAt: Date;
}

// Achievement criteria data model
export interface AchievementCriteria {
  type: "quiz_completion" | "streak" | "subject_mastery" | "perfect_score" | "speed_demon";
  value: number;
  subjectId?: string;
}

// User achievement data model
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
}

// Contest data model
export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  subjectId?: string;
  participants: string[]; // user IDs
  maxParticipants?: number;
  prize: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number; // in minutes
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// User contest participation data model
export interface UserContestParticipation {
  id: string;
  userId: string;
 contestId: string;
  score: number;
 rank?: number;
  joinedAt: Date;
}

// Leaderboard user data model
export interface LeaderboardUser extends User {
  rank: number;
  badges: number;
  weeklyXP?: number;
  monthlyXP?: number;
}

// Lesson data model
export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  content: string; // Rich text content or markdown
  order: number; // Sequence order within the subject
  difficulty: "easy" | "medium" | "hard";
  estimatedDuration: number; // in minutes
  objectives: string[]; // Learning objectives
  resources?: LessonResource[]; // Additional resources
  quizId?: string; // Optional quiz associated with lesson
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // Teacher who created the lesson
}

// Lesson resource data model
export interface LessonResource {
  id: string;
  type: "video" | "pdf" | "link" | "image" | "audio";
  title: string;
  url: string;
  description?: string;
}

// User lesson progress data model
export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  subjectId: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number; // 0-100 percentage
  timeSpent: number; // in minutes
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  notes?: string; // Student's notes
}

// Teacher-Student relationship data model
export interface TeacherStudent {
  id: string;
  teacherId: string;
  studentId: string;
  subjectIds: string[]; // Subjects the teacher manages for this student
  createdAt: Date;
  status: "active" | "inactive";
}

// Student performance summary
export interface StudentPerformance {
  userId: string;
  user: User;
  subjectId: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageQuizScore: number;
  totalTimeSpent: number; // in minutes
  lastActivity: Date;
  currentStreak: number;
  achievements: number;
}

// Lesson assignment data model
export interface LessonAssignment {
  id: string;
  teacherId: string;
  studentIds: string[]; // Students assigned to this lesson
  lessonId: string;
  subjectId: string;
  dueDate?: Date;
  instructions?: string;
  createdAt: Date;
  status: "draft" | "assigned" | "completed";
}

// Class/Group data model for teachers
export interface TeacherClass {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  subjectIds: string[];
  studentIds: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// XP Gain data model
export interface XPGain {
  id: string;
  userId: string;
  amount: number;
  source: "quiz" | "achievement" | "contest" | "other";
  sourceId?: string; // ID of the quiz, achievement, or contest
  timestamp: Date;
}

// User preferences model
export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

// User profile model (based on users collection)
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "student" | "teacher" | "admin";
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  preferences: UserPreferences;
}

// Proficiency level model
export interface ProficiencyLevel {
  speaking: "beginner" | "intermediate" | "advanced" | "fluent";
  listening: "beginner" | "intermediate" | "advanced" | "fluent";
  reading: "beginner" | "intermediate" | "advanced" | "fluent";
  writing: "beginner" | "intermediate" | "advanced" | "fluent";
}

// Student profile model (based on studentProfiles collection)
export interface StudentProfile {
  userId: string;
  age: number;
  gradeLevel: string;
  school: string;
  location: string;
  nativeLanguage: string;
  targetLanguages: string[];
  learningGoals: string[];
  proficiencyLevel: ProficiencyLevel;
  xp: number;
  level: number;
  streak: number;
  lastStreakDate: Date;
  enrolledClasses: string[];
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Teacher availability model
export interface TeacherAvailability {
  monday: { start: string; end: string };
  tuesday: { start: string; end: string };
  wednesday: { start: string; end: string };
  thursday: { start: string; end: string };
 friday: { start: string; end: string };
  saturday: { start: string; end: string };
  sunday: { start: string; end: string };
}

// Teacher profile model (based on teacherProfiles collection)
export interface TeacherProfile {
  userId: string;
  qualifications: string[];
  specializations: string[];
  yearsOfExperience: number;
  bio: string;
  school: string;
  location: string;
  teachingLanguages: string[];
  availability: TeacherAvailability;
  rating: number;
  totalRatings: number;
  classesTaught: string[];
  createdAt: Date;
  updatedAt: Date;
}