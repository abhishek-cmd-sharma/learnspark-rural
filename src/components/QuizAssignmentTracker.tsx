import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Users,
  Send,
  Edit,
  Trash2,
  TrendingUp
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { Quiz, UserQuizAttempt } from "@/lib/types";
import { format } from "date-fns";

interface AssignedQuiz {
  quiz: Quiz;
  assignedDate: Date;
  dueDate?: Date;
  assignedTo: string[]; // Student IDs
  completedBy: string[]; // Student IDs who completed
  averageScore?: number;
}

interface StudentProgress {
  studentId: string;
  studentName: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  timeTaken?: number;
 completedAt?: Date;
}

export function QuizAssignmentTracker({ subjectId }: { subjectId: string }) {
  const { getQuizzesBySubject, userQuizAttempts } = useFirestore();
  const [assignedQuizzes, setAssignedQuizzes] = useState<AssignedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]); // In a real app, this would be User[]

  useEffect(() => {
    loadAssignedQuizzes();
  }, [subjectId]);

  const loadAssignedQuizzes = async () => {
    try {
      setLoading(true);
      
      // Get all quizzes for this subject
      const quizzes = await getQuizzesBySubject(subjectId);
      
      // In a real implementation, we would fetch assigned quizzes from a separate collection
      // For now, we'll simulate some assigned quizzes
      const simulatedAssignments: AssignedQuiz[] = quizzes.slice(0, 3).map(quiz => ({
        quiz,
        assignedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 1000),
        dueDate: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 1000),
        assignedTo: ["student1", "student2", "student3", "student4", "student5"],
        completedBy: ["student1", "student2", "student3"].slice(0, Math.floor(Math.random() * 4))
      }));
      
      setAssignedQuizzes(simulatedAssignments);
      
      // Simulate student data
      const simulatedStudents = [
        { id: "student1", name: "Alice Johnson" },
        { id: "student2", name: "Bob Smith" },
        { id: "student3", name: "Carol Brown" },
        { id: "student4", name: "David Wilson" },
        { id: "student5", name: "Emma Davis" }
      ];
      
      setStudents(simulatedStudents);
    } catch (error) {
      console.error("Error loading assigned quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentProgress = (assignment: AssignedQuiz): StudentProgress[] => {
    return students.map(student => {
      // Check if student completed the quiz
      const completed = assignment.completedBy.includes(student.id);
      
      if (completed) {
        // Simulate quiz attempt data
        const score = 70 + Math.floor(Math.random() * 30);
        return {
          studentId: student.id,
          studentName: student.name,
          status: "completed",
          score,
          timeTaken: 300 + Math.floor(Math.random() * 300), // 5-10 minutes
          completedAt: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000)
        };
      } else if (assignment.assignedTo.includes(student.id)) {
        // Check if in progress
        const inProgress = Math.random() > 0.5;
        return {
          studentId: student.id,
          studentName: student.name,
          status: inProgress ? "in_progress" : "not_started"
        };
      } else {
        return {
          studentId: student.id,
          studentName: student.name,
          status: "not_started"
        };
      }
    });
  };

  const calculateAverageScore = (assignment: AssignedQuiz): number => {
    const progress = getStudentProgress(assignment);
    const completed = progress.filter(p => p.status === "completed");
    
    if (completed.length === 0) return 0;
    
    const totalScore = completed.reduce((sum, p) => sum + (p.score || 0), 0);
    return totalScore / completed.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Quiz Assignments</h2>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Assign New Quiz
        </Button>
      </div>
      
      {assignedQuizzes.length === 0 ? (
        <Card className="cosmic-card">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No Assigned Quizzes</h3>
            <p className="text-muted-foreground mb-4">
              You haven't assigned any quizzes to your students yet.
            </p>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Assign Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {assignedQuizzes.map((assignment) => {
            const studentProgress = getStudentProgress(assignment);
            const completedCount = studentProgress.filter(p => p.status === "completed").length;
            const inProgressCount = studentProgress.filter(p => p.status === "in_progress").length;
            const notStartedCount = studentProgress.filter(p => p.status === "not_started").length;
            const averageScore = calculateAverageScore(assignment);
            
            return (
              <Card key={assignment.quiz.id} className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{assignment.quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{assignment.quiz.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="cosmic-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Assigned</span>
                      </div>
                      <div className="text-lg font-bold">
                        {format(new Date(assignment.assignedDate), "MMM d")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(assignment.assignedDate), "yyyy")}
                      </div>
                    </div>
                    
                    <div className="cosmic-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Due Date</span>
                      </div>
                      <div className="text-lg font-bold">
                        {assignment.dueDate ? format(new Date(assignment.dueDate), "MMM d") : "No due date"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {assignment.dueDate ? format(new Date(assignment.dueDate), "yyyy") : ""}
                      </div>
                    </div>
                    
                    <div className="cosmic-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Students</span>
                      </div>
                      <div className="text-lg font-bold">{assignment.assignedTo.length}</div>
                      <div className="text-xs text-muted-foreground">Assigned</div>
                    </div>
                    
                    <div className="cosmic-card p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Avg Score</span>
                      </div>
                      <div className="text-lg font-bold">{Math.round(averageScore)}%</div>
                      <div className="text-xs text-muted-foreground">Class average</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Completion Status</span>
                      <span>{completedCount}/{assignment.assignedTo.length} completed</span>
                    </div>
                    <Progress 
                      value={(completedCount / assignment.assignedTo.length) * 100} 
                      className="h-2" 
                    />
                    
                    <div className="flex gap-2">
                      <Badge variant="default">{completedCount} completed</Badge>
                      <Badge variant="secondary">{inProgressCount} in progress</Badge>
                      <Badge variant="outline">{notStartedCount} not started</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Student Progress
                    </h4>
                    
                    <div className="space-y-3">
                      {studentProgress.map((progress) => (
                        <div key={progress.studentId} className="flex items-center justify-between p-3 cosmic-card">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary text-xs font-bold">
                                {progress.studentName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{progress.studentName}</div>
                              <div className="text-xs text-muted-foreground">
                                {progress.status === "completed" && progress.completedAt 
                                  ? `Completed ${format(new Date(progress.completedAt), "MMM d")}`
                                  : progress.status === "in_progress" 
                                    ? "In progress" 
                                    : "Not started"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {progress.status === "completed" && (
                              <>
                                <Badge variant="default">
                                  {progress.score}%
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round((progress.timeTaken || 0) / 60)}m
                                </span>
                              </>
                            )}
                            
                            {progress.status === "in_progress" && (
                              <Badge variant="secondary">In Progress</Badge>
                            )}
                            
                            {progress.status === "not_started" && (
                              <Badge variant="outline">Not Started</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}