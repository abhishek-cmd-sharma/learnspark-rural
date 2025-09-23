import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { ContestInterface } from "@/components/ContestInterface";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { contestServiceFunctions } from "@/lib/contestService";
import { quizService } from "@/lib/firestoreService";
import { Question, Contest } from "@/lib/types";
import { Play, Trophy, Timer, Users, Award, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import PageTransition from "@/components/PageTransition";

export default function ContestParticipation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const { toast } = useToast();
  
  const [contest, setContest] = useState<Contest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContestActive, setIsContestActive] = useState(false);
  const [userParticipation, setUserParticipation] = useState<any>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Fetch contest data
 useEffect(() => {
    const fetchContestData = async () => {
      if (!id || !currentUser || !userData) {
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
        
        // Check if contest is active
        const active = contestServiceFunctions.isContestActive(contestData);
        setIsContestActive(active);
        
        // Check if user has joined
        const participation = await contestServiceFunctions.getUserContestParticipation(
          id, 
          currentUser.uid
        );
        
        if (participation) {
          setUserParticipation(participation);
          setHasJoined(true);
        }
        
        // If contest is active and user has joined, fetch questions
        if (active && participation) {
          // Get questions for the contest
          // In a real implementation, you would have contest-specific questions
          let quizQuestions: Question[] = [];
          
          if (contestData.subjectId) {
            // Get quizzes for the subject
            const quizzes = await quizService.getQuizzesBySubject(contestData.subjectId);
            if (quizzes.length > 0) {
              // Take questions from the first quiz
              quizQuestions = quizzes[0].questions.slice(0, contestData.questionsCount);
            }
          } else {
            // Get any quiz if no subject is specified
            // In a real app, you would fetch contest-specific questions
            const allQuizzes = await quizService.getQuizzesBySubject("");
            if (allQuizzes.length > 0) {
              quizQuestions = allQuizzes[0].questions.slice(0, contestData.questionsCount);
            }
          }
          
          setQuestions(quizQuestions);
        }
        
        // Fetch leaderboard
        const participants = await contestServiceFunctions.getContestParticipants(id);
        const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
        setLeaderboard(sortedParticipants.slice(0, 5));
      } catch (err) {
        console.error("Error fetching contest data:", err);
        setError("Failed to load contest data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, [id, currentUser, userData]);

  // Handle contest completion
  const handleContestComplete = async (score: number, timeTaken: number) => {
    if (!id || !currentUser || !userParticipation) return;
    
    try {
      // Update user's contest score
      await contestServiceFunctions.updateUserContestScore(
        userParticipation.id,
        score
      );
      
      toast({
        title: "Contest Completed",
        description: `Your score: ${score} points`,
      });
      
      // Navigate to results page after a delay
      setTimeout(() => {
        navigate(`/contests/${id}/results`);
      }, 3000);
    } catch (err) {
      console.error("Error updating contest score:", err);
      toast({
        title: "Error",
        description: "Failed to save your contest results",
        variant: "destructive",
      });
    }
  };

  // Handle joining contest
  const handleJoinContest = async () => {
    if (!id || !currentUser) return;
    
    try {
      await contestServiceFunctions.joinContest(id, currentUser.uid);
      
      toast({
        title: "Contest Joined",
        description: "You have successfully joined the contest!",
      });
      
      setHasJoined(true);
      
      // Refresh the page to show the contest interface
      window.location.reload();
    } catch (err: any) {
      console.error("Error joining contest:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to join contest",
        variant: "destructive",
      });
    }
  };

  // Handle exit
  const handleExit = () => {
    navigate("/contests");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading contest...</p>
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
              <Button 
                onClick={() => navigate("/contests")}
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
              <p>The contest you're looking for doesn't exist or has been removed.</p>
              <Button 
                onClick={() => navigate("/contests")}
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

  // If contest hasn't started yet
  if (!isContestActive) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{contest.title}</h1>
              <Button variant="outline" onClick={handleExit}>
                Back to Contests
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="text-center">
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl">{contest.title}</CardTitle>
                    <p className="text-muted-foreground">{contest.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Starts</p>
                        <p className="font-semibold">{format(contest.startDate, "MMM d, yyyy h:mm a")}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{contest.duration} minutes</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Questions</p>
                        <p className="font-semibold">{contest.questionsCount}</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Prize</p>
                        <p className="font-semibold">{contest.prize}</p>
                      </div>
                    </div>
                    
                    {!hasJoined ? (
                      <Button 
                        onClick={handleJoinContest}
                        className="w-full"
                        size="lg"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Join Contest
                      </Button>
                    ) : (
                      <Button disabled className="w-full" size="lg">
                        Joined - Waiting for contest to start
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contest Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="font-semibold">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty</span>
                        <span className="font-semibold">{contest.difficulty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subject</span>
                        <span className="font-semibold">{contest.subjectId || "General"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If user hasn't joined yet
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Contest in Progress</h1>
              <Button variant="outline" onClick={handleExit}>
                Back to Contests
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="text-center">
                    <Timer className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                    <CardTitle className="text-2xl">Contest in Progress</CardTitle>
                    <p className="text-muted-foreground">You need to join to participate</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <p className="font-semibold">You haven't joined this contest yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Join now to participate in {contest.title}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleJoinContest}
                      className="w-full"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Join Contest Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((participant, index) => (
                        <div key={participant.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">#{index + 1}</span>
                            <span>Participant {participant.userId.slice(0, 6)}</span>
                          </div>
                          <span className="font-semibold">{participant.score} pts</span>
                        </div>
                      ))}
                      {leaderboard.length === 0 && (
                        <p className="text-center text-muted-foreground">No participants yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If we don't have questions yet
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card>
              <CardHeader>
                <CardTitle>Preparing Contest</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading contest questions...</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show contest interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{contest.title}</h1>
          <Button variant="outline" onClick={handleExit}>
            Exit Contest
          </Button>
        </div>
        
        <ContestInterface
          questions={questions}
          contestId={contest.id}
          userId={currentUser?.uid || ""}
          onContestComplete={handleContestComplete}
          onExit={handleExit}
        />
      </main>
    </div>
  );
}