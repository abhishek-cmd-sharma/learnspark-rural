import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Star, Rocket, Zap, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { StudentOnboarding, StudentOnboardingData } from "./StudentOnboarding";

interface CongratsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
  isNewUser?: boolean;
  role?: "student" | "teacher";
  onOnboardingComplete?: (data: StudentOnboardingData) => void;
}

export function CongratsPopup({ isVisible, onClose, userName, isNewUser = false, role = "student" }: CongratsPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBlastEffects, setShowBlastEffects] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setShowBlastEffects(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getWelcomeMessage = () => {
    if (isNewUser) {
      return role === "student"
        ? "Welcome to EduQuest, Future Scholar! 🌟"
        : "Welcome to EduQuest, Inspiring Teacher! 📚";
    }
    return `Welcome back, ${userName || "Learner"}! 🚀`;
  };

  const getDescription = () => {
    if (isNewUser) {
      return role === "student"
        ? "Your educational journey begins now. Let's explore, learn, and achieve greatness together!"
        : "Ready to inspire and educate? Let's create amazing learning experiences!";
    }
    return "Continue your learning adventure and unlock new achievements!";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Enhanced Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 1, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    delay: Math.random() * 1,
                    ease: "easeOut",
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    i % 4 === 0 ? "bg-yellow-400" :
                    i % 4 === 1 ? "bg-blue-400" :
                    i % 4 === 2 ? "bg-green-400" : "bg-purple-400"
                  }`}
                />
              ))}
              {/* Special star particles */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  initial={{
                    opacity: 0,
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 1.5, 1.5, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                  className="absolute text-yellow-40 text-xl"
                >
                  ⭐
                </motion.div>
              ))}
              
              {/* Blast effect particles */}
              {showBlastEffects && Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`blast-${i}`}
                  initial={{
                    opacity: 1,
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                  }}
                  animate={{
                    opacity: [1, 0],
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 2],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.3,
                    ease: "easeOut",
                  }}
                  className={`absolute rounded-full ${
                    i % 3 === 0 ? "bg-primary/50" :
                    i % 3 === 1 ? "bg-accent/50" : "bg-yellow-400/50"
                  }`}
                  style={{
                    width: `${Math.random() * 20 + 5}px`,
                    height: `${Math.random() * 20 + 5}px`,
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.3, y: 100, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, y: -50, opacity: 0, rotate: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.6,
            }}
            className="cosmic-card p-8 text-center max-w-lg w-full relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 rounded-lg"
            />
            
            {/* Pulsing rings for extra effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border-4 border-primary/30"
            />
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
              className="absolute inset-0 rounded-full border-4 border-accent/30"
            />

            {/* Welcome Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 500,
                damping: 20,
              }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl shadow-2xl relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {isNewUser ? <Rocket /> : <Trophy />}
              </motion.div>

              {/* Pulsing ring */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-primary/30"
              />
              
              {/* Sparkle effects */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles size={16} />
                </motion.div>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-display font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              🎉 Congratulations! 🎉
            </motion.h2>

            {/* Welcome Message */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-semibold mb-4"
            >
              {getWelcomeMessage()}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              {getDescription()}
            </motion.p>

            {/* Achievement Badge for new users */}
            {isNewUser && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-lg relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-yellow-200"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-25px)`,
                      }}
                    >
                      <Star size={12} fill="currentColor" />
                    </div>
                  ))}
                </motion.div>
                <Zap className="h-5 w-5 relative z-10" />
                <span className="relative z-10">First Login Achievement!</span>
                <Zap className="h-5 w-5 relative z-10" />
              </motion.div>
            )}

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="cosmic"
                  onClick={onClose}
                  className="w-full text-lg py-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isNewUser ? "Start My Journey!" : "Continue Learning!"}
                </Button>
              </motion.div>
            </motion.div>

            {/* Fun fact or tip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              💡 Tip: Complete daily quizzes to earn XP and unlock achievements!
            </motion.div>
            
            {/* Streak indicator for returning users */}
            {!isNewUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-4 flex items-center justify-center gap-2 text-orange-500"
              >
                <Flame className="h-5 w-5 animate-pulse" />
                <span className="font-semibold">Keep your learning streak alive!</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
