import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Zap, 
  Target,
  Calendar,
  Users,
  Flame
} from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  location: string;
  badges: number;
}

export default function Leaderboard() {
  const globalLeaders: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Priya Sharma",
      xp: 15420,
      level: 18,
      streak: 45,
      location: "Mumbai, Maharashtra",
      badges: 12
    },
    {
      rank: 2,
      name: "Arjun Patel",
      xp: 14890,
      level: 17,
      streak: 38,
      location: "Ahmedabad, Gujarat",
      badges: 10
    },
    {
      rank: 3,
      name: "Sneha Reddy",
      xp: 14205,
      level: 16,
      streak: 42,
      location: "Hyderabad, Telangana",
      badges: 11
    },
    {
      rank: 4,
      name: "Rahul Kumar",
      xp: 13850,
      level: 16,
      streak: 35,
      location: "Delhi, Delhi",
      badges: 9
    },
    {
      rank: 5,
      name: "Ananya Singh",
      xp: 13420,
      level: 15,
      streak: 40,
      location: "Pune, Maharashtra",
      badges: 8
    },
    {
      rank: 6,
      name: "Vikash Yadav",
      xp: 12995,
      level: 15,
      streak: 33,
      location: "Patna, Bihar",
      badges: 7
    },
    {
      rank: 7,
      name: "Alex Johnson",
      xp: 12650,
      level: 14,
      streak: 28,
      location: "Your Location",
      badges: 6
    }
  ];

  const weeklyLeaders = globalLeaders.slice(0, 5);
  const monthlyLeaders = globalLeaders.slice(0, 10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "from-yellow-500 to-orange-500";
    if (rank === 2) return "from-gray-400 to-gray-600";
    if (rank === 3) return "from-orange-600 to-red-600";
    return "from-muted to-muted-foreground";
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-4">
            🏆 Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            See how you rank against other learning champions!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="cosmic-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white">
                  <Trophy />
                </div>
                <div className="text-2xl font-bold">7th</div>
                <div className="text-sm text-muted-foreground">Your Global Rank</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="cosmic-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-xp-primary to-xp-secondary rounded-full flex items-center justify-center text-white">
                  <Star />
                </div>
                <div className="text-2xl font-bold">12,650</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cosmic-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                  <Flame />
                </div>
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cosmic-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center text-white">
                  <Target />
                </div>
                <div className="text-2xl font-bold">6</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leaderboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Global
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This Week
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                This Month
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Global Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {globalLeaders.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          user.name === "Alex Johnson" 
                            ? "border-primary bg-primary/5 shadow-lg" 
                            : "border-border cosmic-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankBadge(user.rank)} flex items-center justify-center text-white font-bold`}>
                            {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {user.name}
                              {user.name === "Alex Johnson" && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.location}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">{user.xp.toLocaleString()} XP</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Lvl {user.level}</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {user.streak}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {user.badges}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    This Week's Champions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyLeaders.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 cosmic-card rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankBadge(user.rank)} flex items-center justify-center text-white font-bold`}>
                            {user.rank}
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">+2,450 XP this week</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{user.xp.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total XP</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monthly">
              <Card className="cosmic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Monthly Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyLeaders.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 cosmic-card rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankBadge(user.rank)} flex items-center justify-center text-white font-bold`}>
                            {user.rank}
                          </div>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">+8,920 XP this month</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{user.xp.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total XP</div>
                        </div>
                      </motion.div>
                    ))}
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