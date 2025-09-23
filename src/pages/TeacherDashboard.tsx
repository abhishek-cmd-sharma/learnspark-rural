import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { StudentManagement } from "@/components/StudentManagement";
import { LessonManagement } from "@/components/LessonManagement";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "@/lib/types";
import {
  Users,
  BookOpen,
  Target,
  BarChart3,
  Calendar,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  Award,
  PlusCircle,
  FileText,
  Video,
  Sparkles
} from "lucide-react";

export default function TeacherDashboard() {
  const { userData } = useAuth();
  const { subjects, getStudentsByTeacherWithUserData, getQuizzesBySubject, errorSubjects } = useFirestore();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    activeClasses: 0,
    avgQuizScore: 0,
    recentActivity: 0
  });
  const [students, setStudents] = useState<User[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    // Use real data from Firestore
    // These values will be updated when students are loaded
    setStats({
      totalStudents: students.length,
      totalLessons: 0, // Would need to fetch from Firestore
      totalQuizzes: 0, // Would need to fetch from Firestore
      activeClasses: 0, // Would need to fetch from Firestore
      avgQuizScore: 0, // Would need to calculate from quiz attempts
      recentActivity: 0 // Would need to fetch from Firestore
    });
  }, [students]);
  
  useEffect(() => {
    const loadStudents = async () => {
      if (userData?.uid) {
        try {
          setLoadingStudents(true);
          const studentData = await getStudentsByTeacherWithUserData(userData.uid);
          setStudents(studentData);
          
          // Update stats with real data
          setStats(prevStats => ({
            ...prevStats,
            totalStudents: studentData.length
          }));
        } catch (error) {
          console.error("Error loading students:", error);
        } finally {
          setLoadingStudents(false);
        }
      }
    };
    
    loadStudents();
  }, [userData, getStudentsByTeacherWithUserData]);

  const quickActions = [
    {
      title: "Create Lesson",
      description: "Design new learning content",
      icon: <FileText className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      action: "create-lesson"
    },
    {
      title: "Create Quiz",
      description: "Build assessments for students",
      icon: <Target className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      action: "create-quiz"
    },
    {
      title: "Generate with AI",
      description: "Let AI create content for you",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      action: "ai-generate"
    },
    {
      title: "Add Students",
      description: "Invite students to your classes",
      icon: <Users className="h-6 w-6" />,
      color: "from-orange-500 to-orange-600",
      action: "add-students"
    }
  ];

  const recentActivities = [
    { type: "quiz_completed", student: "Alice Johnson", subject: "Mathematics", time: "2 hours ago" },
    { type: "lesson_viewed", student: "Bob Smith", subject: "Science", time: "3 hours ago" },
    { type: "quiz_completed", student: "Carol Brown", subject: "English", time: "5 hours ago" },
    { type: "lesson_completed", student: "David Wilson", subject: "History", time: "1 day ago" }
  ];

  const upcomingTasks = [
    { title: "Grade Math Quiz #3", dueDate: "Today", priority: "high" },
    { title: "Review Science Lesson 5", dueDate: "Tomorrow", priority: "medium" },
    { title: "Prepare English Test", dueDate: "This Week", priority: "low" }
  ];

  // Check for errors
  if (errorSubjects) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">
              {errorSubjects || "An error occurred while loading data. Please try again later."}
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

  if (!userData || userData.role !== "teacher") {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">This page is only accessible to teachers.</p>
          <Link to="/dashboard">
            <Button variant="cosmic">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RoleProtectedRoute allowedRoles={["teacher"]}>
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
              Welcome back, <span className="text-primary">Teacher {userData.displayName}!</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your classes, create content, and track student progress 📚
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalStudents}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalLessons}</div>
                  <div className="text-xs text-muted-foreground">Lessons</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                  <div className="text-xs text-muted-foreground">Quizzes</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.activeClasses}</div>
                  <div className="text-xs text-muted-foreground">Classes</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold">{stats.avgQuizScore}%</div>
                  <div className="text-xs text-muted-foreground">Avg Score</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="cosmic-card">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.recentActivity}</div>
                  <div className="text-xs text-muted-foreground">Recent</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={action.title} className="cosmic-card hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="cosmic-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 cosmic-card">
                          <div>
                            <div className="font-medium">{activity.student}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.type.replace('_', ' ')} in {activity.subject}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upcoming Tasks */}
                  <Card className="cosmic-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Upcoming Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {upcomingTasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-3 cosmic-card">
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">Due: {task.dueDate}</div>
                          </div>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Subjects Overview */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Your Subjects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjects.map((subject) => (
                        <div key={subject.id} className="cosmic-card p-4">
                          <h3 className="font-semibold mb-2">{subject.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{subject.description}</p>
                          <div className="flex gap-2">
                            <Link to={`/subjects/${subject.id}`}>
                              <Button size="sm" variant="outline">View</Button>
                            </Link>
                            <Link to={`/subjects/${subject.id}/quizzes`}>
                              <Button size="sm" variant="cosmic">Manage</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Student Management
                      </span>
                      <Button variant="cosmic">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Students
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStudents ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : students.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No students found.
                        <br />
                        Add students to your classes to see them here.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.map((student) => (
                          <div key={student.uid} className="cosmic-card p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                                {student.displayName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h3 className="font-semibold">{student.displayName || 'Unknown Student'}</h3>
                                <p className="text-sm text-muted-foreground">{student.email}</p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Level</span>
                                <span className="font-medium">Level {student.level || 1}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">XP</span>
                                <span className="font-medium">{student.xp || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Streak</span>
                                <span className="font-medium">{student.streak || 0} days</span>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                View Progress
                              </Button>
                              <Button size="sm" variant="cosmic">
                                Message
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="lessons" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Lesson Management
                      </span>
                      <Button variant="cosmic">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Lesson
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Lesson management features coming soon...
                      <br />
                      You'll be able to create, edit, and organize lessons here.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Analytics & Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Analytics dashboard coming soon...
                      <br />
                      You'll be able to view detailed student performance metrics here.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Teacher Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Settings panel coming soon...
                      <br />
                      You'll be able to configure your teaching preferences here.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
}
