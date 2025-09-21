import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Trophy, 
  Clock, 
  Zap,
  Play,
  Calendar,
  Target,
  Star,
  Medal,
  Crown,
  Bell
} from "lucide-react";

interface Contest {
  id: string;
  name: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  participants: number;
  timeLeft: string;
  isLive: boolean;
  prize: string;
  description: string;
  startTime?: string;
  duration: string;
}

export default function Contests() {
  const liveContests: Contest[] = [
    {
      id: "1",
      name: "Math Lightning Round",
      subject: "Mathematics",
      difficulty: "Medium",
      participants: 156,
      timeLeft: "12m 34s",
      isLive: true,
      prize: "500 XP + Gold Badge",
      description: "Quick-fire arithmetic and problem solving",
      duration: "15 minutes"
    },
    {
      id: "2", 
      name: "Science Explorer",
      subject: "Science",
      difficulty: "Hard",
      participants: 89,
      timeLeft: "3m 15s",
      isLive: true,
      prize: "750 XP + Platinum Badge",
      description: "Advanced physics and chemistry concepts",
      duration: "20 minutes"
    }
  ];

  const upcomingContests: Contest[] = [
    {
      id: "3",
      name: "English Grammar Masters",
      subject: "English",
      difficulty: "Easy",
      participants: 0,
      timeLeft: "",
      isLive: false,
      prize: "300 XP + Silver Badge",
      description: "Grammar, vocabulary, and reading comprehension",
      startTime: "Today at 3:00 PM",
      duration: "12 minutes"
    },
    {
      id: "4",
      name: "History Timeline Challenge",
      subject: "History", 
      difficulty: "Medium",
      participants: 0,
      timeLeft: "",
      isLive: false,
      prize: "450 XP + Gold Badge",
      description: "Ancient civilizations to modern history",
      startTime: "Tomorrow at 10:00 AM",
      duration: "18 minutes"
    },
    {
      id: "5",
      name: "Geography World Tour",
      subject: "Geography",
      difficulty: "Easy",
      participants: 0,
      timeLeft: "",
      isLive: false,
      prize: "350 XP + Bronze Badge",
      description: "Countries, capitals, and natural wonders",
      startTime: "Tomorrow at 2:00 PM",
      duration: "15 minutes"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-success";
      case "Medium": return "bg-xp-primary";
      case "Hard": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getPrizeIcon = (prize: string) => {
    if (prize.includes("Platinum")) return <Crown className="h-4 w-4 text-purple-500" />;
    if (prize.includes("Gold")) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (prize.includes("Silver")) return <Medal className="h-4 w-4 text-gray-400" />;
    return <Star className="h-4 w-4 text-orange-500" />;
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-4">
            🏆 Live Contests
          </h1>
          <p className="text-muted-foreground text-lg">
            Compete with students worldwide and climb the leaderboards!
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
                  <Users />
                </div>
                <div className="text-2xl font-bold">245</div>
                <div className="text-sm text-muted-foreground">Students Online</div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center text-white">
                  <Zap />
                </div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Live Contests</div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-xp-primary to-xp-secondary rounded-full flex items-center justify-center text-white">
                  <Trophy />
                </div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Contests Won</div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                  <Target />
                </div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Contests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            Live Contests
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cosmic-card p-6 border-2 border-red-200 relative overflow-hidden"
              >
                {/* Live indicator */}
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{contest.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{contest.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline">{contest.subject}</Badge>
                    <Badge className={`${getDifficultyColor(contest.difficulty)} text-white`}>
                      {contest.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {contest.participants}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-500" />
                        Time Remaining
                      </span>
                      <span className="font-bold text-red-500">{contest.timeLeft}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {getPrizeIcon(contest.prize)}
                        Prize
                      </span>
                      <span className="font-semibold">{contest.prize}</span>
                    </div>
                  </div>
                </div>

                <Button variant="destructive" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Join Contest ({contest.timeLeft} left)
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Contests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Contests
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingContests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cosmic-card p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">{contest.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{contest.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{contest.subject}</Badge>
                    <Badge className={`${getDifficultyColor(contest.difficulty)} text-white text-xs`}>
                      {contest.difficulty}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Starts
                      </span>
                      <span className="font-semibold">{contest.startTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Duration
                      </span>
                      <span className="font-semibold">{contest.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        {getPrizeIcon(contest.prize)}
                        Prize
                      </span>
                      <span className="font-semibold text-xs">{contest.prize}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Bell className="mr-2 h-4 w-4" />
                  Set Reminder
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}