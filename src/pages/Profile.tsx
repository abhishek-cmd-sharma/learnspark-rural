import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  History,
  Users,
  MapPin,
  Mail,
  School,
  Clock,
  Settings,
  Download,
  Share2,
  LogOut,
  Sparkles,
  Star,
  Heart,
  Zap,
  Crown,
  Medal,
  Rocket
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/authService";
import { toast } from "sonner";

export default function Profile() {
  const { userProfile, studentProfile, teacherProfile, loading } = useProfile();
  const { currentUser, userData } = useAuth();
  
  // Default values for when data is not available
  const userStats = {
    totalXP: studentProfile?.xp || 0,
    level: studentProfile?.level || 1,
    studyStreak: studentProfile?.streak || 0,
    gems: 0, // This would need to be added to the data model
    badges: studentProfile?.achievements?.length || 0,
    rank: 1, // This would need to be calculated
    totalUsers: 100 // This would need to be fetched
  };

  const profileData = {
    name: userProfile?.displayName || currentUser?.displayName || "User",
    email: userProfile?.email || currentUser?.email || "",
    school: studentProfile?.school || teacherProfile?.school || "Not specified",
    location: studentProfile?.location || teacherProfile?.location || "Not specified",
    joined: userProfile?.createdAt ? new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long"
    }).format(userProfile.createdAt) : "Recently",
    language: userProfile?.preferences?.language || "en",
    class: studentProfile?.gradeLevel || "Not specified",
    studentId: currentUser?.uid?.slice(-8) || "N/A"
  };

  const learningPreferences = {
    studyTime: "Not set", // This would need to be added to preferences
    difficulty: "Medium", // This would need to be added to preferences
    dailyGoal: "30 minutes", // This would need to be added to preferences
    offlineMode: true,
    reminders: userProfile?.preferences?.notifications?.push || false
  };

  // Use real achievements if available, otherwise show empty state
  const achievements = studentProfile?.achievements || [];

  // Mock data for learning history - this would need to be implemented in the backend
  const [learningHistory] = useState([]);

  // Mock data for subject progress - this would need to be implemented
  const [subjectProgress] = useState([]);

  const getColorClass = (color: string, type: "bg" | "text" | "border") => {
    switch (color) {
      case "blue": 
        return type === "bg" ? "bg-blue-500" : type === "text" ? "text-blue-500" : "border-blue-500";
      case "green": 
        return type === "bg" ? "bg-green-500" : type === "text" ? "text-green-500" : "border-green-500";
      case "pink": 
        return type === "bg" ? "bg-pink-500" : type === "text" ? "text-pink-500" : "border-pink-500";
      default: 
        return type === "bg" ? "bg-gray-500" : type === "text" ? "text-gray-500" : "border-gray-500";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "gold": return "bg-yellow-400 text-yellow-900";
      case "silver": return "bg-gray-300 text-gray-800";
      case "bronze": return "bg-amber-700 text-amber-100";
      case "platinum": return "bg-purple-400 text-purple-900";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const editProfile = () => {
    alert("Edit profile feature coming soon!");
  };

  const downloadProgress = () => {
    alert("Downloading progress report...");
  };

  const shareProfile = () => {
    alert("Sharing profile feature coming soon!");
  };

  const handleLogout = async () => {
    try {
      if (confirm("Are you sure you want to logout?")) {
        await logout();
        toast.success("You have been logged out successfully");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-10"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {["🌟", "⭐", "✨", "💫", "🚀", "🏆", "🎯", "🎖️", "🏅", "👑"][Math.floor(Math.random() * 10)]}
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-3">
              👤 My Profile 👤
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your learning journey, achievements, and progress!
            </p>
          </motion.div>
          
          {/* Profile Header */}
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white mb-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <motion.div 
                className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                👤
              </motion.div>
              <div className="flex-1 text-center md:text-left">
                <motion.h2 
                  className="text-3xl font-bold mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {profileData.name} 🌟
                </motion.h2>
                <motion.p 
                  className="opacity-90 mb-4 text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {profileData.class} • Student ID: {profileData.studentId}
                </motion.p>
                <motion.div 
                  className="flex flex-wrap justify-center md:justify-start gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">Level {userStats.level}</div>
                    <div className="text-sm opacity-75">Scholar</div>
                  </div>
                  <div className="text-center bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">{userStats.totalXP}</div>
                    <div className="text-sm opacity-75">Total XP</div>
                  </div>
                  <div className="text-center bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">{userStats.studyStreak}</div>
                    <div className="text-sm opacity-75">Day Streak</div>
                  </div>
                  <div className="text-center bg-white/20 rounded-xl p-3">
                    <div className="text-2xl font-bold">#{userStats.rank}</div>
                    <div className="text-sm opacity-75">Class Rank</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Profile Content */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profileData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <School className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">School</p>
                        <p className="font-medium">{profileData.school}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="bg-green-100 p-2 rounded-full">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{profileData.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="font-medium">{profileData.joined}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Learning Preferences */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-600">
                      <Target className="w-5 h-5" />
                      Learning Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-pink-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Preferred Study Time</p>
                      <p className="font-medium">{learningPreferences.studyTime}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Difficulty Level</p>
                      <p className="font-medium">{learningPreferences.difficulty}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Daily Goal</p>
                      <p className="font-medium">{learningPreferences.dailyGoal}</p>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                      <input 
                        type="checkbox" 
                        checked={learningPreferences.offlineMode} 
                        readOnly 
                        className="rounded text-green-600" 
                      />
                      <span className="text-sm">Enable offline mode</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl">
                      <input 
                        type="checkbox" 
                        checked={learningPreferences.reminders} 
                        readOnly 
                        className="rounded text-yellow-600" 
                      />
                      <span className="text-sm">Daily reminders</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                    Learning Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div 
                      className="bg-blue-50 rounded-xl p-4 text-center border-2 border-blue-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-blue-600">378</div>
                      <div className="text-sm text-gray-600">Questions Solved</div>
                    </motion.div>
                    <motion.div 
                      className="bg-green-50 rounded-xl p-4 text-center border-2 border-green-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <div className="text-sm text-gray-600">Avg. Accuracy</div>
                    </motion.div>
                    <motion.div 
                      className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-purple-600">45h</div>
                      <div className="text-sm text-gray-600">Study Time</div>
                    </motion.div>
                    <motion.div 
                      className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-sm text-gray-600">Achievements</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-yellow-600">
                  <Award className="w-6 h-6" />
                  Your Achievements
                </h3>
                <Badge variant="secondary" className="text-lg py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  {achievements.length} Unlocked
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-yellow-100">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start">
                          <div className="text-4xl">{achievement.icon}</div>
                          <Badge className={`${getRarityColor(achievement.rarity)} rounded-full`}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-lg mt-3">{achievement.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-500">Unlocked {achievement.date}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learning History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6 text-green-600">
                <History className="w-6 h-6" />
                Learning History
              </h3>
              <div className="space-y-3">
                {learningHistory.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm rounded-xl border-l-4 border-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{activity.activity}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs rounded-full">
                                {activity.subject}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {activity.date} at {activity.time}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">+{activity.xp} XP</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Subject Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6 text-blue-600">
                <BookOpen className="w-6 h-6" />
                Subject Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectProgress.map((subject, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                        <CardTitle className="flex items-center justify-between">
                          <span>{subject.name}</span>
                          <Badge className="bg-white text-purple-600">Level {subject.level}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-semibold">{subject.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <motion.div
                                className={`h-3 rounded-full ${getColorClass(subject.color, "bg")}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                              ></motion.div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <div className="text-gray-500">Total XP</div>
                              <div className="font-semibold">{subject.xp}</div>
                            </div>
                            <div className="bg-green-50 p-2 rounded-lg">
                              <div className="text-gray-500">Accuracy</div>
                              <div className="font-semibold">{subject.accuracy}%</div>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full rounded-full border-purple-300 text-purple-600 hover:bg-purple-50" asChild>
                            <Link to={`/subject/${subject.name.toLowerCase()}`}>
                              View Subject
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-6 text-gray-700">
                <Settings className="w-6 h-6" />
                Account Settings
              </h3>
              <Card className="bg-white/90 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Edit Profile</p>
                          <p className="text-sm text-gray-500">Update your personal information</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={editProfile} className="rounded-full border-purple-300 text-purple-600 hover:bg-purple-100">
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Download Progress Report</p>
                          <p className="text-sm text-gray-500">Get detailed analytics of your learning</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={downloadProgress} className="rounded-full border-blue-300 text-blue-600 hover:bg-blue-100">
                        Download
                      </Button>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-green-50 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Share Profile</p>
                          <p className="text-sm text-gray-500">Share your achievements with others</p>
                        </div>
                      </div>
                      <Button variant="outline" onClick={shareProfile} className="rounded-full border-green-300 text-green-600 hover:bg-green-100">
                        Share
                      </Button>
                    </motion.div>
                    <motion.div 
                      className="flex items-center justify-between p-4 bg-red-50 rounded-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-600">Logout</p>
                          <p className="text-sm text-gray-500">Sign out of your account</p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={handleLogout} className="rounded-full">
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button 
                onClick={editProfile} 
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full px-6 py-3"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button 
                onClick={downloadProgress} 
                variant="outline" 
                className="flex items-center gap-2 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-3"
              >
                <Download className="w-4 h-4" />
                Download Progress Report
              </Button>
              <Button 
                onClick={shareProfile} 
                variant="outline" 
                className="flex items-center gap-2 rounded-full border-green-300 text-green-600 hover:bg-green-50 px-6 py-3"
              >
                <Share2 className="w-4 h-4" />
                Share Profile
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="destructive" 
                className="flex items-center gap-2 rounded-full px-6 py-3"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}