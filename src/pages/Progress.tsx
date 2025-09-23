import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BookOpen,
  Clock,
  Target,
  Award,
  Calendar,
  BarChart3,
  Trophy,
  Zap,
  Star
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Progress() {
  const { user, userQuizAttempts, subjects, loadingUserQuizAttempts, loadingSubjects } = useFirestore();
  const { userData } = useAuth();
  
  const [userStats, setUserStats] = useState({
    totalXP: userData?.xp || 0,
    level: userData?.level || 1,
    studyStreak: userData?.streak || 0,
    gems: 0, // Would need to fetch from Firestore if stored there
    badges: 0, // Would need to fetch from Firestore if stored there
    rank: 0, // Would need to calculate from Firestore data
    totalUsers: 0 // Would need to fetch from Firestore if stored there
  });
  
  // Update user stats when userData changes
  useEffect(() => {
    if (userData) {
      setUserStats({
        totalXP: userData.xp || 0,
        level: userData.level || 1,
        studyStreak: userData.streak || 0,
        gems: 0, // Would need to fetch from Firestore if stored there
        badges: 0, // Would need to fetch from Firestore if stored there
        rank: 0, // Would need to calculate from Firestore data
        totalUsers: 0 // Would need to fetch from Firestore if stored there
      });
    }
  }, [userData]);
  
  // Goals state
  const [goals, setGoals] = useState([
    { id: 1, title: "Complete 5 math quizzes", target: 5, current: 3, subject: "Mathematics", deadline: "2023-06-30" },
    { id: 2, title: "Achieve 80% accuracy in English", target: 80, current: 72, subject: "English", deadline: "2023-06-15" }
  ]);
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    subject: "Mathematics",
    deadline: ""
  });

  // In a real app, this would be fetched from Firestore based on user's progress
  const [subjectProgress, setSubjectProgress] = useState([
    { name: "Mathematics", level: 9, progress: 85, color: "blue", xp: 1250, accuracy: 82, time: 18 },
    { name: "English", level: 7, progress: 72, color: "green", xp: 980, accuracy: 76, time: 15 },
    { name: "General Knowledge", level: 6, progress: 68, color: "pink", xp: 820, accuracy: 71, time: 12 }
  ]);
  
  // Update subject progress when subjects or userQuizAttempts change
  useEffect(() => {
    // This would be replaced with actual logic to calculate progress from Firestore data
    // For now, we'll keep the mock data
  }, [subjects, userQuizAttempts]);

  const [weeklyActivity] = useState([
    { day: "Mon", minutes: 45 },
    { day: "Tue", minutes: 35 },
    { day: "Wed", minutes: 52 },
    { day: "Thu", minutes: 40 },
    { day: "Fri", minutes: 58 },
    { day: "Sat", minutes: 28 },
    { day: "Sun", minutes: 18 }
  ]);

  const [weakAreas] = useState([
    { subject: "Mathematics", topic: "Quadratic Equations", accuracy: 45 },
    { subject: "English", topic: "Tenses", accuracy: 62 },
    { subject: "General Knowledge", topic: "Indian History", accuracy: 58 }
  ]);

  const [achievements] = useState([
    { name: "Math Master", icon: "🥇", rarity: "gold", progress: 100, target: 100 },
    { name: "Streak Warrior", icon: "🔥", rarity: "gold", progress: 12, target: 30 },
    { name: "Knowledge Seeker", icon: "📚", rarity: "silver", progress: 20, target: 50 },
    { name: "Speed Demon", icon: "⚡", rarity: "silver", progress: 7, target: 10 }
  ]);

  const [monthlyProgress] = useState([
    { month: "Jan", xp: 2400 },
    { month: "Feb", xp: 2800 },
    { month: "Mar", xp: 3100 },
    { month: "Apr", xp: 300 },
    { month: "May", xp: 3450 }
  ]);

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

  const practiceWeakArea = (area: string) => {
    alert(`Starting practice for: ${area}`);
  };
  
  // Goal functions
  const addGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goal = {
        id: goals.length + 1,
        title: newGoal.title,
        target: parseInt(newGoal.target),
        current: 0,
        subject: newGoal.subject,
        deadline: newGoal.deadline
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: "", target: "", subject: "Mathematics", deadline: "" });
    }
  };
  
  const deleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const updateGoalProgress = (id: number, increment: number) => {
    setGoals(goals.map(goal =>
      goal.id === id
        ? { ...goal, current: Math.min(goal.current + increment, goal.target) }
        : goal
    ));
  };
  
  // Export functions
  const exportProgress = (format: string) => {
    // In a real app, this would generate and download a file
    alert(`Exporting progress as ${format.toUpperCase()}`);
  };

 return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      {/* Progress Page */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Your Learning Progress
          </h2>
          <p className="text-gray-600">Track your improvement across all subjects</p>
        </div>
        
        <div className="space-y-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Overall Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">378</div>
                      <div className="text-sm text-gray-600">Questions Solved</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <div className="text-sm text-gray-600">Avg. Accuracy</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">45h</div>
                      <div className="text-sm text-gray-600">Study Time</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">8</div>
                      <div className="text-sm text-gray-600">Achievements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Subject Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Subject Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subjectProgress.map((subject, index) => (
                      <div key={index} className="border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {subject.name === "Mathematics" && "🔢"}
                              {subject.name === "English" && "📖"}
                              {subject.name === "General Knowledge" && "🌍"}
                            </span>
                            <span className="font-semibold">{subject.name}</span>
                          </div>
                          <Badge>{subject.level}</Badge>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{subject.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getColorClass(subject.color, "bg")} h-2 rounded-full`} 
                              style={{ width: `${subject.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                          <div className="text-center">
                            <div className="font-semibold">{subject.xp}</div>
                            <div>XP</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{subject.accuracy}%</div>
                            <div>Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{subject.time}h</div>
                            <div>Time</div>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-3" asChild>
                          <Link to={`/subject/${subject.name.toLowerCase()}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
               </CardContent>
              </Card>
            </div>
            
            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Level</span>
                    </div>
                    <Badge className="text-lg">{userStats.level}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">Study Streak</span>
                    </div>
                    <Badge className="text-lg">{userStats.studyStreak} days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Rank</span>
                    </div>
                    <Badge className="text-lg">#{userStats.rank}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Star className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="font-medium">Total XP</span>
                    </div>
                    <Badge className="text-lg">{userStats.totalXP}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Weekly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weeklyActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{activity.day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${
                                activity.minutes > 50 ? 'bg-green-500' : 
                                activity.minutes > 40 ? 'bg-blue-500' : 
                                activity.minutes > 30 ? 'bg-purple-500' : 
                                activity.minutes > 20 ? 'bg-orange-500' : 'bg-red-500'
                              } h-2 rounded-full`} 
                              style={{ width: `${(activity.minutes / 60) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold">{activity.minutes} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          
          {/* Detailed Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weakAreas.map((area, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl ${
                        area.accuracy < 50 ? 'bg-red-50 border-red-200' : 
                        area.accuracy < 70 ? 'bg-yellow-50 border border-yellow-200' : 
                        'bg-orange-50 border border-orange-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {area.subject === "Mathematics" && "🔢"}
                            {area.subject === "English" && "📖"}
                            {area.subject === "General Knowledge" && "🌍"}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-800">{area.subject}</h4>
                            <p className="text-sm text-gray-600">{area.topic}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold">{area.accuracy}%</span>
                      </div>
                      <Button
                        onClick={() => practiceWeakArea(`${area.subject} - ${area.topic}`)}
                        className="w-full mt-2"
                        size="sm"
                      >
                        Practice Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="text-2xl">{achievement.icon}</div>
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <h4 className="font-bold mt-2">{achievement.name}</h4>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span className="font-semibold">{achievement.progress}/{achievement.target}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Goals Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Goals
                  </div>
                  <Button
                    variant="outline"
                    onClick={addGoal}
                    className="text-sm"
                  >
                    Add Goal
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {goals.map((goal) => (
                    <Card key={goal.id} className="border-2 hover:border-purple-300 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold">{goal.title}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{goal.current}/{goal.target}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${(goal.current / goal.target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>{goal.subject}</span>
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                        <Button
                          onClick={() => updateGoalProgress(goal.id, 1)}
                          size="sm"
                          className="w-full"
                        >
                          +1 Progress
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Add New Goal Form */}
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">Add New Goal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                      <input
                        type="text"
                        placeholder="Goal title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                        className="px-3 py-2 border rounded-md text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Target"
                        value={newGoal.target}
                        onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                        className="px-3 py-2 border rounded-md text-sm"
                      />
                      <select
                        value={newGoal.subject}
                        onChange={(e) => setNewGoal({...newGoal, subject: e.target.value})}
                        className="px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="General Knowledge">General Knowledge</option>
                        <option value="Science">Science</option>
                      </select>
                      <input
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                        className="px-3 py-2 border rounded-md text-sm"
                      />
                      <Button onClick={addGoal} className="whitespace-nowrap">
                        Add Goal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
          
          {/* Export Section */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Export Progress Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => exportProgress('pdf')} variant="outline">
                    Export as PDF
                  </Button>
                  <Button onClick={() => exportProgress('csv')} variant="outline">
                    Export as CSV
                  </Button>
                  <Button onClick={() => exportProgress('json')} variant="outline">
                    Export as JSON
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Download your progress data for offline analysis or sharing with teachers/parents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</PageTransition>
);
}
