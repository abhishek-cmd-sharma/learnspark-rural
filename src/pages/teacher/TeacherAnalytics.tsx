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
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter
} from "lucide-react";
import { User, Quiz, UserQuizAttempt } from "@/lib/types";

export const TeacherAnalytics: React.FC = () => {
  const { userData } = useAuth();
  const { 
    subjects, 
    getStudentsByTeacherWithUserData, 
    getQuizzesBySubject,
    getAllUserQuizAttempts 
  } = useFirestore();
  
  const [students, setStudents] = useState<User[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<UserQuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    activeStudents: 0,
    topPerformers: [] as User[],
    strugglingStudents: [] as User[],
    subjectPerformance: [] as any[],
    recentActivity: [] as any[]
  });

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!userData?.uid) return;
      
      try {
        setLoading(true);
        
        // Load students
        const studentData = await getStudentsByTeacherWithUserData(userData.uid);
        setStudents(studentData);
        
        // Load all quizzes for teacher's subjects
        const allQuizzes: Quiz[] = [];
        for (const subject of subjects) {
          const subjectQuizzes = await getQuizzesBySubject(subject.id);
          allQuizzes.push(...subjectQuizzes);
        }
        setQuizzes(allQuizzes);
        
        // Load quiz attempts for all students
        const allAttempts = await getAllUserQuizAttempts();
        const teacherQuizIds = allQuizzes.map(q => q.id);
        const relevantAttempts = allAttempts.filter(attempt => 
          teacherQuizIds.includes(attempt.quizId)
        );
        setQuizAttempts(relevantAttempts);
        
        // Calculate analytics
        calculateAnalytics(studentData, allQuizzes, relevantAttempts);
        
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (subjects.length > 0) {
      loadAnalyticsData();
    }
  }, [userData, subjects, getStudentsByTeacherWithUserData, getQuizzesBySubject, getAllUserQuizAttempts]);

  const calculateAnalytics = (
    studentData: User[], 
    quizData: Quiz[], 
    attemptData: UserQuizAttempt[]
  ) => {
    const completedAttempts = attemptData.filter(attempt => attempt.completedAt);
    const totalPossibleAttempts = studentData.length * quizData.length;
    
    // Calculate average score
    const averageScore = completedAttempts.length > 0 
      ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
      : 0;
    
    // Calculate completion rate
    const completionRate = totalPossibleAttempts > 0 
      ? (completedAttempts.length / totalPossibleAttempts) * 100
      : 0;
    
    // Find active students (students who have attempted quizzes recently)
    const activeStudentIds = new Set(
      attemptData
        .filter(attempt => attempt.startedAt && 
          new Date().getTime() - attempt.startedAt.getTime() < 7 * 24 * 60 * 60 * 1000) // Last 7 days
        .map(attempt => attempt.userId)
    );
    
    // Calculate student performance
    const studentPerformance = studentData.map(student => {
      const studentAttempts = completedAttempts.filter(attempt => attempt.userId === student.uid);
      const avgScore = studentAttempts.length > 0 
        ? studentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / studentAttempts.length
        : 0;
      
      return {
        ...student,
        avgScore,
        attemptsCount: studentAttempts.length
      };
    });
    
    // Top performers (top 5 by average score)
    const topPerformers = studentPerformance
      .filter(student => student.attemptsCount > 0)
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);
    
    // Struggling students (bottom 5 by average score, but who have attempted quizzes)
    const strugglingStudents = studentPerformance
      .filter(student => student.attemptsCount > 0 && student.avgScore < 60)
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 5);
    
    // Subject performance
    const subjectPerformance = subjects.map(subject => {
      const subjectQuizzes = quizData.filter(quiz => quiz.subjectId === subject.id);
      const subjectAttempts = completedAttempts.filter(attempt => 
        subjectQuizzes.some(quiz => quiz.id === attempt.quizId)
      );
      
      const avgScore = subjectAttempts.length > 0 
        ? subjectAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / subjectAttempts.length
        : 0;
      
      return {
        subject: subject.name,
        avgScore,
        totalAttempts: subjectAttempts.length,
        totalQuizzes: subjectQuizzes.length
      };
    });
    
    // Recent activity (last 10 quiz attempts)
    const recentActivity = completedAttempts
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())
      .slice(0, 10)
      .map(attempt => {
        const student = studentData.find(s => s.uid === attempt.userId);
        const quiz = quizData.find(q => q.id === attempt.quizId);
        const subject = subjects.find(s => s.id === quiz?.subjectId);
        
        return {
          studentName: student?.displayName || "Unknown Student",
          quizTitle: quiz?.title || "Unknown Quiz",
          subjectName: subject?.name || "Unknown Subject",
          score: attempt.score,
          completedAt: attempt.completedAt
        };
      });
    
    setAnalytics({
      totalStudents: studentData.length,
      totalQuizzes: quizData.length,
      totalAttempts: attemptData.length,
      averageScore: Math.round(averageScore),
      completionRate: Math.round(completionRate),
      activeStudents: activeStudentIds.size,
      topPerformers,
      strugglingStudents,
      subjectPerformance,
      recentActivity
    });
  };

  if (loading) {
    return (
      <RoleProtectedRoute allowedRoles={["teacher"]}>
        <div className="min-h-screen cosmic-bg">
          <Header />
          <div className="container mx-auto py-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </RoleProtectedRoute>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["teacher"]}>
      <div className="min-h-screen cosmic-bg">
        <Header />
        
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track student performance and engagement</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="cosmic">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{analytics.totalStudents}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{analytics.totalQuizzes}</div>
                <div className="text-xs text-muted-foreground">Total Quizzes</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{analytics.totalAttempts}</div>
                <div className="text-xs text-muted-foreground">Quiz Attempts</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{analytics.averageScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                <div className="text-xs text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>

            <Card className="cosmic-card">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <div className="text-2xl font-bold">{analytics.activeStudents}</div>
                <div className="text-xs text-muted-foreground">Active Students</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      Top Performers
                    </CardTitle>
                    <CardDescription>Students with highest average scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.topPerformers.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.topPerformers.map((student, index) => (
                          <div key={student.uid} className="flex items-center justify-between p-3 cosmic-card">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{student.displayName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {student.attemptsCount} quiz{student.attemptsCount !== 1 ? 'es' : ''} completed
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {Math.round(student.avgScore)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No quiz attempts yet
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Students Needing Help */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Students Needing Help
                    </CardTitle>
                    <CardDescription>Students with scores below 60%</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analytics.strugglingStudents.length > 0 ? (
                      <div className="space-y-3">
                        {analytics.strugglingStudents.map((student) => (
                          <div key={student.uid} className="flex items-center justify-between p-3 cosmic-card border-l-4 border-red-200">
                            <div>
                              <div className="font-medium">{student.displayName}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.attemptsCount} quiz{student.attemptsCount !== 1 ? 'es' : ''} completed
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="destructive">
                                {Math.round(student.avgScore)}%
                              </Badge>
                              <Button size="sm" variant="outline" className="ml-2">
                                Help
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        All students are performing well! 🎉
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Subject Performance */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription>Average performance across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.subjectPerformance.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{subject.subject}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {subject.totalAttempts} attempts
                            </span>
                            <Badge variant="outline">
                              {Math.round(subject.avgScore)}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={subject.avgScore} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle>Student Performance Details</CardTitle>
                  <CardDescription>Detailed view of each student's progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => {
                      const studentAttempts = quizAttempts.filter(attempt => 
                        attempt.userId === student.uid && attempt.completedAt
                      );
                      const avgScore = studentAttempts.length > 0 
                        ? studentAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / studentAttempts.length
                        : 0;
                      
                      return (
                        <div key={student.uid} className="p-4 cosmic-card">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                                {student.displayName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h3 className="font-semibold">{student.displayName || 'Unknown Student'}</h3>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">
                                {studentAttempts.length > 0 ? Math.round(avgScore) : 0}%
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {studentAttempts.length} quiz{studentAttempts.length !== 1 ? 'es' : ''}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Level:</span>
                              <span className="ml-2 font-medium">{student.level || 1}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">XP:</span>
                              <span className="ml-2 font-medium">{student.xp || 0}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Streak:</span>
                              <span className="ml-2 font-medium">{student.streak || 0} days</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analytics.subjectPerformance.map((subject, index) => (
                  <Card key={index} className="cosmic-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{subject.subject}</CardTitle>
                      <CardDescription>
                        {subject.totalQuizzes} quiz{subject.totalQuizzes !== 1 ? 'es' : ''} created
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {Math.round(subject.avgScore)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Average Score</div>
                        </div>
                        <Progress value={subject.avgScore} className="h-3" />
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Attempts:</span>
                          <span className="font-medium">{subject.totalAttempts}</span>
                        </div>
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
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Quiz Activity
                  </CardTitle>
                  <CardDescription>Latest quiz completions by your students</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 cosmic-card">
                          <div>
                            <div className="font-medium">{activity.studentName}</div>
                            <div className="text-sm text-muted-foreground">
                              Completed "{activity.quizTitle}" in {activity.subjectName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {activity.completedAt?.toLocaleDateString()} at {activity.completedAt?.toLocaleTimeString()}
                            </div>
                          </div>
                          <Badge 
                            variant={activity.score >= 80 ? "default" : activity.score >= 60 ? "secondary" : "destructive"}
                          >
                            {Math.round(activity.score)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent quiz activity
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

export default TeacherAnalytics;