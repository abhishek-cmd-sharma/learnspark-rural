import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

export function XPBar({ currentXP, nextLevelXP, level, className = "" }: XPBarProps) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className={`cosmic-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="badge-shine w-8 h-8 rounded-full bg-gradient-to-r from-level-gold to-level-bronze flex items-center justify-center text-white font-bold text-sm">
            {level}
          </div>
          <span className="font-display font-semibold text-lg">Level {level}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentXP} / {nextLevelXP} XP
        </div>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className="xp-bar h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-center">
        {nextLevelXP - currentXP} XP to next level
      </div>
    </div>
  );
}