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
  PieChart,
  Users,
  Award,
  Zap,
  Star,
  Flame
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { UserQuizAttempt, Quiz, Subject } from "@/lib/types";
import { format, subDays } from "date-fns";

interface SubjectProgress {
  subject: Subject;
  completedQuizzes: number;
  totalQuizzes: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
}

interface WeeklyProgress {
  date: string;
  quizzesCompleted: number;
  averageScore: number;
}

export function StudentProgressVisualization() {
  const { subjects, userQuizAttempts } = useFirestore();
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [studyStreak, setStudyStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would get these from user data
      // For now, we'll use placeholders
      setStudyStreak(5);
      setTotalXP(1250);
      
      // Calculate subject progress
      const subjectPerf = subjects.map(subject => {
        // Filter attempts by subject
        // In a real implementation, we would link attempts to subjects
        // For now, we'll use all attempts as a placeholder
        const subjectAttempts = userQuizAttempts.filter(attempt => {
          return true;
        });
        
        const completedAttempts = subjectAttempts.filter(a => a.completedAt);
        const completedQuizzes = completedAttempts.length;
        const totalQuizzes = subject.totalLessons;
        
        const averageScore = completedAttempts.length > 0
          ? completedAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / completedAttempts.length
          : 0;
          
        const timeSpent = subjectAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
        
        const lastActivity = completedAttempts.length > 0 
          ? new Date(Math.max(...completedAttempts.map(a => a.completedAt?.getTime() || 0)))
          : new Date();
        
        return {
          subject,
          completedQuizzes,
          totalQuizzes,
          averageScore,
          timeSpent,
          lastActivity
        };
      });
      
      setSubjectProgress(subjectPerf);
      
      // Generate weekly progress data
      const weeklyData: WeeklyProgress[] = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateString = format(date, "EEE");
        
        // Filter attempts for this day
        const dayAttempts = userQuizAttempts.filter(attempt => {
          if (!attempt.completedAt) return false;
          const attemptDate = new Date(attempt.completedAt);
          return format(attemptDate, "EEE") === dateString && 
                 attempt.completedAt >= subDays(new Date(), 7);
        });
        
        const quizzesCompleted = dayAttempts.filter(a => a.completedAt).length;
        
        const averageScore = dayAttempts.length > 0
          ? dayAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / dayAttempts.length
          : 0;
        
        weeklyData.push({
          date: dateString,
          quizzesCompleted,
          averageScore
        });
      }
      
      setWeeklyProgress(weeklyData);
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-2xl font-bold">{studyStreak} days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{totalXP}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                <p className="text-2xl font-bold">
                  {subjectProgress.reduce((sum, subj) => sum + subj.completedQuizzes, 0)}
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Subject Progress */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Subject Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectProgress.map((progress) => (
              <div key={progress.subject.id} className="cosmic-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{progress.subject.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{progress.subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Level {progress.subject.level} • {progress.subject.completedLessons}/{progress.subject.totalLessons} lessons
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {Math.round((progress.subject.completedLessons / progress.subject.totalLessons) * 100)}% Complete
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Quizzes</span>
                      <span className="font-semibold">{progress.completedQuizzes}/{progress.totalQuizzes}</span>
                    </div>
                    <Progress 
                      value={progress.totalQuizzes > 0 
                        ? (progress.completedQuizzes / progress.totalQuizzes) * 100 
                        : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Avg Score</span>
                      <span className="font-semibold">{Math.round(progress.averageScore)}%</span>
                    </div>
                    <Progress value={progress.averageScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Time Spent</span>
                      <span className="font-semibold">{Math.round(progress.timeSpent / 60)}m</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (progress.timeSpent / (progress.totalQuizzes * 300)) * 10)} 
                      className="h-2" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Last activity: {format(new Date(progress.lastActivity), "MMM d, yyyy")}
                  </span>
                  <Badge variant="outline">
                    {progress.subject.progress}% mastered
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {weeklyProgress.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors"
                    style={{ height: `${Math.min(10, (data.quizzesCompleted / Math.max(1, Math.max(...weeklyProgress.map(d => d.quizzesCompleted)))) * 100)}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {data.date}
                  </span>
                  <span className="text-xs font-semibold">
                    {data.quizzesCompleted}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {weeklyProgress.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-success rounded-t hover:bg-success/80 transition-colors"
                    style={{ height: `${data.averageScore}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {data.date}
                  </span>
                  <span className="text-xs font-semibold">
                    {Math.round(data.averageScore)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Achievements */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="cosmic-card p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold">Quiz Master</h3>
              <p className="text-sm text-muted-foreground">Scored 100% on 5 quizzes</p>
            </div>
            
            <div className="cosmic-card p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Flame className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Streak Builder</h3>
              <p className="text-sm text-muted-foreground">7-day study streak</p>
            </div>
            
            <div className="cosmic-card p-4 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold">Subject Expert</h3>
              <p className="text-sm text-muted-foreground">Completed all Math quizzes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}