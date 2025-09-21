import { motion } from "framer-motion";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  rarity: "bronze" | "silver" | "gold" | "platinum";
  progress?: number;
  maxProgress?: number;
}

export function AchievementBadge({ 
  title, 
  description, 
  icon, 
  isUnlocked, 
  rarity,
  progress = 0,
  maxProgress = 1
}: AchievementBadgeProps) {
  const progressPercentage = (progress / maxProgress) * 100;
  
  const rarityColors = {
    bronze: "from-level-bronze to-orange-600",
    silver: "from-level-silver to-gray-400", 
    gold: "from-level-gold to-yellow-500",
    platinum: "from-level-platinum to-purple-400"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`cosmic-card p-4 text-center relative overflow-hidden ${
        isUnlocked ? "opacity-100" : "opacity-60"
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isUnlocked ? 1 : 0.6, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Badge Icon */}
      <div className={`
        badge-shine w-16 h-16 mx-auto mb-3 rounded-full 
        bg-gradient-to-br ${rarityColors[rarity]} 
        flex items-center justify-center text-white text-2xl
        ${isUnlocked ? "animate-level-up" : ""}
      `}>
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="font-display font-bold text-sm mb-1">{title}</h3>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      
      {/* Progress Bar (if not unlocked) */}
      {!isUnlocked && maxProgress > 1 && (
        <div className="space-y-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {progress} / {maxProgress}
          </div>
        </div>
      )}
      
      {/* Rarity Indicator */}
      <div className={`
        absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold
        bg-gradient-to-r ${rarityColors[rarity]} text-white capitalize
      `}>
        {rarity}
      </div>
      
      {/* Unlocked Indicator */}
      {isUnlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
          className="absolute -top-2 -left-2 w-6 h-6 bg-success rounded-full flex items-center justify-center text-white text-xs"
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}