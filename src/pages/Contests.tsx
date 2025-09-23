import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFirestore } from "@/contexts/FirestoreContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Search,
  Plus,
  Filter,
  Zap,
  Star,
  Rocket,
  Crown,
  Medal,
  Gift,
  Sparkles,
  Archive
} from "lucide-react";
import PageTransition from "@/components/PageTransition";

export default function Contests() {
  const { contests: firebaseContests, loadingContests } = useFirestore();
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  
  
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    studyStreak: 0,
    gems: 0,
    badges: 0,
    rank: 0,
    totalUsers: 0
  });
  // Real-time leaderboard data for live contests
  const [liveLeaderboard, setLiveLeaderboard] = useState<any[]>([]);

  // Use real contest data from Firestore
  const contests = firebaseContests || [];

  const filteredContests = contests.filter(contest => {
    const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contest.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    // Note: Firebase contests don't have an isLive property, so we'll need to determine this based on dates
    if (filter === "live") return matchesSearch && contest.startDate <= new Date() && contest.endDate >= new Date();
    if (filter === "upcoming") return matchesSearch && contest.startDate > new Date();
    if (filter === "past") return matchesSearch && contest.endDate < new Date();
    
    return matchesSearch && contest.subjectId === filter;
  });

  const joinContest = (contestId: string) => {
    alert(`Joining contest: ${contestId}`);
  };

  const setReminder = (contestId: string) => {
    alert(`Setting reminder for contest: ${contestId}`);
  };

  // Get icon based on subject
 const getSubjectIcon = (subjectId: string) => {
    switch (subjectId) {
      case "mathematics": return "🔢";
      case "english": return "📖";
      case "science": return "🔬";
      case "general-knowledge": return "🌍";
      default: return "🎓";
    }
  };

  // Get color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {["🌟", "⭐", "✨", "💫", "🚀", "🏆", "🎯", "🎖️"][Math.floor(Math.random() * 8)]}
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3">
              🎉 Contest Arena 🎉
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Participate in exciting challenges, compete with your peers, and win amazing prizes!
            </p>
          </motion.div>
          
          {/* Stats Overview */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Participated</p>
                    <p className="text-xl font-bold">{userStats.totalXP > 0 ? Math.floor(userStats.totalXP / 100) : 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Won</p>
                    <p className="text-xl font-bold">{userStats.badges}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Best Rank</p>
                    <p className="text-xl font-bold">#{userStats.rank || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total XP</p>
                    <p className="text-xl font-bold">{userStats.totalXP.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Create Contest Button */}
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              asChild 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/contests/create">
                <Plus className="w-5 h-5 mr-2" />
                Create Your Own Contest
                <Rocket className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
          
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input 
                      placeholder="Search contests..." 
                      className="pl-10 py-3 rounded-full border-2 border-purple-200 focus:border-purple-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={filter === "all" ? "default" : "outline"}
                      onClick={() => setFilter("all")}
                      className="rounded-full"
                    >
                      All
                    </Button>
                    <Button 
                      variant={filter === "live" ? "default" : "outline"}
                      onClick={() => setFilter("live")}
                      className="rounded-full"
                    >
                      Live
                    </Button>
                    <Button 
                      variant={filter === "mathematics" ? "default" : "outline"}
                      onClick={() => setFilter("mathematics")}
                      className="rounded-full"
                    >
                      Math
                    </Button>
                    <Button 
                      variant={filter === "english" ? "default" : "outline"}
                      onClick={() => setFilter("english")}
                      className="rounded-full"
                    >
                      English
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Contest Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex overflow-x-auto mb-6 border-b border-purple-200"
          >
            <button 
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-3 font-bold rounded-t-lg mr-2 relative ${
                activeTab === "upcoming" 
                  ? "text-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Upcoming
              {activeTab === "upcoming" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("live")}
              className={`px-6 py-3 font-bold rounded-t-lg mr-2 relative ${
                activeTab === "live" 
                  ? "text-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Live Now
              {activeTab === "live" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button 
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 font-bold rounded-t-lg relative ${
                activeTab === "past" 
                  ? "text-purple-600" 
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Past Contests
              {activeTab === "past" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          </motion.div>
          
          {/* Live Contest Leaderboard */}
          {activeTab === "live" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-100 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Live Contest Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-purple-700">Rank</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Participant</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Score</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveLeaderboard.map((participant, index) => (
                          <tr
                            key={participant.id}
                            className={`border-b border-gray-100 ${participant.isYou ? 'bg-purple-50 font-bold' : 'hover:bg-gray-50'}`}
                          >
                            <td className="p-4">
                              <div className="flex items-center">
                                {index === 0 && <Crown className="w-4 h-4 text-yellow-500 mr-2" />}
                                {index === 1 && <Medal className="w-4 h-4 text-gray-400 mr-2" />}
                                {index === 2 && <Medal className="w-4 h-4 text-amber-700 mr-2" />}
                                {index > 2 && <span className="mr-2">#{index + 1}</span>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold mr-3">
                                  {participant.avatar}
                                </div>
                                <span>{participant.name}</span>
                                {participant.isYou && (
                                  <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
                                    You
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-semibold">{participant.score}</td>
                            <td className="p-4 text-gray-600">{participant.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Contest List */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence>
              {filteredContests
                .filter(contest => {
                  if (activeTab === "upcoming") return contest.startDate > new Date();
                  if (activeTab === "live") return contest.startDate <= new Date() && contest.endDate >= new Date();
                  if (activeTab === "past") return contest.endDate < new Date();
                  return true;
                })
                .map((contest, index) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-white/90 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-5 h-full flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getSubjectIcon(contest.subjectId)}</span>
                            <h3 className="font-bold text-lg">{contest.title}</h3>
                          </div>
                          {contest.startDate <= new Date() && contest.endDate >= new Date() && (
                            <Badge className="bg-red-500 animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{contest.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="rounded-full">
                            {contest.subjectId.replace('-', ' ')}
                          </Badge>
                          <Badge className={getDifficultyColor(contest.difficulty)} variant="secondary">
                            {contest.difficulty}
                          </Badge>
                          <Badge variant="outline" className="rounded-full">
                            <Users className="w-3 h-3 mr-1" />
                            {contest.participants}/{contest.maxParticipants}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {contest.startDate.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {contest.duration} min
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          {contest.startDate <= new Date() && contest.endDate >= new Date() ? (
                            <Button
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full"
                              onClick={() => joinContest(contest.id)}
                            >
                              <Zap className="w-4 h-4 mr-1" />
                              Join Now
                            </Button>
                          ) : new Date() < contest.startDate ? (
                            <>
                              <Button 
                                variant="outline" 
                                className="flex-1 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50"
                                onClick={() => setReminder(contest.id)}
                              >
                                Remind Me
                              </Button>
                              <Button 
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full"
                                onClick={() => joinContest(contest.id)}
                              >
                                Join
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="flex-1 rounded-full border-purple-300 text-purple-600 hover:bg-purple-50"
                              asChild
                            >
                              <Link to={`/contests/${contest.id}/results`}>
                                View Results
                              </Link>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
            
            {filteredContests.filter(contest => {
              if (activeTab === "upcoming") return contest.startDate > new Date();
              if (activeTab === "live") return contest.startDate <= new Date() && contest.endDate >= new Date();
              if (activeTab === "past") return contest.endDate < new Date();
              return true;
            }).length === 0 && (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">😢</div>
                <p className="text-gray-500 text-lg">No contests found matching your criteria</p>
                <p className="text-gray-400 mt-2">Try changing your filters or check back later!</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Contest History Archive */}
          {activeTab === "past" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8"
            >
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-100 rounded-2xl overflow-hidden shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Contest History Archive
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-purple-50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-purple-700">Contest</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Date</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Your Rank</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Score</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Prize</th>
                          <th className="text-left p-4 font-semibold text-purple-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Mock contest history data */}
                        {[
                          { id: "1", name: "Math Weekly Challenge", date: "2023-05-15", rank: 3, score: 92, prize: "Gold Badge" },
                          { id: "2", name: "Science Olympiad", date: "2023-05-01", rank: 1, score: 98, prize: "Platinum Badge" },
                          { id: "3", name: "English Grammar Contest", date: "2023-04-18", rank: 5, score: 85, prize: "Silver Badge" },
                          { id: "4", name: "General Knowledge Quiz", date: "2023-04-05", rank: 2, score: 95, prize: "Gold Badge" }
                        ].map((contest, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4 font-medium">{contest.name}</td>
                            <td className="p-4 text-gray-600">{contest.date}</td>
                            <td className="p-4">
                              <div className="flex items-center">
                                {contest.rank === 1 && <Crown className="w-4 h-4 text-yellow-500 mr-1" />}
                                {contest.rank === 2 && <Medal className="w-4 h-4 text-gray-400 mr-1" />}
                                {contest.rank === 3 && <Medal className="w-4 h-4 text-amber-700 mr-1" />}
                                <span>#{contest.rank}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold">{contest.score}/100</td>
                            <td className="p-4">
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                {contest.prize}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-purple-300 text-purple-600 hover:bg-purple-50"
                                asChild
                              >
                                <Link to={`/contests/${contest.id}/results`}>
                                  View Details
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}