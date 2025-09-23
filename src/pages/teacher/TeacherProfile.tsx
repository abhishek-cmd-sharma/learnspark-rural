import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  Target
} from "lucide-react";
import { Header } from "@/components/Header";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";

export const TeacherProfile: React.FC = () => {
  const { userProfile, teacherProfile, loading } = useProfile();
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
  
  if (loading) {
    return (
      <RoleProtectedRoute allowedRoles={["teacher"]}>
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
    <RoleProtectedRoute allowedRoles={["teacher"]}>
      <div className="min-h-screen cosmic-bg">
        <Header />
        
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Teacher Profile</h1>
              <p className="text-muted-foreground">Manage your teaching profile and preferences</p>
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
                      {getUserInitials(userProfile?.displayName || userProfile?.email || "T")}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{userProfile?.displayName || "Teacher"}</CardTitle>
                  <CardDescription>{userProfile?.email}</CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      Teacher
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{teacherProfile?.school || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{teacherProfile?.location || "Not specified"}</span>
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
                      {teacherProfile?.yearsOfExperience || 0} years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">
                      {teacherProfile?.rating?.toFixed(1) || "0.0"} rating 
                      ({teacherProfile?.totalRatings || 0} reviews)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teaching Information */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Teaching Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-muted-foreground">
                      {teacherProfile?.bio || "No bio provided yet. Add a bio to tell students about yourself!"}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Qualifications</h4>
                      {teacherProfile?.qualifications && teacherProfile.qualifications.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {teacherProfile.qualifications.map((qual, index) => (
                            <Badge key={index} variant="outline">{qual}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No qualifications added yet</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Specializations</h4>
                      {teacherProfile?.specializations && teacherProfile.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {teacherProfile.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">{spec}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No specializations added yet</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold mb-3">Teaching Languages</h4>
                    {teacherProfile?.teachingLanguages && teacherProfile.teachingLanguages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {teacherProfile.teachingLanguages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50">{lang}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No teaching languages specified</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Teaching Statistics */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Teaching Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 cosmic-card">
                      <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center p-4 cosmic-card">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-muted-foreground">Lessons</div>
                    </div>
                    <div className="text-center p-4 cosmic-card">
                      <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-muted-foreground">Quizzes</div>
                    </div>
                    <div className="text-center p-4 cosmic-card">
                      <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <div className="text-2xl font-bold">{teacherProfile?.rating?.toFixed(1) || "0.0"}</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Availability */}
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherProfile?.availability && Object.entries(teacherProfile.availability).map(([day, times]) => (
                      <div key={day} className="flex justify-between items-center p-3 cosmic-card">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-sm text-muted-foreground">
                          {times.start} - {times.end}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleProtectedRoute>
  );
};

export default TeacherProfile;