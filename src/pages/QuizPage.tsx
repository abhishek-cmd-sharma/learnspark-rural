import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { QuizInterface } from "@/components/QuizInterface";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Clock,
  Target,
  ChevronLeft,
  Play,
  Star
} from "lucide-react";

export default function QuizPage() {
  const { subjectId, quizId } = useParams<{ subjectId: string; quizId: string }>();
  const { subjects, getQuiz } = useFirestore();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const subject = subjects.find(s => s.id === subjectId);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        if (quizId) {
          const quizData = await getQuiz(quizId);
          if (quizData) {
            setQuiz(quizData);
          } else {
            setError("Quiz not found");
          }
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

  if (!quiz) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Quiz Not Found</h1>
          <p className="text-muted-foreground mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to {subject?.name || "Subject"}
          </Button>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Subjects</span>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span>{subject?.name || "Subject"}</span>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground">Quiz: {quiz.title}</span>
          </div>
        </motion.div>
        
        {/* Quiz Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="cosmic-card">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-display mb-2">{quiz.title}</CardTitle>
                  <p className="text-muted-foreground">{quiz.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-xp-primary text-white"
                  >
                    {quiz.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{quiz.timeLimit ? `${quiz.timeLimit}s` : "No limit"}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="cosmic-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Questions</span>
                  </div>
                  <div className="text-2xl font-bold">{quiz.questions.length}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="cosmic-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Subject</span>
                  </div>
                  <div className="text-2xl font-bold">{subject?.name || "Unknown"}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="cosmic-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Points</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {quiz.questions.reduce((sum: number, q: any) => sum + q.points, 0)}
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <QuizInterface quizId={quizId} />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}