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
  Award
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { UserQuizAttempt, Quiz, Subject, User } from "@/lib/types";
import { format, subDays, subMonths } from "date-fns";

interface ClassPerformance {
  totalStudents: number;
  activeStudents: number;
  averageCompletionRate: number;
  averageScore: number;
  totalQuizzes: number;
  totalAttempts: number;
}

interface SubjectPerformance {
  subject: Subject;
  quizzes: number;
  completionRate: number;
  averageScore: number;
  timeSpent: number;
}

interface TimeSeriesData {
  date: string;
  attempts: number;
  averageScore: number;
}

export function TeacherAnalyticsDashboard() {
  const { subjects, userQuizAttempts, getStudentsByTeacherWithUserData } = useFirestore();
  const [classPerformance, setClassPerformance] = useState<ClassPerformance>({
    totalStudents: 0,
    activeStudents: 0,
    averageCompletionRate: 0,
    averageScore: 0,
    totalQuizzes: 0,
    totalAttempts: 0
  });
  
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("week");

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Get students for this teacher
      // In a real implementation, we would get the current teacher's ID
      // For now, we'll use a placeholder
      const students: User[] = [];
      
      // Calculate class performance metrics
      const totalStudents = students.length;
      const activeStudents = students.filter(s => {
        // Check if student was active in the selected time range
        const cutoffDate = timeRange === "week" 
          ? subDays(new Date(), 7) 
          : timeRange === "month" 
            ? subMonths(new Date(), 1) 
            : subMonths(new Date(), 3);
        return s.lastLoginAt >= cutoffDate;
      }).length;
      
      // Filter attempts by time range
      const cutoffDate = timeRange === "week" 
        ? subDays(new Date(), 7) 
        : timeRange === "month" 
          ? subMonths(new Date(), 1) 
          : subMonths(new Date(), 3);
          
      const recentAttempts = userQuizAttempts.filter(attempt => 
        attempt.completedAt && attempt.completedAt >= cutoffDate
      );
      
      const totalAttempts = recentAttempts.length;
      const completedAttempts = recentAttempts.filter(a => a.completedAt);
      
      const averageCompletionRate = totalStudents > 0 
        ? (completedAttempts.length / (totalStudents * Math.max(1, subjects.length))) * 100 
        : 0;
        
      const averageScore = completedAttempts.length > 0
        ? completedAttempts.reduce((sum, attempt) => 
            sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / completedAttempts.length
        : 0;
      
      setClassPerformance({
        totalStudents,
        activeStudents,
        averageCompletionRate,
        averageScore,
        totalQuizzes: subjects.reduce((sum, subject) => sum + subject.totalLessons, 0),
        totalAttempts
      });
      
      // Calculate subject performance
      const subjectPerf = subjects.map(subject => {
        const subjectAttempts = recentAttempts.filter(attempt => {
          // In a real implementation, we would link attempts to subjects
          // For now, we'll use a placeholder
          return true;
        });
        
        const completionRate = subjectAttempts.length > 0 
          ? (subjectAttempts.filter(a => a.completedAt).length / subjectAttempts.length) * 100 
          : 0;
          
        const averageScore = subjectAttempts.length > 0
          ? subjectAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / subjectAttempts.length
          : 0;
          
        const timeSpent = subjectAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0);
        
        return {
          subject,
          quizzes: subject.totalLessons,
          completionRate,
          averageScore,
          timeSpent
        };
      });
      
      setSubjectPerformance(subjectPerf);
      
      // Generate time series data
      const seriesData: TimeSeriesData[] = [];
      const days = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateString = format(date, "MMM dd");
        
        const dayAttempts = recentAttempts.filter(attempt => {
          if (!attempt.completedAt) return false;
          const attemptDate = new Date(attempt.completedAt);
          return format(attemptDate, "MMM dd") === dateString;
        });
        
        const averageScore = dayAttempts.length > 0
          ? dayAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / dayAttempts.length
          : 0;
        
        seriesData.push({
          date: dateString,
          attempts: dayAttempts.length,
          averageScore
        });
      }
      
      setTimeSeriesData(seriesData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Classroom Analytics</h2>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "week" 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "month" 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "quarter" 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("quarter")}
          >
            Quarter
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{classPerformance.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">{classPerformance.activeStudents}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <Progress 
              value={classPerformance.totalStudents > 0 
                ? (classPerformance.activeStudents / classPerformance.totalStudents) * 100 
                : 0} 
              className="mt-2 h-2" 
            />
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold">{Math.round(classPerformance.averageCompletionRate)}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold">{Math.round(classPerformance.averageScore)}%</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Subject Performance */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectPerformance.map((perf) => (
              <div key={perf.subject.id} className="cosmic-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{perf.subject.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{perf.subject.name}</h3>
                      <p className="text-sm text-muted-foreground">{perf.quizzes} quizzes</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Level {perf.subject.level}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{Math.round(perf.completionRate)}%</span>
                    </div>
                    <Progress value={perf.completionRate} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-semibold">{Math.round(perf.averageScore)}%</span>
                    </div>
                    <Progress value={perf.averageScore} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Time Spent</span>
                      <span className="font-semibold">{Math.round(perf.timeSpent / 60)}m</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (perf.timeSpent / (perf.quizzes * 300)) * 100)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Time Series Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Quiz Attempts Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors"
                    style={{ height: `${Math.min(10, (data.attempts / Math.max(1, Math.max(...timeSeriesData.map(d => d.attempts)))) * 100)}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1 truncate">
                    {data.date}
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
              Average Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {timeSeriesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-success rounded-t hover:bg-success/80 transition-colors"
                    style={{ height: `${data.averageScore}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-1 truncate">
                    {data.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}