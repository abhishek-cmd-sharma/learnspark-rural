import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { XPBar } from "@/components/XPBar";
import { SubjectCard } from "@/components/SubjectCard";
import { AchievementBadge } from "@/components/AchievementBadge";
import { DailyStreak } from "@/components/DailyStreak";
import { 
  Calculator, 
  BookOpen, 
  Microscope, 
  Scroll, 
  Globe, 
  Brain,
  Trophy,
  Medal,
  Target,
  Zap,
  Star,
  Award
} from "lucide-react";

// Import images
import mathHero from "@/assets/math-hero.jpg";
import englishHero from "@/assets/english-hero.jpg";
import scienceHero from "@/assets/science-hero.jpg";
import historyHero from "@/assets/history-hero.jpg";
import geographyHero from "@/assets/geography-hero.jpg";

export default function Dashboard() {
  const subjects = [
    {
      name: "Mathematics",
      icon: <Calculator />,
      progress: 75,
      level: 8,
      color: "subject-math",
      image: mathHero,
      totalLessons: 24,
      completedLessons: 18,
    },
    {
      name: "English",
      icon: <BookOpen />,
      progress: 60,
      level: 6,
      color: "subject-english", 
      image: englishHero,
      totalLessons: 20,
      completedLessons: 12,
    },
    {
      name: "Science",
      icon: <Microscope />,
      progress: 45,
      level: 4,
      color: "subject-science",
      image: scienceHero,
      totalLessons: 18,
      completedLessons: 8,
    },
    {
      name: "History",
      icon: <Scroll />,
      progress: 30,
      level: 3,
      color: "subject-history",
      image: historyHero,
      totalLessons: 15,
      completedLessons: 5,
    },
    {
      name: "Geography",
      icon: <Globe />,
      progress: 20,
      level: 2,
      color: "subject-geography",
      image: geographyHero,
      totalLessons: 12,
      completedLessons: 3,
    },
    {
      name: "General Knowledge",
      icon: <Brain />,
      progress: 85,
      level: 10,
      color: "subject-general",
      image: scienceHero, // Placeholder for now
      totalLessons: 30,
      completedLessons: 25,
    },
  ];

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first quiz",
      icon: <Star />,
      isUnlocked: true,
      rarity: "bronze" as const,
    },
    {
      title: "Week Warrior",
      description: "7-day learning streak",
      icon: <Zap />,
      isUnlocked: true,
      rarity: "silver" as const,
    },
    {
      title: "Math Master",
      description: "Complete 20 math quizzes",
      icon: <Calculator />,
      isUnlocked: false,
      rarity: "gold" as const,
      progress: 18,
      maxProgress: 20,
    },
    {
      title: "Quiz Champion",
      description: "Score 100% on 5 quizzes",
      icon: <Trophy />,
      isUnlocked: false,
      rarity: "platinum" as const,
      progress: 3,
      maxProgress: 5,
    },
  ];

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-primary">Alex!</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your learning adventure? 🚀
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <XPBar 
            currentXP={1250} 
            nextLevelXP={1500} 
            level={8}
            className="lg:col-span-2"
          />
          <DailyStreak 
            streakCount={12} 
            todayCompleted={true}
          />
        </div>

        {/* Subjects Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <h2 className="text-2xl font-display font-bold">Your Subjects</h2>
            <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <SubjectCard {...subject} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Achievements */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-display font-bold">Achievements</h2>
            <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <AchievementBadge {...achievement} />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}