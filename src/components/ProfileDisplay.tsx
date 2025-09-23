import React from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Languages, 
  Target, 
  Clock, 
  Star, 
  BookOpen, 
  Award,
  Edit
} from "lucide-react";

export const ProfileDisplay: React.FC<{ onEdit?: () => void }> = ({ onEdit }) => {
  const { userProfile, studentProfile, teacherProfile } = useProfile();
  
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
  
  // Render user profile information
  const renderUserProfile = () => {
    if (!userProfile) return null;
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile.photoURL || undefined} />
              <AvatarFallback className="text-xl">
                {getUserInitials(userProfile.displayName || userProfile.email || "U")}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              className="mt-4 w-full"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{userProfile.displayName || "User"}</h2>
              <Badge variant="secondary" className="mt-1">
                {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{userProfile.email}</span>
              </div>
              
              {userProfile.preferences?.timezone && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{userProfile.preferences.timezone.split("/")[1] || userProfile.preferences.timezone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {formatDate(userProfile.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Last login: {formatDate(userProfile.lastLoginAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span>{userProfile.preferences?.language || "en"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span>{userProfile.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Notifications</span>
                <span>{userProfile.preferences?.notifications?.email ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Push Notifications</span>
                <span>{userProfile.preferences?.notifications?.push ? "Enabled" : "Disabled"}</span>
              </div>
            </CardContent>
          </Card>
          
          {userProfile.role === "student" && studentProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span>{studentProfile.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade Level</span>
                  <span>{studentProfile.gradeLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">School</span>
                  <span>{studentProfile.school}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Native Language</span>
                  <span>{studentProfile.nativeLanguage}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Languages</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {studentProfile.targetLanguages.map((lang, index) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Learning Goals</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {studentProfile.learningGoals.map((goal, index) => (
                      <Badge key={index} variant="outline">{goal}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {userProfile.role === "teacher" && teacherProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Teacher Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Years of Experience</span>
                  <span>{teacherProfile.yearsOfExperience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">School</span>
                  <span>{teacherProfile.school}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Qualifications</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacherProfile.qualifications.map((qual, index) => (
                      <Badge key={index} variant="outline">{qual}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Specializations</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacherProfile.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">{spec}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Teaching Languages</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacherProfile.teachingLanguages.map((lang, index) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{teacherProfile.rating.toFixed(1)} ({teacherProfile.totalRatings} ratings)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and manage your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        {userProfile ? (
          renderUserProfile()
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Loading profile information...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};