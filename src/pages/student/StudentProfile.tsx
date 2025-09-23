import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Star, 
  BookOpen, 
  Award,
  Edit,
  School,
  Clock,
  Target,
  Zap,
  Trophy,
  TrendingUp
} from "lucide-react";
import { Header } from "@/components/Header";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export const StudentProfile: React.FC = () => {
  const { userProfile, studentProfile, loading } = useProfile();
  const { currentUser } = useAuth();
  
  // Get user's initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };

  // Calculate level progress
  const calculateLevelProgress = (xp: number, level: number) => {
    const baseXP = 100;
    const xpForCurrentLevel = baseXP * level;
    const xpForNextLevel = baseXP * (level + 1);
    const progressInLevel = xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    return Math.max(0, Math.min(100, (progressInLevel / xpNeededForLevel) * 100));
  };
  
  if (loading) {
    return (
      <RoleProtectedRoute allowedRoles={["student"]}>
        <div className="min-h-screen cosmic-bg">
          <Header />
          <div className="container mx-auto py-8">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </RoleProtectedRoute>
    );
  }
  
  return (
    <RoleProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen cosmic-bg">
        <Header />
        
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Student Profile</h1>
              <p className="text-muted-foreground">Track your learning journey and achievements</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="cosmic">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="cosmic-card">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={userProfile?.photoURL || undefined} />
                    <AvatarFallback className="text-xl">
                      {getUserInitials(userProfile?.displayName || userProfile?.email || "S")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{userProfile?.displayName || "Student"}</CardTitle>
                  <CardDescription>{userProfile?.email}</CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                      Student
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{studentProfile?.school || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{studentProfile?.gradeLevel || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{studentProfile?.location || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Joined {userProfile?.createdAt ? formatDate(userProfile.createdAt) : "Recently"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Last streak: {studentProfile?.lastStreakDate ? formatDate(studentProfile.lastStreakDate) : "Never"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="cosmic-card mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Current Level</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">
                      Level {studentProfile?.level || 1}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Total XP</span>
                    </div>
                    <span className="font-semibold">{studentProfile?.xp || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Study Streak</span>
                    </div>
                    <span className="font-semibold">{studentProfile?.streak || 0} days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <span className="font-semibold">{studentProfile?.achievements?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Level Progress */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Level Progress
                  </CardTitle>
                  <CardDescription>
                    Level {studentProfile?.level || 1} • {studentProfile?.xp || 0} XP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Level {(studentProfile?.level || 1) + 1}</span>
                      <span>{Math.round(calculateLevelProgress(studentProfile?.xp || 0, studentProfile?.level || 1))}%</span>
                    </div>
                    <Progress 
                      value={calculateLevelProgress(studentProfile?.xp || 0, studentProfile?.level || 1)} 
                      className="h-3"
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      {100 * ((studentProfile?.level || 1) + 1) - (studentProfile?.xp || 0)} XP needed for next level
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Learning Information */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Learning Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personal Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span>{studentProfile?.age || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Native Language:</span>
                          <span>{studentProfile?.nativeLanguage || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Academic Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Grade Level:</span>
                          <span>{studentProfile?.gradeLevel || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">School:</span>
                          <span className="truncate ml-2">{studentProfile?.school || "Not specified"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Target Languages</h4>
                    {studentProfile?.targetLanguages && studentProfile.targetLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {studentProfile.targetLanguages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">{lang}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No target languages set yet</p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Learning Goals</h4>
                    {studentProfile?.learningGoals && studentProfile.learningGoals.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {studentProfile.learningGoals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50">{goal}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No learning goals set yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Proficiency Levels */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Proficiency Levels
                  </CardTitle>
                  <CardDescription>Your current skill levels across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentProfile?.proficiencyLevel && Object.entries(studentProfile.proficiencyLevel).map(([skill, level]) => {
                      const getProgressValue = (level: string) => {
                        switch (level) {
                          case "beginner": return 25;
                          case "intermediate": return 50;
                          case "advanced": return 75;
                          case "expert": return 100;
                          default: return 0;
                        }
                      };

                      const getColorClass = (level: string) => {
                        switch (level) {
                          case "beginner": return "bg-red-500";
                          case "intermediate": return "bg-yellow-500";
                          case "advanced": return "bg-blue-500";
                          case "expert": return "bg-green-500";
                          default: return "bg-gray-500";
                        }
                      };

                      return (
                        <div key={skill} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{skill}</span>
                            <Badge variant="outline" className={`${getColorClass(level)} text-white border-none`}>
                              {level}
                            </Badge>
                          </div>
                          <Progress value={getProgressValue(level)} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Your earned badges and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentProfile?.achievements && studentProfile.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {studentProfile.achievements.map((achievement, index) => (
                        <div key={index} className="p-4 cosmic-card border-l-4 border-yellow-400">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl">
                              🏆
                            </div>
                            <div>
                              <h4 className="font-semibold">{achievement.name || "Achievement"}</h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description || "Great job!"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Earned: {achievement.earnedAt ? formatDate(achievement.earnedAt) : "Recently"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No achievements yet</p>
                      <p className="text-sm mt-2">Complete quizzes and lessons to earn your first achievement!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enrolled Classes */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Enrolled Classes
                  </CardTitle>
                  <CardDescription>Classes you're currently enrolled in</CardDescription>
                </CardHeader>
                <CardContent>
                  {studentProfile?.enrolledClasses && studentProfile.enrolledClasses.length > 0 ? (
                    <div className="space-y-3">
                      {studentProfile.enrolledClasses.map((classId, index) => (
                        <div key={index} className="p-3 cosmic-card">
                          <div className="font-medium">Class ID: {classId}</div>
                          <div className="text-sm text-muted-foreground">
                            Click to view class details
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Not enrolled in any classes yet</p>
                      <p className="text-sm mt-2">Ask your teacher for a class code to join!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default StudentProfile;