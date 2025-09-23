import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useProfile } from "@/contexts/ProfileContext";
import {
  BarChart3,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Calendar,
  Trophy,
  Activity
} from "lucide-react";
import { Quiz, UserQuizAttempt, Subject } from "@/lib/types";

export const StudentProgress: React.FC = () => {
  const { userData } = useAuth();
  const { studentProfile } = useProfile();
  const { 
    subjects, 
    getQuizzesBySubject,
    userQuizAttempts,
    loadingUserQuizAttempts
  } = useFirestore();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalXP: 0,
    currentStreak: 0,
    bestStreak: 0,
    subjectProgress: [] as any[],
    recentActivity: [] as any[],
    weeklyProgress: [] as any[],
    achievements: [] as any[]
  });

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        setLoading(true);
        
        // Load all quizzes
        const allQuizzes: Quiz[] = [];
        for (const subject of subjects) {
          const subjectQuizzes = await getQuizzesBySubject(subject.id);
          allQuizzes.push(...subjectQuizzes);
        }
        setQuizzes(allQuizzes);
        
        // Calculate progress data
        calculateProgressData(allQuizzes, userQuizAttempts, subjects);
        
      } catch (error) {
        console.error("Error loading progress data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (subjects.length > 0 && !loadingUserQuizAttempts) {
      loadProgressData();
    }
  }, [subjects, userQuizAttempts, loadingUserQuizAttempts, getQuizzesBySubject]);

  const calculateProgressData = (
    allQuizzes: Quiz[], 
    attempts: UserQuizAttempt[], 
    subjectList: Subject[]
  ) => {
    const completedAttempts = attempts.filter(attempt => attempt.completedAt);
    const totalQuizzes = allQuizzes.length;
    const completedQuizzes = completedAttempts.length;
    
    // Calculate average score
    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
      : 0;
    
    // Calculate total XP from quiz attempts
    const totalXPFromQuizzes = completedAttempts.reduce((sum, attempt) => sum + (attempt.score * 10), 0);
    
    // Subject progress
    const subjectProgress = subjectList.map(subject => {
      const subjectQuizzes = allQuizzes.filter(quiz => quiz.subjectId === subject.id);
      const subjectAttempts = completedAttempts.filter(attempt => 
        subjectQuizzes.some(quiz => quiz.id === attempt.quizId)
      );
      
      const avgScore = subjectAttempts.length > 0 
        ? subjectAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / subjectAttempts.length
        : 0;
      
      const completionRate = subjectQuizzes.length > 0 
        ? (subjectAttempts.length / subjectQuizzes.length) * 100
        : 0;
      
      return {
        subject: subject.name,
        icon: subject.icon || "📚",
        totalQuizzes: subjectQuizzes.length,
        completedQuizzes: subjectAttempts.length,
        averageScore: avgScore,
        completionRate,
        xpEarned: subjectAttempts.reduce((sum, attempt) => sum + (attempt.score * 10), 0)
      };
    });
    
    // Recent activity (last 10 quiz attempts)
    const recentActivity = completedAttempts
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
      .slice(0, 10)
      .map(attempt => {
        const quiz = allQuizzes.find(q => q.id === attempt.quizId);
        const subject = subjectList.find(s => s.id === quiz?.subjectId);
        
        return {
          quizTitle: quiz?.title || "Unknown Quiz",
          subjectName: subject?.name || "Unknown Subject",
          subjectIcon: subject?.icon || "📚",
          score: attempt.score,
          xpEarned: attempt.score * 10,
          completedAt: attempt.completedAt,
          correctAnswers: attempt.correctAnswers,
          totalQuestions: attempt.totalQuestions
        };
      });
    
    // Weekly progress (last 7 days)
    const weeklyProgress = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayAttempts = completedAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.completedAt!);
        return attemptDate.toDateString() === date.toDateString();
      });
      
      weeklyProgress.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date,
        quizzesCompleted: dayAttempts.length,
        xpEarned: dayAttempts.reduce((sum, attempt) => sum + (attempt.score * 10), 0),
        averageScore: dayAttempts.length > 0 
          ? dayAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / dayAttempts.length
          : 0
      });
    }
    
    setProgressData({
      totalQuizzes,
      completedQuizzes,
      averageScore: Math.round(averageScore),
      totalXP: studentProfile?.xp || totalXPFromQuizzes,
      currentStreak: studentProfile?.streak || 0,
      bestStreak: studentProfile?.streak || 0, // This would need to be tracked separately
      subjectProgress,
      recentActivity,
      weeklyProgress,
      achievements: studentProfile?.achievements || []
    });
  };

  if (loading || loadingUserQuizAttempts) {
    return (
      <RoleProtectedRoute allowedRoles={["student"]}>
        <div className="min-h-screen cosmic-bg">
          <Header />
          <div className="container mx-auto py-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading progress data...</p>
            </div>
          </div>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen cosmic-bg">
        <Header />
        
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">My Progress</h1>
              <p className="text-muted-foreground">Track your learning journey and achievements</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="cosmic">
                <Trophy className="w-4 h-4 mr-2" />
                View Achievements
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{progressData.completedQuizzes}</div>
                <div className="text-xs text-muted-foreground">Quizzes Done</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{progressData.averageScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{progressData.totalXP}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">{progressData.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{progressData.achievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <div className="text-2xl font-bold">{studentProfile?.level || 1}</div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Progress */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Overall Progress
                    </CardTitle>
                    <CardDescription>Your learning statistics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Quiz Completion</span>
                        <span>{progressData.completedQuizzes}/{progressData.totalQuizzes}</span>
                      </div>
                      <Progress 
                        value={progressData.totalQuizzes > 0 ? (progressData.completedQuizzes / progressData.totalQuizzes) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span>{progressData.averageScore}%</span>
                      </div>
                      <Progress value={progressData.averageScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 cosmic-card">
                        <div className="text-lg font-bold text-green-600">{progressData.currentStreak}</div>
                        <div className="text-xs text-muted-foreground">Current Streak</div>
                      </div>
                      <div className="text-center p-3 cosmic-card">
                        <div className="text-lg font-bold text-blue-600">{progressData.bestStreak}</div>
                        <div className="text-xs text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Activity */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Weekly Activity
                    </CardTitle>
                    <CardDescription>Your activity over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {progressData.weeklyProgress.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-2 cosmic-card">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                              {day.date}
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {day.quizzesCompleted} quiz{day.quizzesCompleted !== 1 ? 'es' : ''}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {day.xpEarned} XP earned
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              {day.averageScore > 0 ? Math.round(day.averageScore) : 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest quiz completions</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressData.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {progressData.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 cosmic-card">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{activity.subjectIcon}</div>
                            <div>
                              <div className="font-medium">{activity.quizTitle}</div>
                              <div className="text-sm text-muted-foreground">
                                {activity.subjectName} • {activity.correctAnswers}/{activity.totalQuestions} correct
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {activity.completedAt?.toLocaleDateString()} at {activity.completedAt?.toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={activity.score >= 80 ? "default" : activity.score >= 60 ? "secondary" : "destructive"}
                            >
                              {Math.round(activity.score)}%
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-1">
                              +{activity.xpEarned} XP
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No quiz activity yet</p>
                      <p className="text-sm mt-2">Complete your first quiz to see activity here!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progressData.subjectProgress.map((subject, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span className="text-2xl">{subject.icon}</span>
                        {subject.subject}
                      </CardTitle>
                      <CardDescription>
                        {subject.completedQuizzes}/{subject.totalQuizzes} quizzes completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {Math.round(subject.averageScore)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Completion Rate</span>
                          <span>{Math.round(subject.completionRate)}%</span>
                        </div>
                        <Progress value={subject.completionRate} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">XP Earned:</span>
                        <span className="font-medium">{subject.xpEarned}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Detailed Activity Log
                  </CardTitle>
                  <CardDescription>Complete history of your quiz attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  {userQuizAttempts.filter(attempt => attempt.completedAt).length > 0 ? (
                    <div className="space-y-3">
                      {userQuizAttempts
                        .filter(attempt => attempt.completedAt)
                        .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
                        .map((attempt, index) => {
                          const quiz = quizzes.find(q => q.id === attempt.quizId);
                          const subject = subjects.find(s => s.id === quiz?.subjectId);
                          
                          return (
                            <div key={attempt.id} className="p-4 cosmic-card">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{subject?.icon || "📚"}</div>
                                  <div>
                                    <h4 className="font-semibold">{quiz?.title || "Unknown Quiz"}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {subject?.name || "Unknown Subject"}
                                    </p>
                                  </div>
                                </div>
                                <Badge 
                                  variant={attempt.score >= 80 ? "default" : attempt.score >= 60 ? "secondary" : "destructive"}
                                >
                                  {Math.round(attempt.score)}%
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Score:</span>
                                  <span className="ml-2 font-medium">{attempt.correctAnswers}/{attempt.totalQuestions}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">XP Earned:</span>
                                  <span className="ml-2 font-medium">{attempt.score * 10}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Date:</span>
                                  <span className="ml-2 font-medium">
                                    {attempt.completedAt?.toLocaleDateString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Time:</span>
                                  <span className="ml-2 font-medium">
                                    {attempt.completedAt?.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No activity to show yet</p>
                      <p className="text-sm mt-2">Start taking quizzes to build your activity log!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>Badges and accomplishments you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  {progressData.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {progressData.achievements.map((achievement, index) => (
                        <div key={index} className="p-4 cosmic-card border-l-4 border-yellow-400">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl">
                              🏆
                            </div>
                            <div>
                              <h4 className="font-semibold">{achievement.name || "Achievement"}</h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description || "Great job!"}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Earned: {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : "Recently"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No achievements yet</p>
                      <p className="text-sm mt-2">Complete quizzes and reach milestones to earn achievements!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default StudentProgress;