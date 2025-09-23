import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle, Sparkles, Loader2, Lightbulb, CheckCircle, FileText, Type } from "lucide-react";
import { generateQuizFromContent } from "@/lib/geminiService";
import { Quiz } from "@/lib/types";
import { toast } from "sonner";
import { PdfUpload } from "@/components/PdfUpload";

interface AutoQuizGenerationProps {
  subjectId: string;
  subjectName: string;
  onQuizGenerated: (quiz: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function AutoQuizGeneration({ subjectId, subjectName, onQuizGenerated, onCancel }: AutoQuizGenerationProps) {
  const [content, setContent] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!content.trim()) {
      toast.error("Please enter subject content");
      return;
    }
    
    if (content.length < 50) {
      toast.error("Content should be at least 50 characters long for better quiz generation");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const quizData = await generateQuizFromContent(
        subjectName,
        content,
        parseInt(numQuestions),
        difficulty
      );

      // Transform the generated quiz data to match our Quiz type
      const transformedQuiz: Omit<Quiz, "id" | "createdAt" | "updatedAt"> = {
        subjectId,
        title: `${subjectName} Quiz`,
        description: `Auto-generated quiz for ${subjectName}`,
        difficulty,
        timeLimit: parseInt(numQuestions) * 60, // 1 minute per question
        questions: quizData.questions.map((q: any, index: number) => ({
          id: (index + 1).toString(),
          quizId: "", // Will be set when creating the quiz
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points
        }))
      };

      onQuizGenerated(transformedQuiz);
      setIsSuccess(true);
      toast.success("Quiz generated successfully!");
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError(err instanceof Error ? err.message : "Failed to generate quiz. Please try again.");
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Auto Quiz Generation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload PDF
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="content">Subject Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter the subject content to generate a quiz from..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground">
                    Enter the content you want to create a quiz for. The AI will generate questions based on this content.
                  </p>
                  <span className={`ml-2 ${content.length < 50 ? "text-destructive" : "text-muted-foreground"}`}>
                    {content.length}/50 characters minimum
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pdf" className="mt-4">
              <PdfUpload
                onContentExtracted={setContent}
                isProcessing={isLoading}
              />
              {content && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-secondary rounded-lg"
                >
                  <h3 className="font-semibold mb-2">Extracted Content Preview:</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {content.substring(0, 200)}{content.length > 200 ? "..." : ""}
                  </p>
                  <p className="text-xs mt-2 text-muted-foreground">
                    {content.length} characters extracted
                  </p>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
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
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary p-4 rounded-lg"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            How it works
          </h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Enter detailed subject content in the text area above (minimum 50 characters)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Select the number of questions (1-20) and difficulty level</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Click "Generate Quiz" to create an AI-powered quiz</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Review and edit the generated quiz before saving</span>
            </li>
          </ul>
          
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-medium mb-2">Tips for better results:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Provide clear, well-structured content</li>
              <li>• Include key concepts and important facts</li>
              <li>• Use examples and explanations where possible</li>
            </ul>
          </div>
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex-col items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Quiz generated successfully!</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel}>
                Create Another
              </Button>
              <Button onClick={onCancel}>
                Continue to Quiz Management
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2"
          >
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleGenerateQuiz} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </Card>
  );
}