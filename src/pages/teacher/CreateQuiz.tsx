import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  BookOpen,
  Target,
  Clock,
  Users,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Quiz, Question } from "@/lib/types";

export const CreateQuiz: React.FC = () => {
  const { userData } = useAuth();
  const { subjects, createQuiz } = useFirestore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: "",
    description: "",
    subjectId: "",
    questions: [],
    timeLimit: 30,
    difficulty: "medium",
    isPublished: false
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    difficulty: "medium",
    points: 10
  });

  const handleQuizChange = (field: keyof Quiz, value: any) => {
    setQuiz(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    setCurrentQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ["", "", "", ""])];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.options?.every(opt => opt.trim())) {
      toast.error("Please fill in all question fields");
      return;
    }

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      question: currentQuestion.question!,
      options: currentQuestion.options!,
      correctAnswer: currentQuestion.correctAnswer || 0,
      explanation: currentQuestion.explanation || "",
      difficulty: currentQuestion.difficulty || "medium",
      points: currentQuestion.points || 10
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));

    // Reset current question
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: "medium",
      points: 10
    });

    toast.success("Question added successfully!");
  };

  const removeQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index) || []
    }));
    toast.success("Question removed");
  };

  const saveQuiz = async (publish: boolean = false) => {
    if (!quiz.title || !quiz.subjectId || !quiz.questions?.length) {
      toast.error("Please fill in all required fields and add at least one question");
      return;
    }

    try {
      setLoading(true);
      
      const quizData: Omit<Quiz, 'id'> = {
        title: quiz.title!,
        description: quiz.description || "",
        subjectId: quiz.subjectId!,
        questions: quiz.questions!,
        timeLimit: quiz.timeLimit || 30,
        difficulty: quiz.difficulty || "medium",
        isPublished: publish,
        createdBy: userData?.uid || "",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createQuiz(quizData);
      
      toast.success(publish ? "Quiz published successfully!" : "Quiz saved as draft!");
      navigate("/teacher/dashboard");
      
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = () => {
    toast.info("AI quiz generation coming soon!");
  };

  return (
    <RoleProtectedRoute allowedRoles={["teacher"]}>
      <div className="min-h-screen cosmic-bg">
        <Header />
        
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => navigate("/teacher/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Quiz</h1>
              <p className="text-muted-foreground">Design engaging quizzes for your students</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quiz Settings */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Quiz Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Quiz Title *</Label>
                    <Input
                      id="title"
                      value={quiz.title || ""}
                      onChange={(e) => handleQuizChange("title", e.target.value)}
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={quiz.description || ""}
                      onChange={(e) => handleQuizChange("description", e.target.value)}
                      placeholder="Brief description of the quiz"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={quiz.subjectId || ""} onValueChange={(value) => handleQuizChange("subjectId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.icon} {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={quiz.timeLimit || 30}
                      onChange={(e) => handleQuizChange("timeLimit", parseInt(e.target.value))}
                      min="5"
                      max="180"
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select value={quiz.difficulty || "medium"} onValueChange={(value) => handleQuizChange("difficulty", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Summary */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Quiz Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Questions:</span>
                    <Badge variant="outline">{quiz.questions?.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time Limit:</span>
                    <Badge variant="outline">{quiz.timeLimit || 30} min</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Points:</span>
                    <Badge variant="outline">
                      {quiz.questions?.reduce((sum, q) => sum + (q.points || 10), 0) || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Difficulty:</span>
                    <Badge variant="outline" className="capitalize">{quiz.difficulty || "medium"}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={generateWithAI} 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate with AI
                </Button>
                <Button 
                  onClick={() => saveQuiz(false)} 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button 
                  onClick={() => saveQuiz(true)} 
                  className="w-full"
                  disabled={loading || !quiz.questions?.length}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Quiz
                </Button>
              </div>
            </div>

            {/* Question Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add Question Form */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Question
                  </CardTitle>
                  <CardDescription>
                    Create engaging multiple-choice questions for your quiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      value={currentQuestion.question || ""}
                      onChange={(e) => handleQuestionChange("question", e.target.value)}
                      placeholder="Enter your question here..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index}>
                        <Label htmlFor={`option-${index}`}>
                          Option {index + 1} {index === currentQuestion.correctAnswer && "✓"}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`option-${index}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className={index === currentQuestion.correctAnswer ? "border-green-500" : ""}
                          />
                          <Button
                            type="button"
                            variant={index === currentQuestion.correctAnswer ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleQuestionChange("correctAnswer", index)}
                          >
                            ✓
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      value={currentQuestion.explanation || ""}
                      onChange={(e) => handleQuestionChange("explanation", e.target.value)}
                      placeholder="Explain why this answer is correct..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="questionDifficulty">Difficulty</Label>
                      <Select 
                        value={currentQuestion.difficulty || "medium"} 
                        onValueChange={(value) => handleQuestionChange("difficulty", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="points">Points</Label>
                      <Input
                        id="points"
                        type="number"
                        value={currentQuestion.points || 10}
                        onChange={(e) => handleQuestionChange("points", parseInt(e.target.value))}
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>

                  <Button onClick={addQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </CardContent>
              </Card>

              {/* Questions List */}
              {quiz.questions && quiz.questions.length > 0 && (
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Quiz Questions ({quiz.questions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="p-4 cosmic-card">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex} 
                                  className={`p-2 rounded text-sm ${
                                    optIndex === question.correctAnswer 
                                      ? "bg-green-100 text-green-800 border border-green-300" 
                                      : "bg-gray-50"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {optIndex === question.correctAnswer && " ✓"}
                                </div>
                              ))}
                            </div>
                            {question.explanation && (
                              <p className="text-sm text-muted-foreground italic">
                                Explanation: {question.explanation}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="outline" className="capitalize">
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {question.points} pts
                            </Badge>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeQuestion(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default CreateQuiz;