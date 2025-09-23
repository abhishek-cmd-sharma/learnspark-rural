import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Timer, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Award
} from "lucide-react";
import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ContestInterfaceProps {
  questions: Question[];
  contestId: string;
  userId: string;
  onContestComplete: (score: number, timeTaken: number) => void;
  onExit: () => void;
}

export function ContestInterface({ 
  questions, 
 contestId, 
  userId, 
  onContestComplete, 
 onExit 
}: ContestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (isPaused || showResult) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, showResult]);

  // Format time for display
 const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    // Auto move to next question after a delay
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: selectedOption
      }));
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleContestComplete();
    }
  };

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] ?? null);
      setIsAnswered(answers[currentQuestionIndex - 1] !== undefined);
    }
  };

  // Handle contest completion
  const handleContestComplete = useCallback(() => {
    setShowResult(true);
    setTimeTaken(15 * 60 - timeRemaining);
    
    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
      }
    });
    
    // Call completion callback
    onContestComplete(score, timeTaken);
  }, [answers, questions, timeRemaining, onContestComplete, timeTaken]);

  // Check if option is correct (for display purposes)
  const isOptionCorrect = (optionIndex: number) => {
    return isAnswered && optionIndex === currentQuestion.correctAnswer;
  };

  // Check if option is user's selection
  const isOptionSelected = (optionIndex: number) => {
    return selectedOption === optionIndex;
  };

  // Get option styling
  const getOptionStyle = (optionIndex: number) => {
    if (!isAnswered) {
      return isOptionSelected(optionIndex) 
        ? "border-primary bg-primary/10" 
        : "hover:bg-muted";
    }
    
    if (isOptionCorrect(optionIndex)) {
      return "border-success bg-success/10";
    }
    
    if (isOptionSelected(optionIndex) && !isOptionCorrect(optionIndex)) {
      return "border-destructive bg-destructive/10";
    }
    
    return "opacity-50";
  };

  if (showResult) {
    // Calculate statistics
    let score = 0;
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
        correctAnswers++;
      }
    });
    
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <Card className="w-full max-w-2xl mx-auto text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
          </motion.div>
          <CardTitle className="text-3xl mb-4">Contest Complete!</CardTitle>
          <p className="text-muted-foreground mb-6 text-lg">
            Thank you for participating in the contest.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Points</div>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeTaken)}</div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onExit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              View Detailed Results
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Contest
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      {/* Contest Header */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg py-2 px-3">
                <Timer className="h-5 w-5 mr-2" />
                {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline" className="text-lg py-2 px-3">
                {currentQuestionIndex + 1} / {questions.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExit}
              >
                Exit
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <span className="text-primary">Q{currentQuestionIndex + 1}:</span>
                <span>{currentQuestion.text}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                      getOptionStyle(index)
                    )}
                    onClick={() => handleSelectOption(index)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      <AnimatePresence>
                        {isAnswered && isOptionCorrect(index) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="ml-auto"
                          >
                            <CheckCircle className="h-6 w-6 text-success" />
                          </motion.div>
                        )}
                        {isAnswered && isOptionSelected(index) && !isOptionCorrect(index) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="ml-auto"
                          >
                            <XCircle className="h-6 w-6 text-destructive" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNextQuestion}
          disabled={!isAnswered && selectedOption === null}
        >
          {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </motion.div>
  );
}