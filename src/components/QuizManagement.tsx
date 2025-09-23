import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz, Question } from "@/lib/types";
import { Plus, Edit, Trash2, Save, X, ArrowUpDown, Search, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AutoQuizGeneration } from "@/components/AutoQuizGeneration";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionFormProps {
 question: Question;
  index: number;
  onUpdate: (index: number, question: Question) => void;
  onRemove: (index: number) => void;
}

const QuestionForm = ({ question, index, onUpdate, onRemove }: QuestionFormProps) => {
  const handleUpdate = (field: keyof Question, value: any) => {
    onUpdate(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    handleUpdate("options", newOptions);
  };

  return (
    <Card className="cosmic-card mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Question {index + 1}</span>
          <Button variant="destructive" size="sm" onClick={() => onRemove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`question-text-${index}`}>Question Text</Label>
          <Textarea
            id={`question-text-${index}`}
            value={question.text}
            onChange={(e) => handleUpdate("text", e.target.value)}
            placeholder="Enter question text"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Options</Label>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                required
              />
              <Button
                type="button"
                variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                size="sm"
                onClick={() => handleUpdate("correctAnswer", optionIndex)}
              >
                Correct
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleUpdate("options", [...question.options, ""])}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`explanation-${index}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${index}`}
            value={question.explanation || ""}
            onChange={(e) => handleUpdate("explanation", e.target.value)}
            placeholder="Enter explanation for the correct answer"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`points-${index}`}>Points</Label>
            <Input
              id={`points-${index}`}
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => handleUpdate("points", parseInt(e.target.value) || 1)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuizFormProps {
 quiz?: Quiz | null;
  subjectId: string;
  onSave: (quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

const QuizForm = ({ quiz, subjectId, onSave, onCancel }: QuizFormProps) => {
  const [title, setTitle] = useState(quiz?.title || "");
  const [description, setDescription] = useState(quiz?.description || "");
  const [difficulty, setDifficulty] = useState<Quiz["difficulty"]>(quiz?.difficulty || "medium");
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit?.toString() || "30");
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions || [
    {
      id: "1",
      quizId: "",
      text: "",
      options: ["", ""],
      correctAnswer: 0,
      points: 1
    }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: (questions.length + 1).toString(),
        quizId: "",
        text: "",
        options: ["", ""],
        correctAnswer: 0,
        points: 1
      }
    ]);
  };

  const handleUpdateQuestion = (index: number, question: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = question;
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate that each question has at least 2 options and a correct answer
      for (const question of questions) {
        if (question.options.length < 2) {
          toast.error("Each question must have at least 2 options");
          return;
        }
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          toast.error("Each question must have a valid correct answer");
          return;
        }
        if (!question.text.trim()) {
          toast.error("Each question must have text");
          return;
        }
      }
      
      const quizData = {
        subjectId,
        title,
        description,
        difficulty,
        timeLimit: parseInt(timeLimit) || undefined,
        questions: questions.map((q, index) => ({
          ...q,
          id: (index + 1).toString()
        }))
      };
      
      await onSave(quizData);
      toast.success(quiz ? "Quiz updated successfully!" : "Quiz created successfully!");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle>{quiz ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: Quiz["difficulty"]) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeLimit">Time Limit (seconds, optional)</Label>
              <Input
                id="timeLimit"
                type="number"
                min="1"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
            
            {questions.map((question, index) => (
              <QuestionForm
                key={index}
                question={question}
                index={index}
                onUpdate={handleUpdateQuestion}
                onRemove={handleRemoveQuestion}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {quiz ? "Update Quiz" : "Create Quiz"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

interface QuizManagementProps {
  subjectId: string;
}

export function QuizManagement({ subjectId }: QuizManagementProps) {
  const { getQuizzesBySubject, createQuiz, updateQuiz, deleteQuiz, subjects } = useFirestore();
  const { userData } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 quizzes per page

  // Filter and paginate quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  
  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuizzes, currentPage, itemsPerPage]);

  useEffect(() => {
    loadQuizzes();
  }, [subjectId]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const quizData = await getQuizzesBySubject(subjectId);
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      toast.error("Failed to load quizzes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createQuiz(quizData);
      setIsCreating(false);
      loadQuizzes(); // Refresh the list
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  };

  const handleUpdateQuiz = async (quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => {
    if (!editingQuiz) return;
    
    try {
      await updateQuiz(editingQuiz.id, quizData);
      setEditingQuiz(null);
      loadQuizzes(); // Refresh the list
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw error;
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await deleteQuiz(id);
      toast.success("Quiz deleted successfully!");
      loadQuizzes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz. Please try again.");
    } finally {
      setDeletingQuiz(null);
    }
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-bold">Quiz Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingQuiz || isAutoGenerating}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
          {userData?.role === "teacher" && (
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={isCreating || !!editingQuiz || isAutoGenerating}
                  variant="cosmic"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Generate Quiz with AI</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will generate a new quiz using AI based on the subject content. The generated quiz will be saved to this subject.
                    Are you sure you want to proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setIsAutoGenerating(true);
                      setShowConfirmDialog(false);
                    }}
                  >
                    Generate Quiz
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {(isCreating || editingQuiz) && (
        <QuizForm
          quiz={editingQuiz}
          subjectId={subjectId}
          onSave={editingQuiz ? handleUpdateQuiz : handleCreateQuiz}
          onCancel={() => {
            setIsCreating(false);
            setEditingQuiz(null);
          }}
        />
      )}

      {isAutoGenerating && (
        <AutoQuizGeneration
          subjectId={subjectId}
          subjectName={subjects.find(s => s.id === subjectId)?.name || "Unknown Subject"}
          onQuizGenerated={(quizData) => {
            handleCreateQuiz(quizData);
            setIsAutoGenerating(false);
          }}
          onCancel={() => setIsAutoGenerating(false)}
        />
      )}

      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? "No quizzes found matching your search." : "No quizzes found for this subject."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsCreating(true)}
              className="mt-4"
              disabled={isCreating || !!editingQuiz}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Quiz
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedQuizzes.map((quiz) => (
              <Card key={quiz.id} className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{quiz.title}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuiz(quiz)}
                        disabled={isCreating || !!editingQuiz}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingQuiz(quiz.id)}
                        disabled={deletingQuiz === quiz.id}
                      >
                        {deletingQuiz === quiz.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{quiz.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Difficulty</p>
                      <p className="font-semibold capitalize">{quiz.difficulty}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="font-semibold">{quiz.questions.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Time Limit</p>
                      <p className="font-semibold">{quiz.timeLimit ? `${quiz.timeLimit}s` : "None"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-semibold">
                        {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}