import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Target, 
  BookOpen,
  Trophy,
  Star,
  Clock,
  Zap,
  Users,
  Calendar,
  Bell,
  Plus,
  TrendingUp,
  Award,
  Flame,
  BarChart3,
  Activity,
  CheckCircle,
  Home
} from "lucide-react";
import { motion } from "framer-motion";
import { Quiz, UserQuizAttempt } from "@/lib/types";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { BounceCard, WavingHand, RainbowText, ScrollReveal, ConfettiEffect } from "@/components/InteractiveAnimations";
import DashboardNavigation from "@/components/DashboardNavigation";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export default function Dashboard() {
  const { userData } = useAuth();
  const { subjects, getQuizzesBySubject, userQuizAttempts, loadingUserQuizAttempts, errorSubjects, errorUserQuizAttempts } = useFirestore();
  const navigate = useNavigate();
  
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [classRank, setClassRank] = useState(5);
  const [gemsCount, setGemsCount] = useState(0);
  const [assignedQuizzes, setAssignedQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New math quiz available!", time: "2 hours ago", read: false },
    { id: 2, message: "You've earned a new badge!", time: "1 day ago", read: true },
    { id: 3, message: "Science contest starts tomorrow", time: "2 days ago", read: false }
  ]);

  // Load student data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Use real data from Firestore
        setStudyStreak(userData?.streak || 0);
        setTotalXP(userData?.xp || 0);
        // Gems count would need to be fetched from Firestore if stored there
        // For now, we'll keep it as a placeholder
        setGemsCount(0);
        
        // Load assigned quizzes
        const allQuizzes: Quiz[] = [];
        
        for (const subject of subjects) {
          const quizzes = await getQuizzesBySubject(subject.id);
          allQuizzes.push(...quizzes);
        }
        
        setAssignedQuizzes(allQuizzes);
      } catch (error) {
        console.error("Error loading student data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userData && subjects.length > 0) {
      loadData();
    }
  }, [userData, subjects, getQuizzesBySubject]);

  const startDailyChallenge = (subject: string) => {
    // Navigate to the subject page or challenge page
    navigate(`/subjects/${subject}`);
  };

  const startQuiz = (quizId: string, subjectId: string) => {
    navigate(`/subjects/${subjectId}/quizzes/${quizId}`);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Get recently assigned quizzes (limit to 5)
  const recentQuizzes = assignedQuizzes.slice(0, 5);
  
  // Get quiz attempts for progress tracking
  const completedQuizzes = userQuizAttempts.filter(attempt => attempt.completedAt).length;
  const inProgressQuizzes = userQuizAttempts.filter(attempt => !attempt.completedAt).length;

  if (loading || loadingUserQuizAttempts) {
    return (
      <AnimatedBackground variant="stars" density="low">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AnimatedBackground>
    );
  }
  
  // Check for errors
  if (errorSubjects || errorUserQuizAttempts) {
    return (
      <AnimatedBackground variant="stars" density="low">
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
      </AnimatedBackground>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["student"]}>
      <AnimatedBackground variant="stars" density="low">
        <Header />

        {/* Dashboard Page */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Profile Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userData?.photoURL || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                      {userData?.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <WavingHand className="text-2xl" />
                      <RainbowText text={`Welcome back, ${userData?.displayName || "Student"}!`} className="text-2xl font-bold" />
                    </div>
                    <p className="text-gray-600">Continue your learning journey</p>
                    <div className="flex items-center mt-2">
                      <Badge variant="secondary" className="mr-2">
                        Level {userData?.level || 1}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        {studyStreak} day streak
                      </div>
                    </div>
                    </div>
                  </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalXP}</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">#{classRank}</div>
                    <div className="text-sm text-gray-600">Class Rank</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{gemsCount}</div>
                    <div className="text-sm text-gray-600">Gems</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                </div>
              </motion.div>

              {/* Dashboard Navigation */}
              <DashboardNavigation />

              {/* Assigned Quizzes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">📝 Assigned Quizzes</h3>
                  <Badge variant="secondary">{assignedQuizzes.length} Total</Badge>
                </div>
                
                {recentQuizzes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No quizzes assigned yet</p>
                    <p className="text-sm mt-2">Your teacher will assign quizzes soon</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentQuizzes.map((quiz) => {
                      const subject = subjects.find(s => s.id === quiz.subjectId);
                      const attempt = userQuizAttempts.find(a => a.quizId === quiz.id);
                      
                      return (
                        <div key={quiz.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                              <BookOpen className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                              <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Target className="w-4 h-4 mr-1" />
                                  {subject?.name || "Unknown Subject"}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {quiz.questions.length} questions
                                </span>
                                {attempt ? (
                                  attempt.completedAt ? (
                                    <span className="flex items-center text-green-600">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Completed
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-yellow-600">
                                      <Clock className="w-4 h-4 mr-1" />
                                      In Progress
                                    </span>
                                  )
                                ) : (
                                  <span className="flex items-center text-blue-600">
                                    <Zap className="w-4 h-4 mr-1" />
                                    Not Started
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => startQuiz(quiz.id, quiz.subjectId)}
                              disabled={attempt?.completedAt !== undefined}
                            >
                              {attempt?.completedAt ? "Review" : "Start Quiz"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  )}
                </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">📈 Recent Activity</h3>
                <div className="space-y-4">
                  {userQuizAttempts
                    .filter(attempt => attempt.completedAt)
                    .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
                    .slice(0, 3)
                    .map((attempt, index) => {
                      const quiz = assignedQuizzes.find(q => q.id === attempt.quizId);
                      const subject = subjects.find(s => s.id === quiz?.subjectId);
                      
                      return (
                        <div key={attempt.id} className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                            ✓
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              Completed {quiz?.title || "Unknown Quiz"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {subject?.name || "Unknown Subject"} •
                              Scored {attempt.correctAnswers}/{attempt.totalQuestions} •
                              Earned {attempt.score * 10} XP
                            </p>
                          </div>
                          <div className="text-2xl">
                            {subject?.name === "Mathematics" ? "🔢" :
                             subject?.name === "English" ? "📖" :
                             subject?.name === "Science" ? "🔬" : "📚"}
                           </div>
                         </div>
                       );
                     })}
                  
                  {userQuizAttempts.filter(attempt => attempt.completedAt).length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No activity yet</p>
                      <p className="text-sm mt-1">Complete a quiz to see your activity here</p>
                    </div>
                )}

              </div>
            </motion.div>
          </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Performance Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Performance Analytics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Completed Quizzes</span>
                      </span>
                      <span className="font-semibold">{completedQuizzes}</span>
                    </div>
                    <Progress value={(completedQuizzes / Math.max(assignedQuizzes.length, 1)) * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span>Avg. Accuracy</span>
                      </span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>Study Time</span>
                      </span>
                      <span className="font-semibold">45h</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/progress")}>
                  View Detailed Analytics
                </Button>
              </motion.div>

              {/* Quick Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="flex flex-col h-20" onClick={() => navigate("/learning")}>
                    <BookOpen className="w-5 h-5 mb-1" />
                    <span>Learning Hub</span>
                  </Button>
                  <Button className="flex flex-col h-20" onClick={() => navigate("/daily-questions")}>
                    <Target className="w-5 h-5 mb-1" />
                    <span>Daily Qs</span>
                  </Button>
                  <Button className="flex flex-col h-20" variant="outline" onClick={() => navigate("/contests")}>
                    <Trophy className="w-5 h-5 mb-1" />
                    <span>Contests</span>
                  </Button>
                  <Button className="flex flex-col h-20" variant="outline" onClick={() => navigate("/progress")}>
                    <BarChart3 className="w-5 h-5 mb-1" />
                    <span>Progress</span>
                  </Button>
                </div>
              </motion.div>

              {/* Upcoming Events Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Math Weekly Challenge</p>
                      <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">English Grammar Contest</p>
                      <p className="text-xs text-gray-600">Jun 15, 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Science Quiz Deadline</p>
                      <p className="text-xs text-gray-600">Jun 20, 11:59 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Notification Center */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">🔔 Notifications</h3>
                  <Badge variant="secondary">
                    {notifications.filter(n => !n.read).length} new
                  </Badge>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read ? "bg-gray-50" : "bg-blue-50 border border-blue-200"
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium">{notification.message}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    </RoleProtectedRoute>
  );
}
