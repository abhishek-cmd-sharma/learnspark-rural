import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";

interface DailyStreakProps {
  streakCount: number;
  todayCompleted: boolean;
  className?: string;
}

export function DailyStreak({ streakCount, todayCompleted, className = "" }: DailyStreakProps) {
  return (
    <div className={`cosmic-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`h-6 w-6 ${streakCount > 0 ? "text-orange-500" : "text-muted-foreground"}`} />
          <span className="font-display font-semibold">Daily Streak</span>
        </div>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="text-center">
        <motion.div
          key={streakCount}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
          className={`text-3xl font-bold ${
            streakCount > 0 ? "text-orange-500" : "text-muted-foreground"
          }`}
        >
          {streakCount}
        </motion.div>
        <div className="text-sm text-muted-foreground mb-3">
          {streakCount === 1 ? "day" : "days"}
        </div>
        
        {todayCompleted ? (
          <div className="flex items-center justify-center gap-2 text-success font-semibold text-sm">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            Today's goal completed!
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Complete today's challenge to keep your streak!
          </div>
        )}
      </div>
      
      {/* Streak Flames */}
      <div className="flex justify-center gap-1 mt-3">
        {Array.from({ length: Math.min(streakCount, 7) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-2 h-3 bg-gradient-to-t from-orange-600 to-orange-400 rounded-sm"
          />
        ))}
        {streakCount > 7 && (
          <div className="text-xs text-muted-foreground ml-2">
            +{streakCount - 7}
          </div>
        )}
      </div>
    </div>
  );
}