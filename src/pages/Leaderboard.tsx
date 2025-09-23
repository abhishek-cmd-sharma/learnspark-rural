import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore } from "@/contexts/FirestoreContext";
import { leaderboardService } from "@/lib/firestoreService";
import { LeaderboardUser } from "@/lib/types";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Zap,
  Target,
  Calendar,
  Users,
  Flame,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from "lucide-react";

export default function Leaderboard() {
  const { user } = useFirestore();
  const [globalLeaders, setGlobalLeaders] = useState<LeaderboardUser[]>([]);
  const [weeklyLeaders, setWeeklyLeaders] = useState<LeaderboardUser[]>([]);
  const [monthlyLeaders, setMonthlyLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Update user stats when user data changes
  useEffect(() => {
    if (user) {
      // In a real app, these values would be calculated from Firestore data
      // For now, we'll use the values from the user object
    }
  }, [user]);

 useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);

        // Fetch global leaderboard
        const globalData = await leaderboardService.getGlobalLeaderboard(100);
        setGlobalLeaders(globalData);

        // Fetch weekly leaderboard
        const weeklyData = await leaderboardService.getWeeklyLeaderboard(100);
        setWeeklyLeaders(weeklyData);

        // Fetch monthly leaderboard
        const monthlyData = await leaderboardService.getMonthlyLeaderboard(100);
        setMonthlyLeaders(monthlyData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();

    // Set up real-time listener for global leaderboard
    const unsubscribe = leaderboardService.onGlobalLeaderboardChange(100, (users) => {
      setGlobalLeaders(users);
    });

    // Set up real-time listener for weekly leaderboard
    const unsubscribeWeekly = leaderboardService.onWeeklyLeaderboardChange(100, (users) => {
      setWeeklyLeaders(users);
    });

    // Set up real-time listener for monthly leaderboard
    const unsubscribeMonthly = leaderboardService.onMonthlyLeaderboardChange(100, (users) => {
      setMonthlyLeaders(users);
    });

    // Clean up listeners on unmount
    return () => {
      unsubscribe();
      unsubscribeWeekly();
      unsubscribeMonthly();
    };
  }, []);

  // Pagination logic
  const getCurrentPageLeaders = (leaders: LeaderboardUser[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return leaders.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(globalLeaders.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
 };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-40" />;
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

  // Get user's rank in global leaderboard
  const getUserRank = () => {
    if (!user) return null;
    return globalLeaders.find(leader => leader.uid === user.uid)?.rank || null;
  };

  // Get user's XP
  const getUserXP = () => {
    if (!user) return 0;
    return user.xp || 0;
  };

  // Get user's streak
  const getUserStreak = () => {
    if (!user) return 0;
    return user.streak || 0;
  };

  // Get user's badges count
  const getUserBadges = () => {
    if (!user) return 0;
    // Find the user in the global leaders and get their badge count
    const userInLeaders = globalLeaders.find(leader => leader.uid === user.uid);
    return userInLeaders ? userInLeaders.badges : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold mb-4">🏆 Leaderboard</h1>
            <p className="text-muted-foreground text-lg">Loading leaderboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  // Social sharing functions
  const shareLeaderboard = (platform: string) => {
    const message = `I'm ranked #${getUserRank()} on the EduQuest Leaderboard! Can you beat my score?`;
    const url = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(`${message} ${url}`);
        alert("Link copied to clipboard!");
    }
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

        {/* Social Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="cosmic-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Share Your Achievement</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => shareLeaderboard("twitter")}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => shareLeaderboard("facebook")}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => shareLeaderboard("linkedin")}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => shareLeaderboard("copy")}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comparison Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Compare Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Your Statistics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Global Rank:</span>
                      <span className="font-semibold">#{getUserRank() || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP:</span>
                      <span className="font-semibold">{getUserXP().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Streak:</span>
                      <span className="font-semibold">{getUserStreak()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Badges Earned:</span>
                      <span className="font-semibold">{getUserBadges()}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2">Top Performer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span className="font-semibold">{globalLeaders[0]?.displayName || "Anonymous User"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Global Rank:</span>
                      <span className="font-semibold">#1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total XP:</span>
                      <span className="font-semibold">{globalLeaders[0]?.xp?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Badges Earned:</span>
                      <span className="font-semibold">{globalLeaders[0]?.badges || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {globalLeaders[0] && user ? (
                    <span>
                      You need <strong>{(globalLeaders[0].xp || 0) - getUserXP()} XP</strong> to reach #1
                    </span>
                  ) : (
                    "Compare your stats with the top performer"
                  )}
                </p>
                <Button variant="outline" size="sm" onClick={() => shareLeaderboard("copy")}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
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
                <div className="text-2xl font-bold">{getUserRank() ? `${getUserRank()}th` : "N/A"}</div>
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
                <div className="text-2xl font-bold">{getUserXP().toLocaleString()}</div>
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
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-50 to-red-500 rounded-full flex items-center justify-center text-white">
                  <Flame />
                </div>
                <div className="text-2xl font-bold">{getUserStreak()}</div>
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
                <div className="text-2xl font-bold">{getUserBadges()}</div>
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
                    {getCurrentPageLeaders(globalLeaders).map((leader, index) => (
                      <motion.div
                        key={leader.uid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          user && leader.uid === user.uid
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border cosmic-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankBadge(leader.rank)} flex items-center justify-center text-white font-bold`}>
                            {leader.rank <= 3 ? getRankIcon(leader.rank) : leader.rank}
                          </div>

                          <Avatar className="h-10 w-10">
                            <AvatarImage src={leader.photoURL} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {leader.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {leader.displayName || "Anonymous User"}
                              {user && leader.uid === user.uid && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{leader.location || "Location not set"}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">{leader.xp?.toLocaleString() || 0} XP</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Lvl {leader.level || 1}</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {leader.streak || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {leader.badges || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === i + 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
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
                    {getCurrentPageLeaders(weeklyLeaders).map((leader, index) => (
                      <motion.div
                        key={leader.uid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          user && leader.uid === user.uid
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border cosmic-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankBadge(leader.rank)} flex items-center justify-center text-white font-bold`}>
                            {leader.rank <= 3 ? getRankIcon(leader.rank) : leader.rank}
                          </div>

                          <Avatar className="h-10 w-10">
                            <AvatarImage src={leader.photoURL} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {leader.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {leader.displayName || "Anonymous User"}
                              {user && leader.uid === user.uid && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{leader.location || "Location not set"}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">+{leader.weeklyXP?.toLocaleString() || 0} XP</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Total: {(leader.xp || 0).toLocaleString()} XP</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {leader.streak || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {leader.badges || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === i + 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
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
                    {getCurrentPageLeaders(monthlyLeaders).map((leader, index) => (
                      <motion.div
                        key={leader.uid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          user && leader.uid === user.uid
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border cosmic-card hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankBadge(leader.rank)} flex items-center justify-center text-white font-bold`}>
                            {leader.rank <= 3 ? getRankIcon(leader.rank) : leader.rank}
                          </div>

                          <Avatar className="h-10 w-10">
                            <AvatarImage src={leader.photoURL} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                              {leader.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {leader.displayName || "Anonymous User"}
                              {user && leader.uid === user.uid && (
                                <Badge variant="secondary" className="text-xs">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{leader.location || "Location not set"}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-lg">+{leader.monthlyXP?.toLocaleString() || 0} XP</div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Total: {(leader.xp || 0).toLocaleString()} XP</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {leader.streak || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {leader.badges || 0}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === i + 1
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 rounded-md bg-muted text-muted-foreground disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
