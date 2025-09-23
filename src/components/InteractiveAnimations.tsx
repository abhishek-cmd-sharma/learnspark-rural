import { motion, useAnimation, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface BounceCardProps {
  children: React.ReactNode;
  className?: string;
  bounceIntensity?: number;
}

export function BounceCard({ children, className = "", bounceIntensity = 1.05 }: BounceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      whileHover={{
        scale: bounceIntensity,
        rotate: [0, -1, 1, -1, 0],
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: bounceIntensity * 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${10 + (i % 2) * 80}%`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
                y: [-20, -40, -60],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

interface SparkleEffectProps {
  trigger: boolean;
  position?: { x: number; y: number };
}

export function SparkleEffect({ trigger, position }: SparkleEffectProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (position?.x || 50) + (Math.random() - 0.5) * 100,
        y: (position?.y || 50) + (Math.random() - 0.5) * 100,
      }));
      setSparkles(newSparkles);

      const timer = setTimeout(() => setSparkles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, position]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-yellow-400 text-2xl"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
            rotate: [0, 180, 360],
            y: [0, -30, -60],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

interface WavingHandProps {
  className?: string;
}

export function WavingHand({ className = "" }: WavingHandProps) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{
        rotate: [0, 14, -8, 14, -4, 10, 0, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      }}
    >
      👋
    </motion.div>
  );
}

interface FloatingBalloonsProps {
  count?: number;
}

export function FloatingBalloons({ count = 5 }: FloatingBalloonsProps) {
  const balloons = ["🎈", "🎈", "🎈", "🎈", "🎈"];
  const colors = ["text-red-400", "text-blue-400", "text-green-400", "text-purple-400", "text-pink-400"];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className={`absolute ${colors[i % colors.length]} text-4xl`}
          style={{
            left: `${10 + (i * 15)}%`,
            bottom: "-10%",
          }}
          animate={{
            y: [-100, -window.innerHeight - 100],
            x: [0, Math.sin(i) * 50, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear",
          }}
        >
          {balloons[i % balloons.length]}
        </motion.div>
      ))}
    </div>
  );
}

interface RainbowTextProps {
  text: string;
  className?: string;
}

export function RainbowText({ text, className = "" }: RainbowTextProps) {
  const colors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-green-500",
    "text-blue-500",
    "text-indigo-500",
    "text-purple-500",
  ];

  return (
    <div className={`flex ${className}`}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          className={`${colors[index % colors.length]} font-bold`}
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            delay: index * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
}

interface ConfettiEffectProps {
  trigger: boolean;
}

export function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; shape: string }>>([]);

  useEffect(() => {
    if (trigger) {
      const shapes = ["⬜", "⬛", "🔺", "🔸", "⬟", "⬢"];
      const colors = ["text-red-500", "text-blue-500", "text-green-500", "text-yellow-500", "text-purple-500", "text-pink-500"];

      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particle.color} text-2xl`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            scale: [0, 1, 0.5],
            opacity: [1, 1, 0],
            rotate: [0, 360],
            y: [0, window.innerHeight * 0.8],
            x: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        >
          {particle.shape}
        </motion.div>
      ))}
    </div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.8,
          delay,
          ease: "easeOut",
        },
      });
    }
  }, [controls, isInView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
