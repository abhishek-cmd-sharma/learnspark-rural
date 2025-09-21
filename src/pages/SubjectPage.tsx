import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  BookOpen, 
  Microscope, 
  Scroll, 
  Globe, 
  Brain,
  Play,
  Star,
  Trophy,
  ChevronRight,
  Target,
  Clock,
  Users
} from "lucide-react";

// Import images
import mathHero from "@/assets/math-hero.jpg";
import englishHero from "@/assets/english-hero.jpg";
import scienceHero from "@/assets/science-hero.jpg";
import historyHero from "@/assets/history-hero.jpg";
import geographyHero from "@/assets/geography-hero.jpg";

export default function SubjectPage() {
  const { subject } = useParams();
  
  const subjects = {
    mathematics: {
      name: "Mathematics",
      icon: <Calculator />,
      color: "subject-math",
      image: mathHero,
      description: "Master numbers, equations, and problem-solving skills",
      totalLessons: 24,
      completedLessons: 18,
      level: 8,
      progress: 75,
      units: [
        { name: "Basic Arithmetic", lessons: 6, completed: 6, difficulty: "Beginner" },
        { name: "Fractions & Decimals", lessons: 5, completed: 4, difficulty: "Intermediate" },
        { name: "Geometry Basics", lessons: 4, completed: 3, difficulty: "Intermediate" },
        { name: "Algebra Introduction", lessons: 5, completed: 3, difficulty: "Advanced" },
        { name: "Word Problems", lessons: 4, completed: 2, difficulty: "Advanced" },
      ]
    },
    english: {
      name: "English",
      icon: <BookOpen />,
      color: "subject-english",
      image: englishHero,
      description: "Improve reading, writing, and communication skills",
      totalLessons: 20,
      completedLessons: 12,
      level: 6,
      progress: 60,
      units: [
        { name: "Grammar Fundamentals", lessons: 5, completed: 5, difficulty: "Beginner" },
        { name: "Reading Comprehension", lessons: 4, completed: 3, difficulty: "Intermediate" },
        { name: "Creative Writing", lessons: 4, completed: 2, difficulty: "Intermediate" },
        { name: "Poetry & Literature", lessons: 4, completed: 2, difficulty: "Advanced" },
        { name: "Public Speaking", lessons: 3, completed: 0, difficulty: "Advanced" },
      ]
    },
    science: {
      name: "Science",
      icon: <Microscope />,
      color: "subject-science",
      image: scienceHero,
      description: "Explore the wonders of physics, chemistry, and biology",
      totalLessons: 18,
      completedLessons: 8,
      level: 4,
      progress: 45,
      units: [
        { name: "Living Things", lessons: 4, completed: 4, difficulty: "Beginner" },
        { name: "Matter & Energy", lessons: 4, completed: 2, difficulty: "Intermediate" },
        { name: "Earth & Space", lessons: 4, completed: 2, difficulty: "Intermediate" },
        { name: "Simple Machines", lessons: 3, completed: 0, difficulty: "Advanced" },
        { name: "Scientific Method", lessons: 3, completed: 0, difficulty: "Advanced" },
      ]
    },
    history: {
      name: "History",
      icon: <Scroll />,
      color: "subject-history",
      image: historyHero,
      description: "Journey through time and learn about civilizations",
      totalLessons: 15,
      completedLessons: 5,
      level: 3,
      progress: 30,
      units: [
        { name: "Ancient Civilizations", lessons: 4, completed: 3, difficulty: "Beginner" },
        { name: "Medieval Times", lessons: 3, completed: 2, difficulty: "Intermediate" },
        { name: "Modern History", lessons: 4, completed: 0, difficulty: "Intermediate" },
        { name: "World Wars", lessons: 2, completed: 0, difficulty: "Advanced" },
        { name: "Contemporary Era", lessons: 2, completed: 0, difficulty: "Advanced" },
      ]
    },
    geography: {
      name: "Geography",
      icon: <Globe />,
      color: "subject-geography",
      image: geographyHero,
      description: "Discover countries, cultures, and natural wonders",
      totalLessons: 12,
      completedLessons: 3,
      level: 2,
      progress: 20,
      units: [
        { name: "Continents & Oceans", lessons: 3, completed: 3, difficulty: "Beginner" },
        { name: "Countries & Capitals", lessons: 3, completed: 0, difficulty: "Intermediate" },
        { name: "Climate & Weather", lessons: 2, completed: 0, difficulty: "Intermediate" },
        { name: "Natural Resources", lessons: 2, completed: 0, difficulty: "Advanced" },
        { name: "Cultural Geography", lessons: 2, completed: 0, difficulty: "Advanced" },
      ]
    },
    "general-knowledge": {
      name: "General Knowledge",
      icon: <Brain />,
      color: "subject-general",
      image: scienceHero,
      description: "Expand your knowledge across various topics",
      totalLessons: 30,
      completedLessons: 25,
      level: 10,
      progress: 85,
      units: [
        { name: "Current Affairs", lessons: 6, completed: 6, difficulty: "Beginner" },
        { name: "Sports & Games", lessons: 6, completed: 5, difficulty: "Intermediate" },
        { name: "Arts & Culture", lessons: 6, completed: 5, difficulty: "Intermediate" },
        { name: "Technology", lessons: 6, completed: 5, difficulty: "Advanced" },
        { name: "Famous Personalities", lessons: 6, completed: 4, difficulty: "Advanced" },
      ]
    }
  };

  const currentSubject = subjects[subject as keyof typeof subjects];

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-success";
      case "Intermediate": return "bg-xp-primary";
      case "Advanced": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl"
        >
          <div className="relative h-64 md:h-80">
            <img 
              src={currentSubject.image} 
              alt={`${currentSubject.name} illustration`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${currentSubject.color} mix-blend-multiply opacity-80`} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8">
                <div className="text-white max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{currentSubject.icon}</div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-display font-bold">
                        {currentSubject.name}
                      </h1>
                      <p className="text-xl opacity-90">{currentSubject.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-6">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Level {currentSubject.level}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {currentSubject.completedLessons}/{currentSubject.totalLessons} lessons
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      {currentSubject.progress}% complete
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 max-w-md">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{currentSubject.progress}%</span>
                    </div>
                    <Progress value={currentSubject.progress} className="h-3" />
                  </div>

                  <Button variant="hero" size="lg" className="text-lg px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cosmic-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white">
                  <Target />
                </div>
                <h3 className="font-semibold mb-2">Practice Quiz</h3>
                <p className="text-sm text-muted-foreground mb-4">Test your knowledge with 10 questions</p>
                <Button variant="outline" className="w-full">
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cosmic-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center text-white">
                  <Users />
                </div>
                <h3 className="font-semibold mb-2">Live Contest</h3>
                <p className="text-sm text-muted-foreground mb-4">Join 156 students competing now!</p>
                <Button variant="success" className="w-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                  Join Contest
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cosmic-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-xp-primary to-xp-secondary rounded-full flex items-center justify-center text-white">
                  <Clock />
                </div>
                <h3 className="font-semibold mb-2">Daily Challenge</h3>
                <p className="text-sm text-muted-foreground mb-4">Complete today's challenge for bonus XP</p>
                <Button variant="outline" className="w-full">
                  Take Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Learning Units */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Learning Units
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSubject.units.map((unit, index) => {
                  const unitProgress = Math.round((unit.completed / unit.lessons) * 100);
                  const isLocked = index > 0 && currentSubject.units[index - 1].completed < currentSubject.units[index - 1].lessons;
                  
                  return (
                    <motion.div
                      key={unit.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`cosmic-card p-6 transition-all ${
                        isLocked ? "opacity-50" : "hover:shadow-lg cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{unit.name}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`${getDifficultyColor(unit.difficulty)} text-white text-xs`}
                            >
                              {unit.difficulty}
                            </Badge>
                            {isLocked && (
                              <Badge variant="outline" className="text-xs">
                                🔒 Locked
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{unit.completed}/{unit.lessons} lessons completed</span>
                              <span>{unitProgress}%</span>
                            </div>
                            <Progress value={unitProgress} className="h-2" />
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            {unit.completed === unit.lessons ? (
                              <span className="text-success font-semibold">✓ Unit Complete</span>
                            ) : (
                              <span>Continue from lesson {unit.completed + 1}</span>
                            )}
                          </div>
                        </div>

                        <div className="ml-6">
                          {!isLocked && (
                            <Button 
                              variant={unit.completed === unit.lessons ? "outline" : "cosmic"}
                              className="min-w-[100px]"
                            >
                              {unit.completed === unit.lessons ? "Review" : "Continue"}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}