import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Trophy, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface AchievementPopupProps {
  achievement: {
    title: string;
    description: string;
    icon: React.ReactNode;
    rarity: "bronze" | "silver" | "gold" | "platinum";
    xpReward: number;
  } | null;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (achievement) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const rarityColors = {
    bronze: "from-level-bronze to-orange-600",
    silver: "from-level-silver to-gray-400",
    gold: "from-level-gold to-yellow-500",
    platinum: "from-level-platinum to-purple-400"
  };

  const rarityEmojis = {
    bronze: "🥉",
    silver: "🥈", 
    gold: "🥇",
    platinum: "💎"
  };

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
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

            {/* Achievement Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${rarityColors[achievement.rarity]} flex items-center justify-center text-white text-3xl badge-shine`}
            >
              {achievement.icon}
            </motion.div>

            {/* Achievement Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-display font-bold mb-2"
            >
              Achievement Unlocked! {rarityEmojis[achievement.rarity]}
            </motion.h2>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold mb-2 text-primary"
            >
              {achievement.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-6"
            >
              {achievement.description}
            </motion.p>

            {/* XP Reward */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-xp-primary to-xp-secondary text-white px-4 py-2 rounded-full font-semibold mb-6"
            >
              <Star className="h-4 w-4" />
              +{achievement.xpReward} XP
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button variant="cosmic" onClick={onClose} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Continue Learning!
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}