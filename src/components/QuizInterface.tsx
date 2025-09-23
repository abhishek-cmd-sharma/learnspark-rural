import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/Header";
import { useFirestore } from "@/contexts/FirestoreContext";
import { Question as FirestoreQuestion, Quiz as FirestoreQuiz } from "@/lib/types";
import {
  Clock,
  Users,
  Target,
  CheckCircle,
  XCircle,
  Zap,
  Timer,
  Trophy,
  Play,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { xpGainService } from "@/lib/firestoreService";
import { useParams } from "react-router-dom";

interface QuizInterfaceProps {
  quizId?: string;
  isLiveContest?: boolean;
  contestName?: string;
  participants?: number;
}

export function QuizInterface({
  quizId: propQuizId,
  isLiveContest = false,
  contestName,
  participants = 0
}: QuizInterfaceProps) {
  const { quizId: routeQuizId } = useParams<{ quizId: string }>();
  const quizId = propQuizId || routeQuizId;
  
  const { user, createUserQuizAttempt, checkAchievements, getQuiz } = useFirestore();
  const [quiz, setQuiz] = useState<FirestoreQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Array<{ questionId: string; selectedOption: number; isCorrect: boolean }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);

  // Load quiz data
  useEffect(() => {
    if (!quizId) {
      setError("No quiz ID provided");
      setLoading(false);
      return;
    }
    
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await getQuiz(quizId);
        if (quizData) {
          setQuiz(quizData);
          setTimeLeft(quizData.timeLimit || 30);
        } else {
          setError("Quiz not found");
        }
      } catch (err) {
        console.error("Error loading quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    
    loadQuiz();
  }, [quizId, getQuiz]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  // Timer effect
  useEffect(() => {
    if (!quizStarted || showResult || !quiz) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return quiz.timeLimit || 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, showResult, currentQuestionIndex, quiz]);

  // Track time taken for the quiz
  useEffect(() => {
    if (!quizStarted || showResult) return;
    
    const timer = setInterval(() => {
      setTimeTaken(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, showResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer !== null && currentQuestion) {
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      
      const newAnswered = [
        ...answeredQuestions,
        {
          questionId: currentQuestion.id,
          selectedOption: selectedAnswer,
          isCorrect
        }
      ];
      
      setAnsweredQuestions(newAnswered);
      
      if (isCorrect) {
        setScore(score + currentQuestion.points);
      }

      if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(quiz?.timeLimit || 30);
      } else {
        // Quiz completed - save attempt and check achievements
        await handleQuizCompletion();
        setShowResult(true);
      }
    }
  };

  const handleQuizCompletion = async () => {
    if (!user || !quiz) return;
    
    try {
      // Calculate statistics
      const correctAnswers = answeredQuestions.filter(a => a.isCorrect).length;
      const totalQuestions = quiz.questions.length;
      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      
      // Calculate XP earned
      const percentage = totalQuestions > 0 ? Math.round((score / totalPoints) * 100) : 0;
      const xpEarned = score * 10 + (percentage > 80 ? 50 : 0);
      
      // Create user quiz attempt record
      const attemptId = await createUserQuizAttempt({
        userId: user.uid,
        quizId: quiz.id,
        score: score,
        totalPoints: totalPoints,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        answers: answeredQuestions
      });
      
      setQuizAttemptId(attemptId);
      
      // Track XP gain
      await xpGainService.createXPGain({
        userId: user.uid,
        amount: xpEarned,
        source: "quiz",
        sourceId: quiz.id
      });
      
      // Check for achievements
      await checkAchievements();
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-display font-bold text-destructive mb-4">Error Loading Quiz</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Show start screen
  if (!quizStarted && quiz) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="cosmic-card text-center">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl">
                  <Target />
                </div>
                <CardTitle className="text-3xl font-display">
                  {isLiveContest ? contestName : `${quiz.title}`}
                </CardTitle>
                {isLiveContest && (
                  <Badge variant="destructive" className="mx-auto animate-pulse">
                    <Users className="w-4 h-4 mr-1" />
                    {participants} participants joined
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="cosmic-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Questions</span>
                    </div>
                    <div className="text-2xl font-bold">{quiz.questions.length}</div>
                  </div>
                  <div className="cosmic-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Time Limit</span>
                    </div>
                    <div className="text-2xl font-bold">{quiz.timeLimit ? `${quiz.timeLimit}s` : "No limit"}</div>
                  </div>
                  <div className="cosmic-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Difficulty</span>
                    </div>
                    <div className="text-2xl font-bold capitalize">{quiz.difficulty}</div>
                  </div>
                </div>

                <p className="text-muted-foreground">{quiz.description}</p>

                <Button variant="cosmic" size="lg" onClick={startQuiz} className="w-full">
                  <Play className="mr-2 h-5 w-5" />
                  {isLiveContest ? "Join Contest" : "Start Quiz"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show results screen
  if (showResult && quiz) {
    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / quiz.questions.reduce((sum, q) => sum + q.points, 0)) * 100) : 0;
    const xpEarned = score * 10 + (percentage > 80 ? 50 : 0);
    
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="cosmic-card text-center">
              <CardHeader>
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-3xl ${
                  percentage >= 80 ? "bg-gradient-to-br from-success to-green-600" :
                  percentage >= 60 ? "bg-gradient-to-br from-xp-primary to-xp-secondary" :
                  "bg-gradient-to-br from-muted to-gray-500"
                }`}>
                  {percentage >= 80 ? <Trophy /> : percentage >= 60 ? <Star /> : <Target />}
                </div>
                <CardTitle className="text-3xl font-display">
                  {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Trying!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="cosmic-card p-4">
                    <div className="text-3xl font-bold text-primary">{score}/{quiz.questions.reduce((sum, q) => sum + q.points, 0)}</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                  <div className="cosmic-card p-4">
                    <div className="text-3xl font-bold text-success">+{xpEarned}</div>
                    <div className="text-sm text-muted-foreground">XP Earned</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>

                {percentage >= 80 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-gradient-to-r from-success/20 to-green-500/20 border border-success/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <Trophy className="h-5 w-5" />
                      Perfect Performance Bonus!
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      You earned an extra 50 XP for scoring above 80%!
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Review Answers
                  </Button>
                  <Button variant="cosmic" className="flex-1">
                    <Zap className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show quiz questions
  if (quiz && currentQuestion) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          {/* Quiz Header */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-display font-bold">
                {isLiveContest ? contestName : `${quiz.title}`}
              </h1>
              {isLiveContest && (
                <Badge variant="destructive" className="animate-pulse">
                  <Users className="w-4 h-4 mr-1" />
                  {participants} live
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex items-center gap-2 cosmic-card px-4 py-2">
                <Timer className="h-4 w-4 text-primary" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 cosmic-card"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          selectedAnswer === index
                            ? "border-primary bg-primary text-white"
                            : "border-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="cosmic"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="px-8"
                  >
                    {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Fallback for when quiz is not loaded
  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Quiz Not Available</h2>
        <p className="text-muted-foreground">The quiz you're looking for is not available.</p>
      </div>
    </div>
  );
}