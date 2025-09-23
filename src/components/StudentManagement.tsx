import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useFirestore } from "@/contexts/FirestoreContext";
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  BarChart3, 
  Trophy, 
  Clock,
  BookOpen,
  Target,
  Star,
  TrendingUp,
  UserPlus,
  Settings,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";

interface Student {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  class?: string;
  age?: string;
  xp: number;
  level: number;
  streak: number;
  lastLoginAt: Date;
}

interface StudentPerformance {
  student: Student;
  completedLessons: number;
  totalLessons: number;
  completedQuizzes: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
}

export function StudentManagement() {
  const { userData } = useAuth();
  const { subjects } = useFirestore();
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Form states for adding students
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls to load students
      // For now, using mock data
      const mockStudents: Student[] = [
        {
          uid: "1",
          displayName: "Alice Johnson",
          email: "alice@example.com",
          photoURL: "/placeholder.svg",
          class: "Grade 6",
          age: "12",
          xp: 1250,
          level: 3,
          streak: 5,
          lastLoginAt: new Date()
        },
        {
          uid: "2",
          displayName: "Bob Smith",
          email: "bob@example.com",
          class: "Grade 7",
          age: "13",
          xp: 890,
          level: 2,
          streak: 2,
          lastLoginAt: new Date()
        },
        {
          uid: "3",
          displayName: "Carol Brown",
          email: "carol@example.com",
          class: "Grade 6",
          age: "12",
          xp: 1580,
          level: 4,
          streak: 8,
          lastLoginAt: new Date()
        }
      ];

      const mockPerformance: StudentPerformance[] = mockStudents.map(student => ({
        student,
        completedLessons: Math.floor(Math.random() * 20) + 5,
        totalLessons: 25,
        completedQuizzes: Math.floor(Math.random() * 10) + 2,
        averageScore: Math.floor(Math.random() * 30) + 70,
        timeSpent: Math.floor(Math.random() * 100) + 50,
        lastActivity: new Date()
      }));

      setStudents(mockStudents);
      setStudentPerformance(mockPerformance);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentEmail || selectedSubjects.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Implement actual API call to add student
      toast.success("Student invitation sent!");
      setNewStudentEmail("");
      setSelectedSubjects([]);
      setIsAddStudentOpen(false);
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to send invitation");
    }
  };

  const handleInviteStudents = async () => {
    if (!inviteMessage.trim()) {
      toast.error("Please enter an invitation message");
      return;
    }

    try {
      // TODO: Implement bulk invitation
      toast.success("Invitations sent to all students!");
      setInviteMessage("");
      setIsInviteOpen(false);
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations");
    }
  };

  // Filter students based on search and class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getPerformanceForStudent = (studentId: string) => {
    return studentPerformance.find(p => p.student.uid === studentId);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Student Management</h2>
          <p className="text-muted-foreground">Manage your students and track their progress</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Bulk Invite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Bulk Invitation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-message">Invitation Message</Label>
                  <textarea
                    id="invite-message"
                    className="w-full p-3 border rounded-md resize-none h-32"
                    placeholder="Enter your invitation message for students..."
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteStudents}>Send Invitations</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
            <DialogTrigger asChild>
              <Button variant="cosmic">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student-email">Student Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@example.com"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Select Subjects</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSubjects([...selectedSubjects, subject.id]);
                            } else {
                              setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                            }
                          }}
                        />
                        <Label htmlFor={subject.id} className="text-sm">
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="cosmic-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Grade 6">Grade 6</SelectItem>
                <SelectItem value="Grade 7">Grade 7</SelectItem>
                <SelectItem value="Grade 8">Grade 8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredStudents.length === 0 ? (
            <Card className="cosmic-card">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No Students Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No students match your search criteria." : "Start by adding students to your classes."}
                </p>
                <Button onClick={() => setIsAddStudentOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Your First Student
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.map((student) => {
                const performance = getPerformanceForStudent(student.uid);
                return (
                  <Card key={student.uid} className="cosmic-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.photoURL} />
                            <AvatarFallback>
                              {student.displayName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{student.displayName}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Level</span>
                          <Badge variant="secondary">Level {student.level}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">XP</span>
                          <span className="font-semibold">{student.xp}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Streak</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-xp-primary" />
                            <span className="font-semibold">{student.streak}</span>
                          </div>
                        </div>

                        {performance && (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{Math.round((performance.completedLessons / performance.totalLessons) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(performance.completedLessons / performance.totalLessons) * 100} 
                                className="h-2" 
                              />
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Avg Score</span>
                              <span className="font-semibold">{performance.averageScore}%</span>
                            </div>
                          </>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Student Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPerformance.map((performance) => (
                  <div key={performance.student.uid} className="cosmic-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={performance.student.photoURL} />
                          <AvatarFallback>
                            {performance.student.displayName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{performance.student.displayName}</h4>
                          <p className="text-sm text-muted-foreground">{performance.student.class}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Level {performance.student.level}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-1 text-primary" />
                        <div className="text-2xl font-bold">{performance.completedLessons}</div>
                        <div className="text-xs text-muted-foreground">Lessons</div>
                      </div>
                      <div className="text-center">
                        <Target className="h-6 w-6 mx-auto mb-1 text-primary" />
                        <div className="text-2xl font-bold">{performance.completedQuizzes}</div>
                        <div className="text-xs text-muted-foreground">Quizzes</div>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-1 text-success" />
                        <div className="text-2xl font-bold">{performance.averageScore}%</div>
                        <div className="text-xs text-muted-foreground">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <Clock className="h-6 w-6 mx-auto mb-1 text-primary" />
                        <div className="text-2xl font-bold">{performance.timeSpent}m</div>
                        <div className="text-xs text-muted-foreground">Time Spent</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Advanced analytics dashboard coming soon...
                <br />
                You'll see detailed charts and insights about student performance here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}