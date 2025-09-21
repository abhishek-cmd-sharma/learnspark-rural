import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  School, 
  MapPin, 
  Calendar,
  Trophy,
  Star,
  Flame,
  Target,
  Settings,
  Bell,
  Shield,
  Palette,
  Volume2
} from "lucide-react";

export default function Profile() {
  const userStats = {
    totalXP: 12650,
    level: 14,
    rank: 7,
    streak: 28,
    badges: 6,
    quizzesCompleted: 145,
    studyHours: 67,
    accuracy: 85
  };

  const recentAchievements = [
    { name: "Week Warrior", icon: "🏆", rarity: "gold", date: "2 days ago" },
    { name: "Math Master", icon: "🧮", rarity: "silver", date: "1 week ago" },
    { name: "Speed Reader", icon: "📚", rarity: "bronze", date: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <Card className="cosmic-card mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                      AJ
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-display font-bold mb-2">Alex Johnson</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      Level {userStats.level}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      #{userStats.rank} Global
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {userStats.streak} Day Streak
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{userStats.totalXP.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total XP</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{userStats.badges}</div>
                      <div className="text-sm text-muted-foreground">Badges</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-xp-primary">{userStats.quizzesCompleted}</div>
                      <div className="text-sm text-muted-foreground">Quizzes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{userStats.accuracy}%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="md:self-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Alex Johnson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="alex.johnson@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input id="school" defaultValue="Green Valley Elementary" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="Springfield, Illinois" />
                    </div>
                    <Button variant="cosmic" className="w-full">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>

                {/* Learning Statistics */}
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Learning Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 cosmic-card rounded-lg">
                        <span className="font-medium">Study Hours</span>
                        <span className="text-xl font-bold text-primary">{userStats.studyHours}h</span>
                      </div>
                      <div className="flex justify-between items-center p-3 cosmic-card rounded-lg">
                        <span className="font-medium">Quizzes Completed</span>
                        <span className="text-xl font-bold text-success">{userStats.quizzesCompleted}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 cosmic-card rounded-lg">
                        <span className="font-medium">Average Accuracy</span>
                        <span className="text-xl font-bold text-xp-primary">{userStats.accuracy}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 cosmic-card rounded-lg">
                        <span className="font-medium">Current Streak</span>
                        <span className="text-xl font-bold text-orange-500">{userStats.streak} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 cosmic-card rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {achievement.rarity} • {achievement.date}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {achievement.rarity}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Daily Reminders</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Achievement Alerts</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contest Notifications</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Updates</span>
                      <Button variant="outline" size="sm">Disabled</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cosmic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Sound Effects</span>
                      <Button variant="outline" size="sm">
                        <Volume2 className="h-4 w-4 mr-1" />
                        On
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-save Progress</span>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Difficulty Level</span>
                      <Button variant="outline" size="sm">Adaptive</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Language</span>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Privacy & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Profile Visibility</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Show on Leaderboards</span>
                        <Button variant="outline" size="sm">Public</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Display Real Name</span>
                        <Button variant="outline" size="sm">Hidden</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Location Sharing</span>
                        <Button variant="outline" size="sm">City Only</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Account Security</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      This action cannot be undone. All your progress will be lost.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}