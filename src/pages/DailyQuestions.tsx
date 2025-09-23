import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, Question } from "@/lib/types";
import { 
  Clock, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Archive,
  Target
} from "lucide-react";

export default function DailyQuestions() {
  const { subjects, getQuizzesBySubject, userQuizAttempts, userData } = useFirestore();
  const { user } = useAuth();
  
  // Current question state
  const [currentSubject, setCurrentSubject] = useState("mathematics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load quizzes for current subject
  useEffect(() => {
    loadQuizzes();
  }, [currentSubject]);
  
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const subjectQuizzes = await getQuizzesBySubject(currentSubject);
      setQuizzes(subjectQuizzes || []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get all questions from all quizzes for the current subject
  const allQuestions = quizzes.flatMap(quiz => 
    quiz.questions.map(question => ({
      ...question,
      quizId: quiz.id,
      quizTitle: quiz.title,
      difficulty: quiz.difficulty || "Medium"
    }))
  );
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      // Auto-submit when time runs out
      handleSubmit();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  // Handle hint usage
  const handleUseHint = () => {
    setUsedHint(true);
  };
  
  // Handle submission
  const handleSubmit = () => {
    setShowExplanation(true);
    setIsTimerActive(false);
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setUsedHint(false);
      setTimeLeft(300); // Reset timer for next question
    }
  };
  
  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setUsedHint(false);
      setTimeLeft(300); // Reset timer for previous question
    }
  };
  
  // Start timer when question loads
  useEffect(() => {
    setIsTimerActive(true);
  }, [currentQuestionIndex]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Daily Questions Page */}
      <div id="daily-questions" className="page active">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">📝 Daily Questions</h2>
            <p className="text-gray-600">Complete today's challenges to earn XP and maintain your streak!</p>
          </div>
          
          {/* Subject Selection */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => {
                  setCurrentSubject("math");
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setUsedHint(false);
                  setTimeLeft(300);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentSubject === "math"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                🔢 Math
              </button>
              <button
                onClick={() => {
                  setCurrentSubject("english");
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setUsedHint(false);
                  setTimeLeft(300);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentSubject === "english"
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                📖 English
              </button>
              <button
                onClick={() => {
                  setCurrentSubject("gk");
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                  setUsedHint(false);
                  setTimeLeft(300);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentSubject === "gk"
                    ? "bg-pink-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                🌍 G.K.
              </button>
            </div>
          </div>
          
          {/* Question Interface */}
          <div className="max-w-3xl mx-auto">
            <Card className="mb-6">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Daily {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} Challenge
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Question {currentQuestionIndex + 1} of {allQuestions.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {currentQuestion?.difficulty || "Medium"}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {currentQuestion ? (
                  <>
                    <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
                    
                    {/* Answer Options */}
                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-lg border transition-colors ${
                            selectedAnswer === option
                              ? showExplanation
                                ? option === currentQuestion.correctAnswer
                                  ? "border-green-500 bg-green-50"
                                  : "border-red-500 bg-red-50"
                                : "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          } ${
                            showExplanation && option === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-50 font-semibold"
                              : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                              selectedAnswer === option
                                ? showExplanation
                                  ? option === currentQuestion.correctAnswer
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-red-500 bg-red-500 text-white"
                                  : "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-300"
                            }`}>
                              {selectedAnswer === option && (
                                showExplanation ? (
                                  option === currentQuestion.correctAnswer ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-current"></div>
                                )
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Hint and Submit Section */}
                    {!showExplanation ? (
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleUseHint}
                          disabled={usedHint}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Lightbulb className="h-4 w-4" />
                          {usedHint ? "Hint Used" : "Use Hint"}
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={!selectedAnswer}
                          className="ml-auto"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Explanation */}
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-500" />
                            Explanation
                          </h4>
                          <p className="text-gray-700">{currentQuestion.explanation}</p>
                        </div>
                        
                        {/* Hint (if used) */}
                        {usedHint && (
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              Hint
                            </h4>
                            <p className="text-gray-700">{currentQuestion.hint}</p>
                          </div>
                        )}
                        
                        {/* Navigation */}
                        <div className="flex justify-between">
                          <Button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === allQuestions.length - 1}
                            className="flex items-center gap-2"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No questions available for this subject.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Performance Tracking */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Performance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">240</div>
                    <div className="text-sm text-gray-600">Total XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Archive Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Previous Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium">Algebra Basics #{item}</h4>
                        <p className="text-sm text-gray-600">Completed • 4/5 correct</p>
                      </div>
                      <Badge variant="secondary">View</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}