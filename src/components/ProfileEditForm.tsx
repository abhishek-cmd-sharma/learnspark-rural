import React, { useState, useEffect } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Languages, Target, Clock } from "lucide-react";

export const ProfileEditForm: React.FC = () => {
  const { userProfile, studentProfile, teacherProfile, updateUserProfile, updateStudentProfile, updateTeacherProfile, updateUserPreferences } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User profile state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  
  // Student profile state
  const [age, setAge] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [school, setSchool] = useState("");
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [targetLanguages, setTargetLanguages] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  
  // Teacher profile state
 const [qualifications, setQualifications] = useState("");
  const [specializations, setSpecializations] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");
  const [teachingLanguages, setTeachingLanguages] = useState("");
  
  // Preferences state
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Initialize form with profile data
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setEmail(userProfile.email || "");
      setLocation(userProfile.preferences?.timezone?.split("/")[0] || "");
      
      setLanguage(userProfile.preferences?.language || "en");
      setTimezone(userProfile.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
      setEmailNotifications(userProfile.preferences?.notifications?.email ?? true);
      setPushNotifications(userProfile.preferences?.notifications?.push ?? true);
    }
    
    if (studentProfile) {
      setAge(studentProfile.age?.toString() || "");
      setGradeLevel(studentProfile.gradeLevel || "");
      setSchool(studentProfile.school || "");
      setNativeLanguage(studentProfile.nativeLanguage || "");
      setTargetLanguages(studentProfile.targetLanguages?.join(", ") || "");
      setLearningGoals(studentProfile.learningGoals?.join(", ") || "");
    }
    
    if (teacherProfile) {
      setQualifications(teacherProfile.qualifications?.join(", ") || "");
      setSpecializations(teacherProfile.specializations?.join(", ") || "");
      setYearsOfExperience(teacherProfile.yearsOfExperience?.toString() || "");
      setBio(teacherProfile.bio || "");
      setTeachingLanguages(teacherProfile.teachingLanguages?.join(", ") || "");
    }
  }, [userProfile, studentProfile, teacherProfile]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update user profile
      await updateUserProfile({
        displayName,
        email
      });
      
      // Update role-specific profile
      if (userProfile?.role === "student" && studentProfile) {
        await updateStudentProfile({
          age: age ? parseInt(age) : undefined,
          gradeLevel,
          school,
          location,
          nativeLanguage,
          targetLanguages: targetLanguages.split(",").map(lang => lang.trim()).filter(lang => lang),
          learningGoals: learningGoals.split(",").map(goal => goal.trim()).filter(goal => goal)
        });
      } else if (userProfile?.role === "teacher" && teacherProfile) {
        await updateTeacherProfile({
          qualifications: qualifications.split(",").map(qual => qual.trim()).filter(qual => qual),
          specializations: specializations.split(",").map(spec => spec.trim()).filter(spec => spec),
          yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
          bio,
          school,
          location,
          teachingLanguages: teachingLanguages.split(",").map(lang => lang.trim()).filter(lang => lang)
        });
      }
      
      // Update preferences
      await updateUserPreferences({
        language,
        timezone,
        notifications: {
          email: emailNotifications,
          push: pushNotifications
        }
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Update your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </div>
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    School
                  </div>
                </Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="Your school name"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Role-specific Information */}
        {userProfile?.role === "student" && studentProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Student Information
              </CardTitle>
              <CardDescription>Update your student profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Input
                    id="gradeLevel"
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    placeholder="Your grade level"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nativeLanguage">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Native Language
                    </div>
                  </Label>
                  <Input
                    id="nativeLanguage"
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    placeholder="Your native language"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetLanguages">Target Languages</Label>
                  <Input
                    id="targetLanguages"
                    value={targetLanguages}
                    onChange={(e) => setTargetLanguages(e.target.value)}
                    placeholder="Languages you want to learn (comma separated)"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="learningGoals">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Learning Goals
                  </div>
                </Label>
                <Textarea
                  id="learningGoals"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="Your learning goals (comma separated)"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {userProfile?.role === "teacher" && teacherProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Teacher Information
              </CardTitle>
              <CardDescription>Update your teacher profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    placeholder="Years of teaching experience"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teachingLanguages">Teaching Languages</Label>
                  <Input
                    id="teachingLanguages"
                    value={teachingLanguages}
                    onChange={(e) => setTeachingLanguages(e.target.value)}
                    placeholder="Languages you teach (comma separated)"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input
                    id="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="Your qualifications (comma separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specializations">Specializations</Label>
                  <Input
                    id="specializations"
                    value={specializations}
                    onChange={(e) => setSpecializations(e.target.value)}
                    placeholder="Your specializations (comma separated)"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Preferences
            </CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                    <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Submit Button */}
        <Card>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};