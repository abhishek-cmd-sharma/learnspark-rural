import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";
import { UserContestParticipation } from "@/lib/types";

interface ContestLeaderboardProps {
 participants: UserContestParticipation[];
  currentUserParticipation?: UserContestParticipation | null;
}

export function ContestLeaderboard({ participants, currentUserParticipation }: ContestLeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-700" />;
      default: return <Trophy className="h-5 w-5 text-primary" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Badge className="bg-yellow-500 text-yellow-900">1st</Badge>;
      case 2: return <Badge className="bg-gray-400 text-gray-900">2nd</Badge>;
      case 3: return <Badge className="bg-amber-700 text-amber-100">3rd</Badge>;
      default: return <Badge variant="outline">{rank}th</Badge>;
    }
  };

  // Add rank to participants
  const rankedParticipants = participants.map((participant, index) => ({
    ...participant,
    rank: index + 1
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Contest Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rankedParticipants.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No participants yet. Be the first to join!
            </p>
          ) : (
            <div className="space-y-3">
              {rankedParticipants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: participant.rank * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    currentUserParticipation?.userId === participant.userId
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(participant.rank)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {participant.userId === currentUserParticipation?.userId 
                          ? "You" 
                          : `Participant ${participant.userId.slice(0, 6)}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Scored {participant.score} points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{participant.score}</span>
                    {getRankBadge(participant.rank)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}