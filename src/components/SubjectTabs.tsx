import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, Subject } from "@/lib/types";
import { 
  Calculator, 
  Globe, 
  SpellCheck, 
  Play, 
  Target, 
  Clock, 
  Star,
  Trophy,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

interface SubjectWithQuizzes extends Subject {
  icon: React.ReactNode;
  color: string;
  quizzes: Quiz[];
}

const SubjectTabs = () => {
  const { subjects: firestoreSubjects, getQuizzesBySubject, getGlobalLeaderboard } = useFirestore();
  const { userData } = useAuth();
  
  const [activeSubject, setActiveSubject] = useState("mathematics");
  const [subjectQuizzes, setSubjectQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  // Load quizzes when active subject changes
  useEffect(() => {
    loadQuizzes();
  }, [activeSubject]);
  
  // Load leaderboard data
  useEffect(() => {
    loadLeaderboard();
  }, []);
  
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const quizzes = await getQuizzesBySubject(activeSubject);
      setSubjectQuizzes(quizzes || []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadLeaderboard = async () => {
    try {
      const leaderboardData = await getGlobalLeaderboard(5);
      setLeaderboard(leaderboardData || []);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };
  
  // Map Firestore subjects to display subjects with icons and colors
  const getSubjectIcon = (subjectId: string) => {
    switch (subjectId) {
      case "mathematics": return <Calculator className="w-6 h-6" />;
      case "english": return <SpellCheck className="w-6 h-6" />;
      case "science": return <Globe className="w-6 h-6" />;
      case "general-knowledge": return <Globe className="w-6 h-6" />;
      default: return <Globe className="w-6 h-6" />;
    }
  };
  
  const getSubjectColor = (subjectId: string) => {
    switch (subjectId) {
      case "mathematics": return "from-blue-500 to-blue-600";
      case "english": return "from-purple-500 to-purple-600";
      case "science": return "from-green-500 to-green-600";
      case "general-knowledge": return "from-orange-500 to-orange-600";
      default: return "from-gray-500 to-gray-600";
    }
  };
  
  const subjects: SubjectWithQuizzes[] = firestoreSubjects.map(subject => ({
    ...subject,
    icon: getSubjectIcon(subject.id),
    color: getSubjectColor(subject.id),
    quizzes: subjectQuizzes
  }));

  const currentSubject = subjects.find(subject => subject.id === activeSubject) || subjects[0];

  const startQuiz = (quizId: string) => {
    alert(`Starting quiz: ${quizId}`);
    // In a real implementation, this would navigate to the quiz page
  };

  return (
    <div className="space-y-6">
      {/* Subject Tabs */}
      <div className="flex flex-wrap gap-4 mb-8">
        {subjects.map((subject) => (
          <Button
            key={subject.id}
            variant={activeSubject === subject.id ? "default" : "outline"}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl ${
              activeSubject === subject.id 
                ? `bg-gradient-to-r ${subject.color} text-white hover:opacity-90` 
                : ""
            }`}
            onClick={() => setActiveSubject(subject.id)}
          >
            {subject.icon}
            <span className="font-semibold">{subject.name}</span>
          </Button>
        ))}
      </div>

      {/* Subject Description */}
      <motion.div
        key={activeSubject}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${currentSubject.color} text-white`}>
                {currentSubject.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentSubject.name}</h3>
                <p className="text-gray-600">{currentSubject.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quizzes Section */}
      <motion.div
        key={`${activeSubject}-quizzes`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Practice Quizzes
          </h3>
          <Badge variant="secondary" className="text-sm py-1 px-3">
            {currentSubject.quizzes.length} Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentSubject.quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-lg">{quiz.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {quiz.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Questions
                      </span>
                      <span className="font-medium">{quiz.questionsCount}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Time Limit
                      </span>
                      <span className="font-medium">
                        {Math.floor(quiz.timeLimit / 60)}:{String(quiz.timeLimit % 60).padStart(2, '0')} min
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        Points
                      </span>
                      <span className="font-medium">{quiz.points}</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-4"
                    onClick={() => startQuiz(quiz.id)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leaderboard Section */}
      <motion.div
        key={`${activeSubject}-leaderboard`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performers
          </h3>
          <Badge variant="outline" className="text-sm py-1 px-3">
            This Week
          </Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                <div key={user.uid} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-100 text-gray-800" :
                      index === 2 ? "bg-amber-100 text-amber-800" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {user.rank || index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.displayName || user.email || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">
                        {user.badges} badges earned
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{user.xp || 0}</span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No leaderboard data available yet.</p>
                  <p className="text-sm">Complete some quizzes to see rankings!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubjectTabs;