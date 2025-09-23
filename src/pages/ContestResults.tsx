import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ContestLeaderboard } from "@/components/ContestLeaderboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { contestServiceFunctions } from "@/lib/contestService";
import { Contest, UserContestParticipation } from "@/lib/types";
import { Trophy, Medal, Crown, RotateCcw, BarChart3, Award, Timer } from "lucide-react";

export default function ContestResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [participants, setParticipants] = useState<UserContestParticipation[]>([]);
  const [currentUserParticipation, setCurrentUserParticipation] = useState<UserContestParticipation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contest results
  useEffect(() => {
    const fetchContestResults = async () => {
      if (!id || !currentUser) {
        setError("Invalid contest or user not logged in");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch contest
        const contestData = await contestServiceFunctions.getContest(id);
        if (!contestData) {
          setError("Contest not found");
          setIsLoading(false);
          return;
        }
        
        setContest(contestData);
        
        // Fetch participants
        const contestParticipants = await contestServiceFunctions.getContestParticipants(id);
        
        // Sort participants by score (descending)
        const sortedParticipants = [...contestParticipants].sort((a, b) => b.score - a.score);
        setParticipants(sortedParticipants);
        
        // Find current user's participation
        const userParticipation = contestParticipants.find(
          p => p.userId === currentUser.uid
        );
        setCurrentUserParticipation(userParticipation || null);
      } catch (err) {
        console.error("Error fetching contest results:", err);
        setError("Failed to load contest results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestResults();
  }, [id, currentUser]);

  // Handle retry
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    
    // Re-fetch data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Handle back to contests
  const handleBackToContests = () => {
    navigate("/contests");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading contest results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive">{error}</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleRetry} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
                <Button onClick={handleBackToContests}>
                  Back to Contests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Contest Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The contest results you're looking for don't exist or have been removed.</p>
              <Button 
                onClick={handleBackToContests}
                className="w-full mt-4"
              >
                Back to Contests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get user's rank
  const userRank = currentUserParticipation 
    ? participants.findIndex(p => p.userId === currentUserParticipation.userId) + 1 
    : null;

  // Calculate statistics
  const totalParticipants = participants.length;
  const averageScore = totalParticipants > 0 
    ? Math.round(participants.reduce((sum, p) => sum + p.score, 0) / totalParticipants)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Contest Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{contest.title} Results</h1>
              <p className="text-muted-foreground">{contest.description}</p>
            </div>
            <Button variant="outline" onClick={handleBackToContests}>
              Back to Contests
            </Button>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                    <p className="text-xl font-bold">{totalParticipants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-xl font-bold">{averageScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Rank</p>
                    <p className="text-xl font-bold">{userRank || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Timer className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-xl font-bold">{contest.duration} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User's Result */}
          {currentUserParticipation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                        {userRank === 1 ? (
                          <Crown className="h-8 w-8 text-yellow-500" />
                        ) : userRank === 2 ? (
                          <Medal className="h-8 w-8 text-gray-400" />
                        ) : userRank === 3 ? (
                          <Medal className="h-8 w-8 text-amber-700" />
                        ) : (
                          <Trophy className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Your Result</h3>
                        <p className="text-muted-foreground">
                          {userRank ? `Rank: ${userRank}${userRank === 1 ? 'st' : userRank === 2 ? 'nd' : userRank === 3 ? 'rd' : 'th'}` : 'Not ranked'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <div className="text-4xl font-bold text-primary">{currentUserParticipation.score}</div>
                      <div className="text-muted-foreground">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {totalParticipants > 0 ? Math.round((userRank! / totalParticipants) * 100) : 0}%
                      </div>
                      <div className="text-muted-foreground">Percentile</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Leaderboard */}
          <div className="mb-8">
            <ContestLeaderboard 
              participants={participants} 
              currentUserParticipation={currentUserParticipation}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleBackToContests} variant="outline">
              Back to Contests
            </Button>
            <Button onClick={() => navigate(`/contests/${id}`)}>
              View Contest Details
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Results
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}