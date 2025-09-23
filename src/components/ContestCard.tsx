import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { formatDistanceToNow, format } from "date-fns";

interface Contest {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  questionsCount: number;
  prize: string;
  difficulty: string;
  participants: number;
  maxParticipants: number;
  isLive: boolean;
}

interface ContestCardProps {
  contest: Contest;
  onJoin?: (contestId: string) => void;
  onReminder?: (contestId: string) => void;
}

export function ContestCard({ contest, onJoin, onReminder }: ContestCardProps) {
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

  const formatTimeLeft = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const formatStartTime = (startDate: Date) => {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Started";
    
    return formatDistanceToNow(startDate, { addSuffix: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className={`h-full ${contest.isLive ? "border-2 border-red-200 relative overflow-hidden" : ""}`}>
        {contest.isLive && (
          <div className="absolute top-4 right-4">
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-start justify-between">
            <span>{contest.title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground text-sm mb-3">{contest.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {contest.subjectId && (
              <Badge variant="outline">{contest.subjectId}</Badge>
            )}
            <Badge className={`${getDifficultyColor(contest.difficulty)} text-white text-xs`}>
              {contest.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {contest.participants}
              {contest.maxParticipants && `/${contest.maxParticipants}`}
            </Badge>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            {contest.isLive ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    Time Remaining
                  </span>
                  <span className="font-bold text-red-500">{formatTimeLeft(contest.endDate)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getPrizeIcon(contest.prize)}
                    Prize
                  </span>
                  <span className="font-semibold">{contest.prize}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Starts
                  </span>
                  <span className="font-semibold">{formatStartTime(contest.startDate)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Duration
                  </span>
                  <span className="font-semibold">{contest.duration} minutes</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getPrizeIcon(contest.prize)}
                    Prize
                  </span>
                  <span className="font-semibold text-xs">{contest.prize}</span>
                </div>
              </>
            )}
          </div>

          {contest.isLive ? (
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => onJoin && onJoin(contest.id)}
            >
              <Play className="mr-2 h-4 w-4" />
              Join Contest ({formatTimeLeft(contest.endDate)} left)
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onReminder ? onReminder(contest.id) : onJoin && onJoin(contest.id)}
            >
              <Bell className="mr-2 h-4 w-4" />
              {onReminder ? "Set Reminder" : "Join Contest"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}