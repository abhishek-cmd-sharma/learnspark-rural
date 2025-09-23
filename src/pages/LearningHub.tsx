import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  History,
  Star,
  Zap,
  Trophy,
  Target,
  Clock,
  Users,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  ChevronRight,
  Play,
  CheckCircle
} from "lucide-react";

// Import images
import mathHero from "@/assets/math-hero.jpg";
import englishHero from "@/assets/english-hero.jpg";
import scienceHero from "@/assets/science-hero.jpg";
import historyHero from "@/assets/history-hero.jpg";
import geographyHero from "@/assets/geography-hero.jpg";
import rocketHero from "@/assets/rocket-hero.jpg";

// Subject images mapping
const subjectImages: Record<string, string> = {
  "Mathematics": mathHero,
  "English": englishHero,
  "Science": scienceHero,
  "History": historyHero,
  "Geography": geographyHero,
  "General Knowledge": rocketHero
};

// Subject icons mapping
const subjectIcons: Record<string, React.ReactNode> = {
  "Mathematics": <Calculator className="w-6 h-6" />,
  "English": <BookOpen className="w-6 h-6" />,
  "Science": <FlaskConical className="w-6 h-6" />,
  "History": <History className="w-6 h-6" />,
  "Geography": <Globe className="w-6 h-6" />,
  "General Knowledge": <Star className="w-6 h-6" />
};

// Subject gradients mapping
const subjectGradients: Record<string, string> = {
  "Mathematics": "from-blue-500 to-purple-600",
  "English": "from-green-500 to-teal-600",
  "Science": "from-purple-500 to-indigo-600",
  "History": "from-amber-500 to-orange-600",
  "Geography": "from-emerald-50 to-cyan-600",
  "General Knowledge": "from-rose-500 to-pink-600"
};

// Quick action buttons
const quickActions = [
 { id: "daily", label: "Daily Quiz", icon: <Target className="w-5 h-5" />, path: "/daily-questions", color: "bg-blue-500" },
  { id: "contests", label: "Contests", icon: <Trophy className="w-5 h-5" />, path: "/contests", color: "bg-purple-500" },
  { id: "leaderboard", label: "Leaderboard", icon: <Award className="w-5 h-5" />, path: "/leaderboard", color: "bg-amber-500" },
  { id: "progress", label: "Progress", icon: <TrendingUp className="w-5 h-5" />, path: "/progress", color: "bg-green-500" }
];

export default function LearningHub() {
  const navigate = useNavigate();
  const { subjects, loadingSubjects, errorSubjects, userQuizAttempts, loadingUserQuizAttempts, errorUserQuizAttempts } = useFirestore();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle subject card click
  const handleSubjectClick = (subjectName: string) => {
    const normalizedSubject = subjectName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/subject/${normalizedSubject}`);
  };

  // Get quiz attempts for progress tracking
  const completedQuizzes = userQuizAttempts.filter(attempt => attempt.completedAt).length;
  const inProgressQuizzes = userQuizAttempts.filter(attempt => !attempt.completedAt).length;

  // Get recently assigned quizzes (limit to 3)
 const recentQuizzes = userQuizAttempts
    .filter(attempt => attempt.completedAt)
    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
    .slice(0, 3);

  if (loading || loadingSubjects || loadingUserQuizAttempts) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  // Check for errors
  if (errorSubjects || errorUserQuizAttempts) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error! </strong>
              <span className="block sm:inline">
                {errorSubjects || errorUserQuizAttempts || "An error occurred while loading data. Please try again later."}
              </span>
              <button
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {userData?.displayName || "Student"}! 👋
                </h1>
                <p className="text-lg opacity-90 mb-4">
                  Ready to continue your learning journey?
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                    <Zap className="w-5 h-5 mr-2" />
                    <span>{userData?.xp || 0} XP</span>
                  </div>
                  <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 mr-2" />
                    <span>Level {userData?.level || 1}</span>
                  </div>
                  <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                    <Trophy className="w-5 h-5 mr-2" />
                    <span>#{5} Class Rank</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-6xl opacity-20">🚀</div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="cursor-pointer h-full hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                      <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center text-white mb-3`}>
                        {action.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">{action.label}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subjects Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Subjects</h2>
              <Badge variant="secondary">{subjects.length} Available</Badge>
            </div>
            
            {subjects.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Subjects Available</h3>
                <p className="text-gray-600 mb-4">
                  There are no subjects available yet. Check back later!
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    className="cursor-pointer"
                    onClick={() => handleSubjectClick(subject.name)}
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl">
                      {/* Subject Image */}
                      <div className="relative h-40">
                        <img 
                          src={subjectImages[subject.name] || scienceHero} 
                          alt={subject.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${subjectGradients[subject.name] || "from-gray-500 to-gray-700"} opacity-80`} />
                        
                        {/* Subject Icon */}
                        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-white shadow-lg">
                          <div className={`bg-gradient-to-r ${subjectGradients[subject.name] || "from-gray-500 to-gray-700"} w-10 h-10 rounded-full flex items-center justify-center`}>
                            {subjectIcons[subject.name] || <BookOpen className="w-6 h-6" />}
                          </div>
                        </div>
                        
                        {/* Level Badge */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Level {subject.level}
                        </div>
                      </div>
                      
                      {/* Subject Content */}
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {subject.description}
                        </p>
                        
                        {/* Progress */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-semibold">{subject.progress}%</span>
                          </div>
                          <Progress value={subject.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {subject.completedLessons} of {subject.totalLessons} lessons completed
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            
            {recentQuizzes.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">No Recent Activity</h3>
                <p className="text-gray-600">
                  Complete a quiz to see your activity here
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentQuizzes.map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">Quiz Completed</h3>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Scored {attempt.correctAnswers}/{attempt.totalQuestions}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{new Date(attempt.completedAt!).toLocaleDateString()}</span>
                        <span>+{attempt.score * 10} XP</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}