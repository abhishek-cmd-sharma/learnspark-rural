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
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { UserQuizAttempt, Quiz } from "@/lib/types";
import { format } from "date-fns";

interface QuizAnalyticsProps {
  subjectId: string;
}

interface QuizStats {
  quiz: Quiz;
  totalAttempts: number;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  highestScore: number;
  lowestScore: number;
  recentAttempts: UserQuizAttempt[];
}

export function QuizAnalytics({ subjectId }: QuizAnalyticsProps) {
  const { getQuizzesBySubject, userQuizAttempts } = useFirestore();
  const [quizStats, setQuizStats] = useState<QuizStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all");

 useEffect(() => {
    loadQuizAnalytics();
  }, [subjectId, timeRange]);

  const loadQuizAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get all quizzes for this subject
      const quizzes = await getQuizzesBySubject(subjectId);
      
      // Calculate stats for each quiz
      const statsPromises = quizzes.map(async (quiz) => {
        // Filter attempts by quiz ID
        let quizAttempts = userQuizAttempts.filter(attempt => attempt.quizId === quiz.id);
        
        // Filter by time range
        const now = new Date();
        if (timeRange === "week") {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          quizAttempts = quizAttempts.filter(attempt => 
            attempt.completedAt && attempt.completedAt >= oneWeekAgo
          );
        } else if (timeRange === "month") {
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 1000);
          quizAttempts = quizAttempts.filter(attempt => 
            attempt.completedAt && attempt.completedAt >= oneMonthAgo
          );
        }
        
        // Calculate statistics
        const totalAttempts = quizAttempts.length;
        const completedAttempts = quizAttempts.filter(a => a.completedAt);
        const completionRate = totalAttempts > 0 
          ? (completedAttempts.length / totalAttempts) * 100 
          : 0;
        
        const averageScore = completedAttempts.length > 0
          ? completedAttempts.reduce((sum, attempt) => 
              sum + (attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0), 0) / completedAttempts.length
          : 0;
          
        const averageTime = completedAttempts.length > 0
          ? completedAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0) / completedAttempts.length
          : 0;
          
        const scores = completedAttempts.map(attempt => 
          attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0
        );
        
        const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
        const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
        
        // Get recent attempts (last 5)
        const recentAttempts = [...completedAttempts]
          .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
          .slice(0, 5);
        
        return {
          quiz,
          totalAttempts,
          completionRate,
          averageScore,
          averageTime,
          highestScore,
          lowestScore,
          recentAttempts
        };
      });
      
      const statsResults = await Promise.all(statsPromises);
      setQuizStats(statsResults);
    } catch (error) {
      console.error("Error loading quiz analytics:", error);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Quiz Analytics</h2>
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
              timeRange === "all" 
                ? "bg-primary text-white" 
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setTimeRange("all")}
          >
            All Time
          </button>
        </div>
      </div>
      
      {quizStats.length === 0 ? (
        <Card className="cosmic-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Quiz Data</h3>
            <p className="text-muted-foreground">
              No quizzes found for this subject or no attempts have been made yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizStats.map((stats) => (
            <Card key={stats.quiz.id} className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{stats.quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">{stats.quiz.description}</p>
                  </div>
                  <Badge variant="secondary">{stats.quiz.questions.length} questions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="cosmic-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Completion</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(stats.completionRate)}%</div>
                    <div className="text-xs text-muted-foreground">{stats.totalAttempts} attempts</div>
                  </div>
                  
                  <div className="cosmic-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Avg Score</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(stats.averageScore)}%</div>
                    <div className="text-xs text-muted-foreground">Range: {Math.round(stats.lowestScore)}-{Math.round(stats.highestScore)}%</div>
                  </div>
                  
                  <div className="cosmic-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Avg Time</span>
                    </div>
                    <div className="text-2xl font-bold">{Math.round(stats.averageTime / 60)}m</div>
                    <div className="text-xs text-muted-foreground">{Math.round(stats.averageTime % 60)}s</div>
                  </div>
                  
                  <div className="cosmic-card p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Difficulty</span>
                    </div>
                    <div className="text-2xl font-bold capitalize">{stats.quiz.difficulty}</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.quiz.timeLimit ? `${stats.quiz.timeLimit}s limit` : "No time limit"}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Recent Attempts
                  </h4>
                  
                  {stats.recentAttempts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent attempts</p>
                  ) : (
                    <div className="space-y-2">
                      {stats.recentAttempts.map((attempt) => (
                        <div key={attempt.id} className="flex items-center justify-between p-2 cosmic-card">
                          <div>
                            <div className="text-sm font-medium">
                              {format(new Date(attempt.completedAt!), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {Math.round(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {Math.round((attempt.score / attempt.totalPoints) * 100)}%
                            </span>
                            <Badge 
                              variant={
                                (attempt.score / attempt.totalPoints) >= 0.8 
                                  ? "default" 
                                  : (attempt.score / attempt.totalPoints) >= 0.6 
                                    ? "secondary" 
                                    : "destructive"
                              }
                            >
                              {attempt.score}/{attempt.totalPoints}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}