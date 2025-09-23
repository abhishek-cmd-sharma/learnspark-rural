import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { contestServiceFunctions } from "@/lib/contestService";
import { Contest } from "@/lib/types";
import { Play, Bell } from "lucide-react";

interface ContestJoinButtonProps {
  contest: Contest;
  userId: string;
  onJoinSuccess?: () => void;
 variant?: "default" | "outline" | "destructive";
}

export function ContestJoinButton({ 
  contest, 
  userId, 
  onJoinSuccess,
  variant = "default"
}: ContestJoinButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hasJoined, setHasJoined] = useState(
    contest.participants?.includes(userId) || false
  );

  const handleJoinContest = async () => {
    // Check if contest is active
    if (!contestServiceFunctions.isContestActive(contest)) {
      toast({
        title: "Cannot Join Contest",
        description: "This contest is not currently active",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already joined
    if (hasJoined) {
      toast({
        title: "Already Joined",
        description: "You have already joined this contest",
      });
      return;
    }

    // Check if contest is full
    if (contest.maxParticipants && 
        contest.participants && 
        contest.participants.length >= contest.maxParticipants) {
      toast({
        title: "Contest Full",
        description: "This contest has reached its maximum number of participants",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Join contest
      await contestServiceFunctions.joinContest(contest.id, userId);
      
      toast({
        title: "Contest Joined",
        description: "You have successfully joined the contest!",
      });
      
      setHasJoined(true);
      onJoinSuccess?.();
    } catch (error: any) {
      console.error("Error joining contest:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join contest",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetReminder = () => {
    // In a real implementation, this would set a notification
    toast({
      title: "Reminder Set",
      description: `You'll be notified when ${contest.title} starts`,
    });
  };

  // Check if contest is active
  const isContestActive = contestServiceFunctions.isContestActive(contest);
  const isContestUpcoming = contestServiceFunctions.isContestUpcoming(contest);
  const isContestEnded = contestServiceFunctions.isContestEnded(contest);

  if (isContestEnded) {
    return (
      <Button disabled variant="outline">
        Contest Ended
      </Button>
    );
  }

  if (hasJoined) {
    return (
      <Button disabled variant="outline">
        Joined
      </Button>
    );
  }

  if (isContestActive) {
    return (
      <Button 
        onClick={handleJoinContest}
        disabled={isLoading}
        variant={variant}
      >
        {isLoading ? (
          "Joining..."
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Join Contest
          </>
        )}
      </Button>
    );
  }

  if (isContestUpcoming) {
    return (
      <Button 
        onClick={handleSetReminder}
        variant="outline"
      >
        <Bell className="mr-2 h-4 w-4" />
        Set Reminder
      </Button>
    );
  }

  return (
    <Button disabled variant="outline">
      Join Contest
    </Button>
  );
}