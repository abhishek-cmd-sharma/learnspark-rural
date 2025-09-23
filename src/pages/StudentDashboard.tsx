import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  BookOpen,
  Trophy,
  Star,
  Clock,
  Zap,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { Quiz, UserQuizAttempt } from "@/lib/types";

export default function StudentDashboard() {
  const { userData } = useAuth();
  const { subjects, getQuizzesBySubject, userQuizAttempts, loadingUserQuizAttempts, errorSubjects, errorUserQuizAttempts } = useFirestore();
  const navigate = useNavigate();
  
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [classRank, setClassRank] = useState(5);
  const [gemsCount, setGemsCount] = useState(0);
  const [assignedQuizzes, setAssignedQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Get recently assigned quizzes (limit to 5)
 const recentQuizzes = assignedQuizzes.slice(0, 5);
  
  // Get quiz attempts for progress tracking
  const completedQuizzes = userQuizAttempts.filter(attempt => attempt.completedAt).length;
  const inProgressQuizzes = userQuizAttempts.filter(attempt => !attempt.completedAt).length;

  if (loading || loadingUserQuizAttempts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check for errors
  if (errorSubjects || errorUserQuizAttempts) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Page */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {userData?.displayName || "Student"}! 🌟</h2>
                <p className="text-lg opacity-90 mb-6">Ready to continue your learning journey?</p>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{studyStreak}</div>
                    <div className="text-sm opacity-75">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalXP}</div>
                    <div className="text-sm opacity-75">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">#{classRank}</div>
                    <div className="text-sm opacity-75">Class Rank</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 text-6xl opacity-20 floating-animation">🚀</div>
            </div>

            {/* Assigned Quizzes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => startQuiz(quiz.id, quiz.subjectId)}
                          disabled={attempt?.completedAt !== undefined}
                        >
                          {attempt?.completedAt ? "Review" : "Start Quiz"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                    <p>No quiz attempts yet</p>
                    <p className="text-sm mt-1">Complete a quiz to see your activity here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h3>
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
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl streak-fire">🔥</span>
                    <span className="font-semibold">Study Streak</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">{studyStreak}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-semibold">Total XP</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{totalXP}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💎</span>
                    <span className="font-semibold">Gems</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{gemsCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏆</span>
                    <span className="font-semibold">Badges</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">8</span>
                </div>
              </div>
            </div>

            {/* Quiz Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Quiz Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Completed</span>
                    </span>
                    <span className="font-semibold">{completedQuizzes}</span>
                  </div>
                  <Progress value={(completedQuizzes / Math.max(assignedQuizzes.length, 1)) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span>In Progress</span>
                    </span>
                    <span className="font-semibold">{inProgressQuizzes}</span>
                  </div>
                  <Progress value={(inProgressQuizzes / Math.max(assignedQuizzes.length, 1)) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Not Started</span>
                    </span>
                    <span className="font-semibold">{assignedQuizzes.length - completedQuizzes - inProgressQuizzes}</span>
                  </div>
                  <Progress value={((assignedQuizzes.length - completedQuizzes - inProgressQuizzes) / Math.max(assignedQuizzes.length, 1)) * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Subject Progress</h3>
              <div className="space-y-4">
                {subjects.slice(0, 3).map((subject) => (
                  <div key={subject.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center space-x-2">
                        <span>{subject.icon}</span>
                        <span>{subject.name}</span>
                      </span>
                      <span className="font-semibold">Level {subject.level} • {subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🏅 Class Leaderboard</h3>
              <div className="space-y-3">
                <div className="leaderboard-item flex items-center space-x-3 p-3 rounded-xl">
                  <span className="text-2xl">🥇</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Arjun Kumar</div>
                    <div className="text-xs text-gray-600">4,250 XP</div>
                  </div>
                  <div className="class-badge">Class 8</div>
                </div>
                
                <div className="leaderboard-item flex items-center space-x-3 p-3 rounded-xl">
                  <span className="text-2xl">🥈</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Sneha Patel</div>
                    <div className="text-xs text-gray-600">3,890 XP</div>
                  </div>
                  <div className="class-badge">Class 8</div>
                </div>
                
                <div className="leaderboard-item flex items-center space-x-3 p-3 rounded-xl border-2 border-orange-300">
                  <span className="text-2xl">🥉</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Rahul Singh</div>
                    <div className="text-xs text-gray-600">3,650 XP</div>
                  </div>
                  <div className="class-badge">Class 8</div>
                </div>
                
                <div className="leaderboard-item flex items-center space-x-3 p-3 rounded-xl bg-yellow-50 border-2 border-yellow-300">
                  <span className="text-2xl">5️⃣</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{userData?.displayName || "You"}</div>
                    <div className="text-xs text-gray-600">{totalXP} XP</div>
                  </div>
                  <div className="class-badge">Class 8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}