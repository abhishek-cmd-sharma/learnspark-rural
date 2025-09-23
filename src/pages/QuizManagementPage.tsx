import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFirestore } from "@/contexts/FirestoreContext";
import { QuizManagement } from "@/components/QuizManagement";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Subject } from "@/lib/types";
import { Link } from "react-router-dom";

export default function QuizManagementPage() {
  const { subjectId } = useParams();
  const { subjects, getSubject } = useFirestore();
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubject = async () => {
      try {
        setLoading(true);
        if (subjectId) {
          const subject = await getSubject(subjectId);
          setCurrentSubject(subject);
        }
      } catch (error) {
        console.error("Error loading subject:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubject();
  }, [subjectId, getSubject]);

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSubject) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Subject Not Found</h1>
          <Link to="/dashboard">
            <Button variant="cosmic">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to={`/subjects/${currentSubject.id}`}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {currentSubject.name}
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">{currentSubject.name} - Quiz Management</h1>
              <p className="text-muted-foreground">Create, edit, and manage quizzes for this subject</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="cosmic-card">
            <CardContent className="p-6">
              {subjectId && <QuizManagement subjectId={subjectId} />}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}