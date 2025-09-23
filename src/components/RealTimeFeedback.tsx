import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Zap, 
  Star, 
  Trophy,
  Flame,
  Target
} from "lucide-react";

interface FeedbackMessage {
  id: string;
  type: "correct" | "incorrect" | "encouragement" | "streak" | "speed";
  message: string;
  points?: number;
  timestamp: number;
}

interface RealTimeFeedbackProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isCorrect?: boolean;
  timeTaken?: number;
  streakCount?: number;
  showEncouragement?: boolean;
}

export function RealTimeFeedback({
  currentQuestionIndex,
  totalQuestions,
  isCorrect,
  timeTaken,
  streakCount = 0,
  showEncouragement = false
}: RealTimeFeedbackProps) {
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<FeedbackMessage[]>([]);

  // Add feedback messages based on props
  useEffect(() => {
    const newMessages: FeedbackMessage[] = [];
    
    // Add correctness feedback
    if (isCorrect !== undefined) {
      if (isCorrect) {
        newMessages.push({
          id: `correct-${Date.now()}`,
          type: "correct",
          message: "Correct! Well done!",
          points: 10,
          timestamp: Date.now()
        });
      } else {
        newMessages.push({
          id: `incorrect-${Date.now()}`,
          type: "incorrect",
          message: "Not quite right. Keep trying!",
          timestamp: Date.now()
        });
      }
    }
    
    // Add streak feedback
    if (streakCount > 0 && streakCount % 5 === 0) {
      newMessages.push({
        id: `streak-${Date.now()}`,
        type: "streak",
        message: `Amazing! ${streakCount} in a row!`,
        points: streakCount * 2,
        timestamp: Date.now()
      });
    }
    
    // Add speed feedback
    if (timeTaken !== undefined && timeTaken < 10) {
      newMessages.push({
        id: `speed-${Date.now()}`,
        type: "speed",
        message: "Lightning fast! Great speed!",
        points: 5,
        timestamp: Date.now()
      });
    }
    
    // Add encouragement feedback
    if (showEncouragement) {
      const encouragements = [
        "You're doing great!",
        "Keep up the good work!",
        "Fantastic progress!",
        "You're on fire!",
        "Excellent effort!"
      ];
      
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      
      newMessages.push({
        id: `encourage-${Date.now()}`,
        type: "encouragement",
        message: randomEncouragement,
        timestamp: Date.now()
      });
    }
    
    if (newMessages.length > 0) {
      setFeedbackMessages(prev => [...newMessages, ...prev]);
    }
  }, [currentQuestionIndex, isCorrect, timeTaken, streakCount, showEncouragement]);

  // Manage visible messages (show only the latest 3)
  useEffect(() => {
    const latestMessages = feedbackMessages.slice(0, 3);
    setVisibleMessages(latestMessages);
    
    // Remove messages after 3 seconds
    const timer = setTimeout(() => {
      if (feedbackMessages.length > 0) {
        setFeedbackMessages(prev => prev.slice(0, -1));
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [feedbackMessages]);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "correct":
        return <ThumbsUp className="h-5 w-5 text-green-500" />;
      case "incorrect":
        return <ThumbsDown className="h-5 w-5 text-red-500" />;
      case "streak":
        return <Flame className="h-5 w-5 text-orange-500" />;
      case "speed":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "encouragement":
        return <Star className="h-5 w-5 text-purple-500" />;
      default:
        return <Target className="h-5 w-5 text-blue-500" />;
    }
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "correct":
        return "border-green-500 bg-green-50";
      case "incorrect":
        return "border-red-500 bg-red-50";
      case "streak":
        return "border-orange-500 bg-orange-50";
      case "speed":
        return "border-yellow-500 bg-yellow-50";
      case "encouragement":
        return "border-purple-500 bg-purple-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <AnimatePresence>
        {visibleMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-2 ${getFeedbackColor(message.type)}`}>
              <CardContent className="p-3 flex items-center gap-2">
                {getFeedbackIcon(message.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.message}</p>
                  {message.points && (
                    <p className="text-xs text-muted-foreground">+{message.points} points</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Progress indicator */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}