import { useState } from "react";
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
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  PieChart
} from "lucide-react";
import { useFirestore } from "@/contexts/FirestoreContext";
import { Quiz, UserQuizAttempt, Subject } from "@/lib/types";
import { format, subDays, subMonths } from "date-fns";

interface ReportFilters {
  dateRange: "week" | "month" | "quarter" | "year";
  subjectId?: string;
  classId?: string;
  studentId?: string;
}

interface ClassReport {
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageCompletionRate: number;
  averageScore: number;
  totalQuizzes: number;
  totalAttempts: number;
}

interface StudentReport {
  studentId: string;
  studentName: string;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  timeSpent: number;
  lastActivity: Date;
 streak: number;
}

export function EducatorReports() {
  const { subjects, userQuizAttempts } = useFirestore();
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: "month"
  });
  const [classReports, setClassReports] = useState<ClassReport[]>([]);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReport = () => {
    setLoading(true);
    
    // Simulate report generation
    setTimeout(() => {
      // Generate class reports
      const classReports: ClassReport[] = [
        {
          className: "Grade 6 - Section A",
          totalStudents: 25,
          activeStudents: 22,
          averageCompletionRate: 78,
          averageScore: 82,
          totalQuizzes: 15,
          totalAttempts: 330
        },
        {
          className: "Grade 7 - Section B",
          totalStudents: 28,
          activeStudents: 25,
          averageCompletionRate: 85,
          averageScore: 88,
          totalQuizzes: 18,
          totalAttempts: 375
        },
        {
          className: "Grade 8 - Section C",
          totalStudents: 22,
          activeStudents: 20,
          averageCompletionRate: 72,
          averageScore: 75,
          totalQuizzes: 12,
          totalAttempts: 240
        }
      ];
      
      setClassReports(classReports);
      
      // Generate student reports
      const studentReports: StudentReport[] = [
        {
          studentId: "student1",
          studentName: "Alice Johnson",
          totalQuizzes: 15,
          completedQuizzes: 14,
          averageScore: 92,
          timeSpent: 1200,
          lastActivity: new Date(),
          streak: 12
        },
        {
          studentId: "student2",
          studentName: "Bob Smith",
          totalQuizzes: 15,
          completedQuizzes: 12,
          averageScore: 78,
          timeSpent: 950,
          lastActivity: subDays(new Date(), 1),
          streak: 5
        },
        {
          studentId: "student3",
          studentName: "Carol Brown",
          totalQuizzes: 15,
          completedQuizzes: 15,
          averageScore: 95,
          timeSpent: 1420,
          lastActivity: new Date(),
          streak: 18
        }
      ];
      
      setStudentReports(studentReports);
      setLoading(false);
    }, 1000);
  };

  const exportReport = () => {
    // In a real implementation, this would generate and download a CSV or PDF report
    alert("Report exported successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Educator Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={generateReport} disabled={loading}>
            {loading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-transparent" />
            ) : (
              <Filter className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="cosmic-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.dateRange === "week" 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setFilters({...filters, dateRange: "week"})}
                >
                  Week
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.dateRange === "month" 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setFilters({...filters, dateRange: "month"})}
                >
                  Month
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.dateRange === "quarter" 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setFilters({...filters, dateRange: "quarter"})}
                >
                  Quarter
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-sm ${
                    filters.dateRange === "year" 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setFilters({...filters, dateRange: "year"})}
                >
                  Year
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={filters.subjectId || ""}
                onChange={(e) => setFilters({...filters, subjectId: e.target.value || undefined})}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Class</label>
              <select 
                className="w-full p-2 border rounded-md bg-background"
                value={filters.classId || ""}
                onChange={(e) => setFilters({...filters, classId: e.target.value || undefined})}
              >
                <option value="">All Classes</option>
                <option value="class1">Grade 6 - Section A</option>
                <option value="class2">Grade 7 - Section B</option>
                <option value="class3">Grade 8 - Section C</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Class Reports */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Class Performance Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Generate a report to see class performance data
            </div>
          ) : (
            <div className="space-y-4">
              {classReports.map((report, index) => (
                <div key={index} className="cosmic-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{report.className}</h3>
                    <Badge variant="secondary">{report.totalStudents} students</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{report.activeStudents}</div>
                      <div className="text-xs text-muted-foreground">Active Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{report.averageCompletionRate}%</div>
                      <div className="text-xs text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{report.averageScore}%</div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{report.totalAttempts}</div>
                      <div className="text-xs text-muted-foreground">Total Attempts</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Student Engagement</span>
                      <span>{Math.round((report.activeStudents / report.totalStudents) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(report.activeStudents / report.totalStudents) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Student Reports */}
      <Card className="cosmic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Top Performing Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentReports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Generate a report to see student performance data
            </div>
          ) : (
            <div className="space-y-4">
              {studentReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 cosmic-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{report.studentName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.studentName}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{report.completedQuizzes}/{report.totalQuizzes} quizzes</span>
                        <span>•</span>
                        <span>Streak: {report.streak} days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{report.averageScore}%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.round(report.timeSpent / 60)}m spent
                      </div>
                    </div>
                    <Badge variant={report.averageScore > 90 ? "default" : report.averageScore > 80 ? "secondary" : "outline"}>
                      {report.averageScore > 90 ? "Excellent" : report.averageScore > 80 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}