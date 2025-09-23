import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface AnimatedBackgroundProps {
  variant?: "stars" | "books" | "shapes" | "animals";
  density?: "low" | "medium" | "high";
  children?: React.ReactNode;
}

export function AnimatedBackground({
  variant = "stars",
  density = "medium",
  children
}: AnimatedBackgroundProps) {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const count = density === "low" ? 8 : density === "medium" ? 15 : 25;
    const newElements: FloatingElement[] = [];

    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      });
    }

    setElements(newElements);
  }, [density]);

  const renderElement = (element: FloatingElement) => {
    const { id, x, y, size, duration, delay } = element;

    switch (variant) {
      case "stars":
        return (
          <motion.div
            key={id}
            className="absolute pointer-events-none opacity-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          >
            <span className="text-yellow-400">⭐</span>
          </motion.div>
        );
      case "books":
        return (
          <motion.div
            key={id}
            className="absolute pointer-events-none opacity-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          >
            <span className="text-blue-500">📚</span>
          </motion.div>
        );
      case "shapes":
        const shapes = ["🔺", "🔸", "⬜", "🟦", "🟣", "🟡"];
        return (
          <motion.div
            key={id}
            className="absolute pointer-events-none opacity-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          >
            <span className="text-purple-400">
              {shapes[Math.floor(Math.random() * shapes.length)]}
            </span>
          </motion.div>
        );
      case "animals":
        const animals = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
        return (
          <motion.div
            key={id}
            className="absolute pointer-events-none opacity-20"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: `${size}px`,
            }}
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          >
            <span className="text-pink-400">
              {animals[Math.floor(Math.random() * animals.length)]}
            </span>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {elements.map(renderElement)}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
