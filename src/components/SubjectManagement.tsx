import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore } from "@/contexts/FirestoreContext";
import { Subject } from "@/lib/types";
import { Plus, Edit, Trash2, Save, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SubjectFormProps {
  subject?: Subject | null;
  onSave: (subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

const SubjectForm = ({ subject, onSave, onCancel }: SubjectFormProps) => {
  const [name, setName] = useState(subject?.name || "");
  const [description, setDescription] = useState(subject?.description || "");
  const [icon, setIcon] = useState(subject?.icon || "");
  const [color, setColor] = useState(subject?.color || "subject-math");
  const [level, setLevel] = useState(subject?.level.toString() || "1");
  const [totalLessons, setTotalLessons] = useState(subject?.totalLessons.toString() || "10");
  const [completedLessons, setCompletedLessons] = useState(subject?.completedLessons.toString() || "0");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const subjectData = {
        name,
        description,
        icon,
        color,
        level: parseInt(level),
        progress: Math.round((parseInt(completedLessons) / parseInt(totalLessons)) * 100),
        totalLessons: parseInt(totalLessons),
        completedLessons: parseInt(completedLessons)
      };
      
      await onSave(subjectData);
      toast.success(subject ? "Subject updated successfully!" : "Subject created successfully!");
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error("Failed to save subject. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="cosmic-card">
      <CardHeader>
        <CardTitle>{subject ? "Edit Subject" : "Create New Subject"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter subject description"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Enter icon class or name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color Theme</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a color theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject-math">Mathematics</SelectItem>
                <SelectItem value="subject-english">English</SelectItem>
                <SelectItem value="subject-science">Science</SelectItem>
                <SelectItem value="subject-history">History</SelectItem>
                <SelectItem value="subject-geography">Geography</SelectItem>
                <SelectItem value="subject-general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                type="number"
                min="1"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalLessons">Total Lessons</Label>
              <Input
                id="totalLessons"
                type="number"
                min="1"
                value={totalLessons}
                onChange={(e) => setTotalLessons(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="completedLessons">Completed Lessons</Label>
            <Input
              id="completedLessons"
              type="number"
              min="0"
              max={totalLessons}
              value={completedLessons}
              onChange={(e) => setCompletedLessons(e.target.value)}
              required
            />
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
                {subject ? "Update Subject" : "Create Subject"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export function SubjectManagement() {
  const { subjects, createSubject, updateSubject, deleteSubject } = useFirestore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 6 subjects per page

  // Filter and paginate subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  
  const paginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  const handleCreateSubject = async (subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createSubject(subjectData);
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  };

  const handleUpdateSubject = async (subjectData: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    if (!editingSubject) return;
    
    try {
      await updateSubject(editingSubject.id, subjectData);
      setEditingSubject(null);
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await deleteSubject(id);
      toast.success("Subject deleted successfully!");
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject. Please try again.");
    } finally {
      setDeletingSubject(null);
    }
  };

  // Reset to first page when search term changes
 useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-display font-bold">Subject Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreating(true)} disabled={isCreating || !!editingSubject}>
            <Plus className="mr-2 h-4 w-4" />
            Create Subject
          </Button>
        </div>
      </div>

      {(isCreating || editingSubject) && (
        <SubjectForm
          subject={editingSubject}
          onSave={editingSubject ? handleUpdateSubject : handleCreateSubject}
          onCancel={() => {
            setIsCreating(false);
            setEditingSubject(null);
          }}
        />
      )}

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? "No subjects found matching your search." : "No subjects available."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setIsCreating(true)}
              className="mt-4"
              disabled={isCreating || !!editingSubject}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Subject
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSubjects.map((subject) => (
              <Card key={subject.id} className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{subject.name}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSubject(subject)}
                        disabled={isCreating || !!editingSubject}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingSubject(subject.id)}
                        disabled={deletingSubject === subject.id}
                      >
                        {deletingSubject === subject.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{subject.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-semibold">{subject.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-semibold">{subject.progress}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lessons:</span>
                      <span className="font-semibold">{subject.completedLessons}/{subject.totalLessons}</span>
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