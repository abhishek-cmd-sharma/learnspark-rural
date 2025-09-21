import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Zap, Star, Crown } from "lucide-react";

interface LevelUpPopupProps {
  isOpen: boolean;
  newLevel: number;
  xpEarned: number;
  onClose: () => void;
}

export function LevelUpPopup({ isOpen, newLevel, xpEarned, onClose }: LevelUpPopupProps) {
  const getLevelReward = (level: number) => {
    if (level % 10 === 0) return { type: "Legendary", icon: <Crown />, color: "from-purple-500 to-pink-500" };
    if (level % 5 === 0) return { type: "Epic", icon: <Star />, color: "from-yellow-500 to-orange-500" };
    return { type: "Achievement", icon: <Zap />, color: "from-blue-500 to-cyan-500" };
  };

  const reward = getLevelReward(newLevel);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Starburst Background */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.3, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="cosmic-card p-8 text-center max-w-md w-full relative overflow-hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Level Badge */}
            <motion.div
              initial={{ scale: 0, rotate: 360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 500 
              }}
              className="relative mx-auto mb-6"
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${reward.color} flex items-center justify-center text-white text-4xl badge-shine animate-level-up`}>
                {newLevel}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white text-sm"
              >
                ✓
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              LEVEL UP!
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <div className="text-2xl font-bold mb-1">Level {newLevel}</div>
              <div className="text-muted-foreground">You're becoming a learning champion!</div>
            </motion.div>

            {/* XP Earned */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-xp-primary to-xp-secondary text-white px-6 py-3 rounded-full font-semibold mb-6"
            >
              <Star className="h-5 w-5" />
              +{xpEarned} XP Earned
            </motion.div>

            {/* Reward Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${reward.color} text-white text-sm font-semibold`}>
                {reward.icon}
                {reward.type} Unlocked!
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button variant="cosmic" onClick={onClose} className="w-full">
                <Zap className="mr-2 h-4 w-4" />
                Keep Going!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}