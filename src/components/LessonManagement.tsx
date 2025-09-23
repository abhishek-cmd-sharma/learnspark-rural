import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { Lesson, LessonResource } from "@/lib/types";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Video,
  Link,
  Image,
  Volume2,
  Clock,
  BookOpen,
  Target,
  Eye,
  PlayCircle,
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";

interface LessonFormProps {
  lesson?: Lesson | null;
  subjectId: string;
  onSave: (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

const LessonForm = ({ lesson, subjectId, onSave, onCancel }: LessonFormProps) => {
  const { userData } = useAuth();
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [content, setContent] = useState(lesson?.content || "");
  const [difficulty, setDifficulty] = useState<Lesson["difficulty"]>(lesson?.difficulty || "medium");
  const [estimatedDuration, setEstimatedDuration] = useState(lesson?.estimatedDuration?.toString() || "30");
  const [objectives, setObjectives] = useState<string[]>(lesson?.objectives || [""]);
  const [resources, setResources] = useState<LessonResource[]>(lesson?.resources || []);
  const [order, setOrder] = useState(lesson?.order?.toString() || "1");
  const [isSaving, setIsSaving] = useState(false);

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addObjective = () => {
    setObjectives([...objectives, ""]);
  };

  const removeObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setObjectives(newObjectives);
  };

  const addResource = () => {
    setResources([
      ...resources,
      {
        id: Date.now().toString(),
        type: "link",
        title: "",
        url: "",
        description: ""
      }
    ]);
  };

  const updateResource = (index: number, field: keyof LessonResource, value: string) => {
    const newResources = [...resources];
    (newResources[index] as any)[field] = value;
    setResources(newResources);
  };

  const removeResource = (index: number) => {
    const newResources = resources.filter((_, i) => i !== index);
    setResources(newResources);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (!title.trim() || !description.trim() || !content.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      const lessonData = {
        subjectId,
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        difficulty,
        estimatedDuration: parseInt(estimatedDuration) || 30,
        objectives: objectives.filter(obj => obj.trim() !== ""),
        resources: resources.filter(res => res.title.trim() !== "" && res.url.trim() !== ""),
        order: parseInt(order) || 1,
        createdBy: userData?.uid || ""
      };
      
      await onSave(lessonData);
      toast.success(lesson ? "Lesson updated successfully!" : "Lesson created successfully!");
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error("Failed to save lesson. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getResourceIcon = (type: LessonResource["type"]) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "link": return <Link className="h-4 w-4" />;
      case "image": return <Image className="h-4 w-4" />;
      case "audio": return <Volume2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle>{lesson ? "Edit Lesson" : "Create New Lesson"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Lesson Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the lesson"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Lesson Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the full lesson content here..."
              className="min-h-[200px]"
              required
            />
            <p className="text-sm text-muted-foreground">
              You can use Markdown formatting for rich text content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: Lesson["difficulty"]) => setDifficulty(value)}>
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
              <Label htmlFor="duration">Estimated Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="30"
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="space-y-2">
            <Label>Learning Objectives</Label>
            {objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder={`Learning objective ${index + 1}`}
                />
                {objectives.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addObjective}>
              <Plus className="mr-2 h-4 w-4" />
              Add Objective
            </Button>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <Label>Additional Resources</Label>
            {resources.map((resource, index) => (
              <Card key={resource.id} className="cosmic-card p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Resource Type</Label>
                      <Select 
                        value={resource.type} 
                        onValueChange={(value: LessonResource["type"]) => updateResource(index, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="link">Web Link</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={resource.title}
                        onChange={(e) => updateResource(index, "title", e.target.value)}
                        placeholder="Resource title"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={resource.url}
                      onChange={(e) => updateResource(index, "url", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Input
                      value={resource.description || ""}
                      onChange={(e) => updateResource(index, "description", e.target.value)}
                      placeholder="Optional description"
                      className="flex-1 mr-2"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeResource(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addResource}>
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
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
                {lesson ? "Update Lesson" : "Create Lesson"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

interface LessonManagementProps {
  subjectId: string;
}

export function LessonManagement({ subjectId }: LessonManagementProps) {
  const { userData } = useAuth();
  const { subjects } = useFirestore();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter and paginate lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lessons, searchTerm]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  
  const paginatedLessons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLessons, currentPage, itemsPerPage]);

  useEffect(() => {
    loadLessons();
  }, [subjectId]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls to load lessons
      // For now, using mock data
      const mockLessons: Lesson[] = [
        {
          id: "1",
          subjectId: subjectId,
          title: "Introduction to Algebra",
          description: "Learn the basics of algebraic expressions and equations",
          content: "# Introduction to Algebra\n\nAlgebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols...",
          order: 1,
          difficulty: "easy",
          estimatedDuration: 45,
          objectives: ["Understand algebraic expressions", "Solve simple equations"],
          resources: [
            {
              id: "1",
              type: "video",
              title: "Algebra Basics Video",
              url: "https://example.com/video",
              description: "Visual introduction to algebra"
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userData?.uid || ""
        },
        {
          id: "2",
          subjectId: subjectId,
          title: "Solving Linear Equations",
          description: "Master the art of solving linear equations step by step",
          content: "# Solving Linear Equations\n\nLinear equations are equations where the highest power of the variable is 1...",
          order: 2,
          difficulty: "medium",
          estimatedDuration: 60,
          objectives: ["Solve single-variable linear equations", "Check solutions"],
          resources: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: userData?.uid || ""
        }
      ];

      setLessons(mockLessons);
    } catch (error) {
      console.error("Error loading lessons:", error);
      toast.error("Failed to load lessons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">) => {
    try {
      // TODO: Implement actual API call to create lesson
      console.log("Creating lesson:", lessonData);
      setIsCreating(false);
      loadLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  };

  const handleUpdateLesson = async (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">) => {
    if (!editingLesson) return;
    
    try {
      // TODO: Implement actual API call to update lesson
      console.log("Updating lesson:", lessonData);
      setEditingLesson(null);
      loadLessons();
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      // TODO: Implement actual API call to delete lesson
      console.log("Deleting lesson:", id);
      toast.success("Lesson deleted successfully!");
      loadLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Failed to delete lesson. Please try again.");
    } finally {
      setDeletingLesson(null);
    }
  };

  const getDifficultyColor = (difficulty: Lesson["difficulty"]) => {
    switch (difficulty) {
      case "easy": return "bg-success";
      case "medium": return "bg-xp-primary";
      case "hard": return "bg-destructive";
      default: return "bg-muted";
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
        <h2 className="text-2xl font-display font-bold">Lesson Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingLesson}>
            <Plus className="mr-2 h-4 w-4" />
            Create Lesson
          </Button>
        </div>
      </div>

      {(isCreating || editingLesson) && (
        <LessonForm
          lesson={editingLesson}
          subjectId={subjectId}
          onSave={editingLesson ? handleUpdateLesson : handleCreateLesson}
          onCancel={() => {
            setIsCreating(false);
            setEditingLesson(null);
          }}
        />
      )}

      {filteredLessons.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Lessons Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "No lessons match your search criteria." : "Create your first lesson to get started."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsCreating(true)}
              disabled={isCreating || !!editingLesson}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Lesson
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLessons.map((lesson) => (
              <Card key={lesson.id} className="cosmic-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={`${getDifficultyColor(lesson.difficulty)} text-white text-xs`}
                        >
                          {lesson.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Order: {lesson.order}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingLesson(lesson)}
                        disabled={isCreating || !!editingLesson}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingLesson(lesson.id)}
                        disabled={deletingLesson === lesson.id}
                      >
                        {deletingLesson === lesson.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{lesson.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{lesson.estimatedDuration} minutes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{lesson.objectives.length} objectives</span>
                    </div>
                    
                    {lesson.resources && lesson.resources.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{lesson.resources.length} resources</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      Preview
                    </Button>
                    <Button variant="cosmic" size="sm" className="flex-1">
                      <PlayCircle className="mr-2 h-3 w-3" />
                      Assign
                    </Button>
                  </div>
                </CardFooter>
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