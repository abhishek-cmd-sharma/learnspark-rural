import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Calendar,
  BarChart3,
  Users
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { UserQuizAttempt, Quiz, Subject } from "@/lib/types";
import { format, differenceInDays } from "date-fns";

interface StudentProgressData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
  currentStreak: number;
  subjectProgress: {
    subjectId: string;
    subjectName: string;
    quizzesCompleted: number;
    totalQuizzes: number;
    averageScore: number;
  }[];
}

interface StudentProgressTrackerProps {
 students: any[];
  subjectId?: string;
}

export function StudentProgressTracker({ students, subjectId }: StudentProgressTrackerProps) {
  const { userQuizAttempts, getQuizzesBySubject } = useFirestore();
  const [progressData, setProgressData] = useState<StudentProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadProgressData();
  }, [students, subjectId]);

 const loadProgressData = async () => {
    try {
      setLoading(true);
      
      // Get all subjects if not filtered by subject
      let allSubjects: Subject[] = [];
      if (!subjectId) {
        // In a real implementation, we would fetch all subjects from Firestore
        // For now, we'll use a placeholder
        allSubjects = [];
      }
      
      setSubjects(allSubjects);
      
      // Load progress data for each student
      const progressPromises = students.map(async (student: any) => {
        // Get quiz attempts for this student
        // Filter attempts by student ID
        const studentAttempts = userQuizAttempts.filter(attempt => attempt.userId === student.uid);
        
        // Filter by subject if specified
        let filteredAttempts = studentAttempts;
        if (subjectId) {
          filteredAttempts = studentAttempts.filter(attempt => 
            // We would need to get the quiz to check its subject
            // This is a simplified implementation
            true
          );
        }
        
        // Calculate progress metrics
        const totalQuizzes = filteredAttempts.length;
        const completedQuizzes = filteredAttempts.filter(a => a.completedAt).length;
        const averageScore = totalQuizzes > 0 
          ? filteredAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / totalQuizzes
          : 0;
        
        const timeSpent = filteredAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
        
        const lastActivity = filteredAttempts.length > 0 
          ? new Date(Math.max(...filteredAttempts.map(a => a.completedAt?.getTime() || 0)))
          : new Date();
        
        // Calculate current streak (simplified)
        const currentStreak = student.streak || 0;
        
        // Subject progress (simplified)
        const subjectProgress = subjectId ? [] : [];
        
        return {
          studentId: student.uid,
          studentName: student.displayName || "Unknown Student",
          studentEmail: student.email || "",
          totalQuizzes,
          completedQuizzes,
          averageScore,
          timeSpent,
          lastActivity,
          currentStreak,
          subjectProgress
        };
      });
      
      const progressResults = await Promise.all(progressPromises);
      setProgressData(progressResults);
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{students.length}</div>
            <div className="text-xs text-muted-foreground">Total Students</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {progressData.reduce((sum, student) => sum + student.completedQuizzes, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Quizzes Completed</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">
              {progressData.length > 0 
                ? Math.round(progressData.reduce((sum, student) => sum + student.averageScore, 0) / progressData.length)
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {Math.round(progressData.reduce((sum, student) => sum + student.timeSpent, 0) / 60)}m
            </div>
            <div className="text-xs text-muted-foreground">Time Spent</div>
          </CardContent>
        </Card>
      </div>

      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Student Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progressData.map((student) => (
              <div key={student.studentId} className="cosmic-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {student.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{student.studentEmail}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Level {student.currentStreak}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <BookOpen className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{student.completedQuizzes}</div>
                    <div className="text-xs text-muted-foreground">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <Target className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{Math.round(student.averageScore)}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{Math.round(student.timeSpent / 60)}m</div>
                    <div className="text-xs text-muted-foreground">Time Spent</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <div className="text-xl font-bold">{differenceInDays(new Date(), student.lastActivity)}</div>
                    <div className="text-xs text-muted-foreground">Days Ago</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Quiz Completion</span>
                    <span>{student.completedQuizzes}/{student.totalQuizzes}</span>
                  </div>
                  <Progress 
                    value={student.totalQuizzes > 0 ? (student.completedQuizzes / student.totalQuizzes) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}