import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { UserQuizAttempt, Quiz, UserAnswer } from "@/lib/types";
import { format } from "date-fns";

interface StudentQuizProgressViewerProps {
  studentId: string;
  subjectId?: string;
}

export function StudentQuizProgressViewer({ studentId, subjectId }: StudentQuizProgressViewerProps) {
  const { getUserQuizAttempts, getQuiz } = useFirestore();
  const [quizAttempts, setQuizAttempts] = useState<UserQuizAttempt[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>({});
  const [loading, setLoading] = useState(true);
  const [expandedAttempt, setExpandedAttempt] = useState<string | null>(null);

  useEffect(() => {
    loadQuizAttempts();
  }, [studentId, subjectId]);

  const loadQuizAttempts = async () => {
    try {
      setLoading(true);
      const attempts = await getUserQuizAttempts(studentId);
      
      // Filter by subject if provided
      const filteredAttempts = subjectId 
        ? attempts.filter(attempt => attempt.quizId === subjectId)
        : attempts;
      
      setQuizAttempts(filteredAttempts);
      
      // Load quiz details for each attempt
      const quizMap: Record<string, Quiz> = {};
      for (const attempt of filteredAttempts) {
        if (!quizMap[attempt.quizId]) {
          const quiz = await getQuiz(attempt.quizId);
          if (quiz) {
            quizMap[attempt.quizId] = quiz;
          }
        }
      }
      setQuizzes(quizMap);
    } catch (error) {
      console.error("Error loading quiz attempts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttemptExpansion = (attemptId: string) => {
    setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (quizAttempts.length === 0) {
    return (
      <Card className="cosmic-card">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Quiz Attempts</h3>
          <p className="text-muted-foreground">
            This student hasn't attempted any quizzes yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{quizAttempts.length}</div>
            <div className="text-xs text-muted-foreground">Total Attempts</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">
              {quizAttempts.filter(a => a.score > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">
              {quizAttempts.length > 0 
                ? Math.round(quizAttempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / quizAttempts.length)
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        
        <Card className="cosmic-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              {Math.round(quizAttempts.reduce((sum, a) => sum + a.timeTaken, 0) / 60)}m
            </div>
            <div className="text-xs text-muted-foreground">Time Spent</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {quizAttempts.map((attempt) => {
          const quiz = quizzes[attempt.quizId];
          const isExpanded = expandedAttempt === attempt.id;
          const percentage = attempt.totalPoints > 0 ? (attempt.score / attempt.totalPoints) * 100 : 0;
          
          return (
            <Card key={attempt.id} className="cosmic-card">
              <CardHeader 
                className="cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => toggleAttemptExpansion(attempt.id)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {quiz?.title || "Unknown Quiz"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Attempted on {format(new Date(attempt.startedAt), "MMM d, yyyy h:mm a")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={
                        percentage >= 80 ? "default" : 
                        percentage >= 60 ? "secondary" : 
                        "destructive"
                      }
                    >
                      {Math.round(percentage)}%
                    </Badge>
                    <div className="text-right">
                      <div className="font-semibold">
                        {attempt.score}/{attempt.totalPoints}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(attempt.timeTaken / 60)} min
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="cosmic-card p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Questions</span>
                          <span className="font-semibold">
                            {attempt.correctAnswers}/{attempt.totalQuestions}
                          </span>
                        </div>
                        <Progress 
                          value={(attempt.correctAnswers / attempt.totalQuestions) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="cosmic-card p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Time Taken</span>
                          <span className="font-semibold">
                            {Math.round(attempt.timeTaken / 60)} minutes
                          </span>
                        </div>
                        <Progress 
                          value={Math.min(100, (attempt.timeTaken / (quiz?.timeLimit || 1800)) * 100)} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div className="cosmic-card p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Score</span>
                          <span className="font-semibold">
                            {attempt.score}/{attempt.totalPoints}
                          </span>
                        </div>
                        <Progress 
                          value={(attempt.score / attempt.totalPoints) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Question Breakdown
                      </h4>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {attempt.answers.map((answer, index) => {
                          const question = quiz?.questions.find(q => q.id === answer.questionId);
                          
                          return (
                            <div 
                              key={`${attempt.id}-${answer.questionId}`} 
                              className="cosmic-card p-4"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="font-medium mb-2">
                                    {index + 1}. {question?.text || "Unknown Question"}
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                    {question?.options.map((option, optionIndex) => (
                                      <div 
                                        key={optionIndex}
                                        className={`p-2 rounded text-sm ${
                                          optionIndex === answer.selectedOption 
                                            ? answer.isCorrect 
                                              ? "bg-green-100 border border-green-300" 
                                              : "bg-red-100 border border-red-300"
                                            : optionIndex === question.correctAnswer
                                              ? "bg-green-50 border border-green-200"
                                              : "bg-muted"
                                        }`}
                                      >
                                        <span className="font-medium mr-2">
                                          {String.fromCharCode(65 + optionIndex)}.
                                        </span>
                                        {option}
                                        {optionIndex === answer.selectedOption && (
                                          <span className="ml-2">
                                            {answer.isCorrect ? (
                                              <CheckCircle className="inline h-4 w-4 text-green-600" />
                                            ) : (
                                              <XCircle className="inline h-4 w-4 text-red-600" />
                                            )}
                                          </span>
                                        )}
                                        {optionIndex === question.correctAnswer && optionIndex !== answer.selectedOption && (
                                          <span className="ml-2">
                                            <Award className="inline h-4 w-4 text-green-600" />
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {question?.explanation && (
                                    <div className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                                      <span className="font-semibold">Explanation:</span> {question.explanation}
                                    </div>
                                  )}
                                </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  {answer.isCorrect ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span>
                                    {answer.isCorrect ? "Correct" : "Incorrect"}
                                  </span>
                                </div>
                                
                                <div>
                                  Points: {answer.isCorrect ? question?.points || 1 : 0}/{question?.points || 1}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
          );
        })}
      </div>
    </div>
  );
}