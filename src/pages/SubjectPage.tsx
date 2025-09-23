import { Header } from "@/components/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Subject, Quiz } from "@/lib/types";
import PageTransition from "@/components/PageTransition";
import { quizService } from "@/lib/firestoreService";
import { QuizInterface } from "@/components/QuizInterface";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Clock,
  Star,
  Play,
  BookOpen,
  Zap,
  Trophy,
  Users,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  Search,
  Filter,
  Gamepad2,
  Puzzle,
  Lightbulb,
  Calculator,
  SpellCheck,
  Globe,
  Brain,
  Award,
  History,
  Settings,
  Download,
  Share2,
  LogOut,
  FlaskConical,
  ChevronDown,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import mathHero from "@/assets/math-hero.jpg";
import englishHero from "@/assets/english-hero.jpg";
import scienceHero from "@/assets/science-hero.jpg";
import historyHero from "@/assets/history-hero.jpg";
import geographyHero from "@/assets/geography-hero.jpg";

// Map subject names to images
const subjectImages: Record<string, string> = {
  "Mathematics": mathHero,
  "English": englishHero,
  "Science": scienceHero,
  "History": historyHero,
  "Geography": geographyHero,
  "General Knowledge": scienceHero
};

// Map subject names to icons
const subjectIcons: Record<string, string> = {
  "Mathematics": "🔢",
  "English": "📖",
  "Science": "🔬",
  "History": "🏛️",
  "Geography": "🌍",
  "General Knowledge": "🧠"
};

// Map subject names to gradients
const subjectGradients: Record<string, string> = {
  "Mathematics": "gradient-math",
  "English": "gradient-english",
  "Science": "gradient-science",
  "History": "gradient-history",
  "Geography": "gradient-geography",
  "General Knowledge": "gradient-gk"
};

// Question type categories
const questionTypes = [
 { id: "multiple-choice", name: "Multiple Choice", icon: Target },
  { id: "true-false", name: "True/False", icon: Zap },
  { id: "fill-blank", name: "Fill in the Blank", icon: SpellCheck },
  { id: "puzzle", name: "Puzzles", icon: Puzzle },
  { id: "special-task", name: "Special Tasks", icon: Lightbulb }
];

export default function SubjectPage() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { subjects, getQuizzesBySubject } = useFirestore();
  const { userData } = useAuth();
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [subjectStats, setSubjectStats] = useState({
    level: 1,
    progress: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalQuizzes: 0,
    completedQuizzes: 0
  });
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Find the current subject by name (case insensitive)
  useEffect(() => {
    if (subjects.length > 0) {
      const foundSubject = subjects.find(s => 
        s.name.toLowerCase().replace(/\s+/g, '-') === subject ||
        s.name.toLowerCase() === subject
      );
      setCurrentSubject(foundSubject || null);
      
      // Set mock stats for the subject
      if (foundSubject) {
        setSubjectStats({
          level: foundSubject.level || 1,
          progress: foundSubject.progress || 0,
          totalLessons: foundSubject.totalLessons || 0,
          completedLessons: foundSubject.completedLessons || 0,
          totalQuizzes: 5, // Mock data
          completedQuizzes: 2 // Mock data
        });
      }
    }
  }, [subjects, subject]);

  // Fetch quizzes for the current subject
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!currentSubject) return;
      
      try {
        setLoading(true);
        const subjectQuizzes = await getQuizzesBySubject(currentSubject.id);
        setQuizzes(subjectQuizzes);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [currentSubject, getQuizzesBySubject]);

  // Handle starting a quiz
  const startQuiz = (quizId: string) => {
    setActiveQuizId(quizId);
  };

  // Handle returning to subject page after quiz
  const handleQuizComplete = () => {
    setActiveQuizId(null);
    // Refresh quizzes to show updated progress
    if (currentSubject) {
      getQuizzesBySubject(currentSubject.id).then(setQuizzes);
    }
    // Navigate back to the subject page
    navigate(0);
  };

  // Show quiz interface if a quiz is active
  if (activeQuizId) {
    return (
      <QuizInterface 
        quizId={activeQuizId} 
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  if (!currentSubject) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-4xl font-display font-bold mb-4">Subject Not Found</h1>
            <a href="/learning" className="text-blue-600 hover:underline">Return to Learning Hub</a>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Filter quizzes by category (simplified since Quiz type doesn't have category property)
  const filteredQuizzes = activeCategory === "all" 
    ? quizzes 
    : quizzes;

  // Get subject-specific icon
  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName) {
      case "Mathematics": return <Calculator className="w-5 h-5" />;
      case "English": return <SpellCheck className="w-5 h-5" />;
      case "General Knowledge": return <Globe className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Subject Header */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 ${subjectGradients[currentSubject.name as keyof typeof subjectGradients]} opacity-90`}></div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center md:justify-start gap-4 mb-4"
                >
                  <div className="text-6xl">
                    {subjectIcons[currentSubject.name as keyof typeof subjectIcons] || "📚"}
                  </div>
                  <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                      {currentSubject.name}
                    </h1>
                    <p className="text-white/90 text-lg">
                      {currentSubject.description}
                    </p>
                  </div>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-1/3"
              >
                <img 
                  src={subjectImages[currentSubject.name] || scienceHero} 
                  alt={currentSubject.name}
                  className="w-full h-48 object-cover rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Subject Stats */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="text-xl font-bold">{subjectStats.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-xl font-bold">{subjectStats.progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lessons</p>
                    <p className="text-xl font-bold">{subjectStats.completedLessons}/{subjectStats.totalLessons}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Star className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quizzes</p>
                    <p className="text-xl font-bold">{subjectStats.completedQuizzes}/{subjectStats.totalQuizzes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Subject Progress</h3>
                  <span className="text-sm font-medium">{subjectStats.progress}% Complete</span>
                </div>
                <Progress value={subjectStats.progress} className="h-3" />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Subject-Specific Statistics */}
          {userData?.role !== "teacher" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <BarChart3 className="w-5 h-5" />
                    Your Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold">Accuracy</h4>
                      </div>
                      <p className="text-2xl font-bold">78%</p>
                      <p className="text-sm text-gray-600">Last 10 quizzes</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold">Avg. Time</h4>
                      </div>
                      <p className="text-2xl font-bold">4.2m</p>
                      <p className="text-sm text-gray-600">Per question</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold">Streak</h4>
                      </div>
                      <p className="text-2xl font-bold">7</p>
                      <p className="text-sm text-gray-600">Days in a row</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <History className="w-4 h-4" />
                      View History
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      See Achievements
                    </Button>
                    <Button className="flex items-center gap-2 ml-auto">
                      <Play className="w-4 h-4" />
                      Start New Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Teacher View */}
          {userData?.role === "teacher" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600">
                    <Settings className="w-5 h-5" />
                    Teacher Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="flex items-center gap-2">
                      <Link to={`/subjects/${currentSubject.id}/quizzes`}>
                        <Plus className="w-4 h-4" />
                        Create Quiz
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="flex items-center gap-2" asChild>
                      <Link to={`/subjects/${currentSubject.id}/quizzes/manage`}>
                        <Edit className="w-4 h-4" />
                        Manage Quizzes
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="flex items-center gap-2" asChild>
                      <Link to={`/subjects/${currentSubject.id}/analytics`}>
                        <BarChart3 className="w-4 h-4" />
                        View Analytics
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Resource Management */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Resource Management
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Upload Resources
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Resources
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <History className="w-4 h-4" />
                        Resource History
                      </Button>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Student Progress Tracking</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                              12
                            </div>
                            <div>
                              <p className="font-medium">Students Attempted Quizzes</p>
                              <p className="text-sm text-gray-600">Average Score: 78%</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/subjects/${currentSubject.id}/student-progress`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                              5
                            </div>
                            <div>
                              <p className="font-medium">Students Completed All Quizzes</p>
                              <p className="text-sm text-gray-600">Top Performers</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/subjects/${currentSubject.id}/student-progress`}>
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
  
            {/* Question Type Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Gamepad2 className="text-purple-500" />
              Question Types
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 rounded-xl"
                onClick={() => setActiveCategory("all")}
              >
                <Zap className="w-6 h-6 mb-2" />
                <span className="text-sm">All</span>
              </Button>
              
              {questionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={activeCategory === type.id ? "default" : "outline"}
                    className="flex flex-col items-center justify-center h-24 rounded-xl"
                    onClick={() => setActiveCategory(type.id)}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm">{type.name}</span>
                  </Button>
                );
              })}
            </div>
          </motion.div>

          {/* Quizzes Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                {activeCategory === "all" ? "All Practice Quizzes" : 
                 questionTypes.find(t => t.id === activeCategory)?.name || "Practice Quizzes"}
              </h2>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {filteredQuizzes.length} Available
              </Badge>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-red-50">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </CardContent>
              </Card>
            ) : filteredQuizzes.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold mb-2">No Quizzes Available</h3>
                  <p className="text-gray-600 mb-4">
                    {activeCategory === "all" 
                      ? "There are no quizzes available for this subject yet. Check back later!" 
                      : `There are no ${questionTypes.find(t => t.id === activeCategory)?.name.toLowerCase() || "selected"} quizzes available for this subject yet.`}
                  </p>
                  
                  {userData?.role === "teacher" && (
                    <Button asChild className="mt-4">
                      <Link to={`/subjects/${currentSubject.id}/quizzes`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Quiz
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm h-full flex flex-col">
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
                            <span className="font-medium">{quiz.questions.length}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Time Limit
                            </span>
                            <span className="font-medium">
                              {quiz.timeLimit ? `${quiz.timeLimit}s` : "No limit"}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              Points
                            </span>
                            <span className="font-medium">
                              {quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                            </span>
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
            )}
          </motion.div>

          {/* Special Sections for Different Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-display font-bold text-gray-800 mb-6 flex items-center gap-2">
              {getSubjectIcon(currentSubject.name)}
              Subject-Specific Activities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Math-specific activities */}
              {currentSubject.name === "Mathematics" && (
                <>
                  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        Math Puzzles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Solve fun math puzzles and brain teasers</p>
                      <Button variant="outline" className="w-full">
                        Try Puzzles
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-green-600" />
                        Math Experiments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Interactive math experiments and activities</p>
                      <Button variant="outline" className="w-full">
                        Start Experiment
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* English-specific activities */}
              {currentSubject.name === "English" && (
                <>
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-yellow-600" />
                        Story Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Read and analyze interesting stories</p>
                      <Button variant="outline" className="w-full">
                        Read Stories
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Puzzle className="w-5 h-5 text-purple-600" />
                        Word Games
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Play fun word games and vocabulary challenges</p>
                      <Button variant="outline" className="w-full">
                        Play Games
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* General Knowledge-specific activities */}
              {currentSubject.name === "General Knowledge" && (
                <>
                  <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        World Explorer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Discover fascinating facts about our world</p>
                      <Button variant="outline" className="w-full">
                        Explore World
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-teal-600" />
                        Did You Know?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">Learn amazing facts and trivia</p>
                      <Button variant="outline" className="w-full">
                        Learn Facts
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Common special tasks for all subjects */}
              <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-rose-600" />
                    Special Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Take on a special challenge to test your skills</p>
                  <Button variant="outline" className="w-full">
                    Accept Challenge
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Lessons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Lessons
              </h2>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Coming Soon
              </Badge>
            </div>
            
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Lessons Coming Soon</h3>
                <p className="text-gray-600">
                  We're working on adding comprehensive lessons for this subject. Check back later!
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Lesson Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Lesson Modules
              </h2>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                {userData?.role === "teacher" ? "Manage" : "Explore"}
              </Badge>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((module) => (
                <Card key={module} className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          {module}
                        </div>
                        <span>Module {module}: Introduction to {currentSubject.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="w-5 h-5" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="hidden">
                    <div className="space-y-3">
                      <p className="text-gray-600">Learn the fundamentals of {currentSubject.name} in this comprehensive module.</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Watch Video
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Read Notes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resources
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
