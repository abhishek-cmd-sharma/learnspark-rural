import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Lesson, UserLessonProgress } from "@/lib/types";
import { 
  BookOpen, 
  Clock, 
  Target, 
  FileText, 
  Video, 
  Link, 
  Image, 
  Volume2, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
 Play, 
  Download,
  ExternalLink,
  Star,
  Trophy
} from "lucide-react";
import { toast } from "sonner";

export default function LessonPage() {
  const { subjectId, lessonId } = useParams<{ subjectId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user, subjects, getLesson: firestoreGetLesson, updateUserLessonProgress } = useFirestore();
  const { userData } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserLessonProgress | null>(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      if (lessonId) {
        const lessonData = await firestoreGetLesson(lessonId);
        if (lessonData) {
          setLesson(lessonData);
        } else {
          // Fallback to mock data if lesson not found
          const mockLesson: Lesson = {
            id: lessonId,
            subjectId: subjectId || "",
            title: "Introduction to Algebra",
            description: "Learn the basics of algebraic expressions and equations",
            content: "# Introduction to Algebra\n\nAlgebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables.\n\n## What is a Variable?\n\nA variable is a symbol, usually a letter, that stands for a number. Examples of variables include x, y, a, b, c, etc.\n\n## What is an Expression?\n\nAn expression is a combination of numbers, variables, and mathematical operations (like addition, subtraction, multiplication, and division). For example:\n\n- 3x + 5\n- 2y - 7\n- a^2 + b^2\n\n## What is an Equation?\n\nAn equation is a statement that two expressions are equal. It contains an equals sign (=). For example:\n\n- 3x + 5 = 11\n- 2y - 7 = 3\n- a^2 + b^2 = c^2",
            order: 1,
            difficulty: "medium",
            estimatedDuration: 45,
            objectives: [
              "Understand what variables are in algebra",
              "Learn to identify algebraic expressions",
              "Recognize the difference between expressions and equations",
              "Solve simple one-step equations"
            ],
            resources: [
              {
                id: "1",
                type: "video",
                title: "Algebra Basics Explained",
                url: "https://example.com/video",
                description: "A visual introduction to algebra concepts"
              },
              {
                id: "2",
                type: "pdf",
                title: "Algebra Formula Sheet",
                url: "https://example.com/formulas.pdf",
                description: "Key formulas and rules for algebra"
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "teacher123"
          };
          
          setLesson(mockLesson);
        }
        
        // TODO: Load actual user progress
        const mockProgress: UserLessonProgress = {
          id: "progress1",
          userId: user?.uid || "",
          lessonId: lessonId,
          subjectId: subjectId || "",
          status: "in_progress",
          progress: 30,
          timeSpent: 15,
          lastAccessedAt: new Date(),
          notes: "Need to review variables section"
        };
        
        setProgress(mockProgress);
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      toast.error("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    if (!lesson || !user) return;
    
    try {
      const updatedProgress: Omit<UserLessonProgress, "id"> = {
        userId: user.uid,
        lessonId: lesson.id,
        subjectId: lesson.subjectId,
        status: "completed",
        progress: 100,
        timeSpent: (progress?.timeSpent || 0) + 5,
        lastAccessedAt: new Date(),
        completedAt: new Date(),
        notes: progress?.notes
      };
      
      // TODO: Implement actual API call to update progress
      console.log("Updating progress:", updatedProgress);
      
      toast.success("Lesson marked as complete!");
      navigate(`/subjects/${subjectId}`);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to mark lesson as complete");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "link": return <Link className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "audio": return <Volume2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success";
      case "medium": return "bg-xp-primary";
      case "hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const subject = subjects.find(s => s.id === subjectId);

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

  if (!lesson) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Lesson Not Found</h1>
          <p className="text-muted-foreground mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/subjects/${subjectId}`)}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to {subject?.name || "Subject"}
          </Button>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Subjects</span>
            <ChevronRight className="h-4 w-4" />
            <span>{subject?.name || "Subject"}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Lesson: {lesson.title}</span>
          </div>
        </div>
        
        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">{lesson.title}</h1>
              <p className="text-muted-foreground">{lesson.description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className={`${getDifficultyColor(lesson.difficulty)} text-white`}
              >
                {lesson.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{lesson.estimatedDuration} min</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Progress */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-sm">
            <span>Your Progress</span>
            <span>{progress?.progress || 0}%</span>
          </div>
          <Progress value={progress?.progress || 0} className="h-3" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lesson Content */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Lesson Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: formatContent(lesson.content) }}
                />
              </CardContent>
            </Card>
            
            {/* Learning Objectives */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lesson.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Resources */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Additional Resources
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                  >
                    {resourcesOpen ? "Hide" : "Show"} Resources
                  </Button>
                </CardTitle>
              </CardHeader>
              {resourcesOpen && (
                <CardContent>
                  <div className="space-y-4">
                    {lesson.resources && lesson.resources.length > 0 ? (
                      lesson.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-3 cosmic-card">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {getResourceIcon(resource.type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              {resource.description && (
                                <p className="text-sm text-muted-foreground">{resource.description}</p>
                              )}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              {resource.type === "pdf" ? (
                                <>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open
                                </>
                              )}
                            </a>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No additional resources available for this lesson.
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Lesson Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="cosmic" 
                  className="w-full"
                  onClick={markAsComplete}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Star className="mr-2 h-4 w-4" />
                  Add to Favorites
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Trophy className="mr-2 h-4 w-4" />
                  Take Quiz
                </Button>
              </CardContent>
            </Card>
            
            {/* Progress Summary */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Spent</span>
                    <span>{progress?.timeSpent || 0} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={
                      progress?.status === "completed" ? "default" : 
                      progress?.status === "in_progress" ? "secondary" : "outline"
                    }>
                      {progress?.status === "completed" ? "Completed" : 
                       progress?.status === "in_progress" ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>
                  {progress?.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Your Notes</p>
                      <p className="text-sm">{progress.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation */}
            <Card className="cosmic-card">
              <CardHeader>
                <CardTitle>Lesson Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple markdown to HTML converter for demonstration
function formatContent(content: string): string {
  // Convert markdown headers to HTML
  let html = content
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-6">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
    .replace(/(?:\r\n|\r|\n)/g, '<br>');
  
  // Wrap lists
  html = html.replace(/(<li class="ml-4">.*<\/li>)/g, '<ul class="list-disc ml-6 my-2">$1</ul>');
  
  return html;
}